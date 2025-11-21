const db = require('../db');

async function getAll() {
  // Prefer normalized table when available
  try {
    const rows = db.prepare('SELECT id, username, password, role, name, isSenior FROM users_norm').all();
    if (rows && rows.length) {
      return rows.map(r => ({ id: String(r.id), username: r.username, password: r.password, role: r.role, name: r.name, isSenior: !!r.isSenior }));
    }
  } catch (e) {
    // ignore and fallback to json table
  }
  const rows = db.prepare('SELECT json FROM users').all();
  return rows.map(r => JSON.parse(r.json));
}

async function findByCredentials(username, password, role) {
  // try normalized lookup first
  try {
    const row = db.prepare('SELECT id, username, password, role, name, isSenior FROM users_norm WHERE username = ? AND password = ? AND role = ?').get(username, password, role);
    if (row) return { id: String(row.id), username: row.username, password: row.password, role: row.role, name: row.name, isSenior: !!row.isSenior };
  } catch (e) {
    // ignore
  }
  const all = await getAll();
  return all.find((u) => u.username === username && u.password === password && u.role === role);
}

async function getById(id) {
  const sid = String(id);
  try {
    const row = db.prepare('SELECT id, username, password, role, name, isSenior FROM users_norm WHERE id = ?').get(sid);
    if (row) return { id: String(row.id), username: row.username, password: row.password, role: row.role, name: row.name, isSenior: !!row.isSenior };
  } catch (e) {
    // ignore
  }
  const row = db.prepare('SELECT json FROM users WHERE id = ?').get(sid);
  return row ? JSON.parse(row.json) : null;
}

function nextNumericId(items) {
  const nums = items.map(i => {
    const n = Number(i.id);
    return Number.isInteger(n) && n > 0 ? n : null;
  }).filter(Boolean).sort((a,b)=>a-b);
  let cur = 1;
  for (const n of nums) {
    if (n === cur) cur++;
    else if (n > cur) break;
  }
  return cur;
}

async function create(payload) {
  const providedId = payload && payload.id !== undefined && payload.id !== null ? String(payload.id) : null;
  if (providedId) {
    const exists = await getById(providedId);
    if (exists) throw new Error('user id already exists');
    const item = { id: providedId, ...payload };
    db.prepare('INSERT INTO users (id, json) VALUES (?, ?)').run(String(providedId), JSON.stringify(item));
    // also attempt to insert normalized row
    try {
      db.prepare('INSERT OR REPLACE INTO users_norm (id, username, password, role, name, isSenior) VALUES (?, ?, ?, ?, ?, ?)')
        .run(String(providedId), payload.username || null, payload.password || null, payload.role || null, payload.name || null, payload.isSenior ? 1 : 0);
    } catch (e) {
      // ignore if normalized table not present
    }
    return item;
  }
  const all = await getAll();
  const id = nextNumericId(all);
  const item = { id, ...payload };
  db.prepare('INSERT INTO users (id, json) VALUES (?, ?)').run(String(id), JSON.stringify(item));
  try {
    db.prepare('INSERT OR REPLACE INTO users_norm (id, username, password, role, name, isSenior) VALUES (?, ?, ?, ?, ?, ?)')
      .run(String(id), payload.username || null, payload.password || null, payload.role || null, payload.name || null, payload.isSenior ? 1 : 0);
  } catch (e) {
    // ignore
  }
  return item;
}

module.exports = { getAll, findByCredentials, getById, create };

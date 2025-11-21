const db = require('../db');

async function getAll() {
  const rows = db.prepare('SELECT json FROM admins').all();
  return rows.map(r => JSON.parse(r.json));
}

async function getById(id) {
  const row = db.prepare('SELECT json FROM admins WHERE id = ?').get(String(id));
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
  const all = await getAll();
  const id = nextNumericId(all);
  const item = { id, ...payload };
  db.prepare('INSERT INTO admins (id, json) VALUES (?, ?)').run(String(id), JSON.stringify(item));
  return item;
}

async function update(id, patch) {
  const existing = await getById(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  db.prepare('UPDATE admins SET json = ? WHERE id = ?').run(JSON.stringify(updated), String(id));
  return updated;
}

async function remove(id) {
  db.prepare('DELETE FROM admins WHERE id = ?').run(String(id));
}

module.exports = { getAll, getById, create, update, remove };

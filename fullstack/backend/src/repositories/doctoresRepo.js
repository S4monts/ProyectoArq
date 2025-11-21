const db = require('../db');

async function getAll() {
  // prefer normalized table when present
  try {
    const rows = db.prepare('SELECT id, nombre, apellido, email, telefono FROM doctores_norm').all();
    if (rows && rows.length) {
      return rows.map(r => ({ id: String(r.id), nombre: r.nombre, apellido: r.apellido, email: r.email, telefono: r.telefono }));
    }
  } catch (e) {
    // fallback
  }
  const rows = db.prepare('SELECT json FROM doctores').all();
  return rows.map(r => JSON.parse(r.json));
}

function extractNumber(id, prefix) {
  if (!id) return null;
  const s = String(id);
  if (prefix) {
    if (!s.startsWith(prefix)) return null;
    const suffix = s.slice(prefix.length);
    const n = Number(suffix);
    return Number.isInteger(n) ? n : null;
  }
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

function nextIdWithPrefix(items, prefix) {
  const nums = items.map(i => extractNumber(i.id, prefix)).filter(Boolean).sort((a,b)=>a-b);
  let cur = 1;
  for (const n of nums) {
    if (n === cur) cur++;
    else if (n > cur) break;
  }
  return prefix ? `${prefix}${cur}` : String(cur);
}

async function create(payload) {
  // if caller provided an id, use it if not exists
  const providedId = payload && payload.id !== undefined && payload.id !== null ? String(payload.id) : null;
  if (providedId) {
    const exists = await getAll();
    if (exists.find(e => String(e.id) === String(providedId))) throw new Error('doctor id already exists');
    const item = { id: providedId, ...payload };
    db.prepare('INSERT INTO doctores (id, json) VALUES (?, ?)').run(String(providedId), JSON.stringify(item));
    try {
      db.prepare('INSERT OR REPLACE INTO doctores_norm (id, nombre, apellido, email, telefono) VALUES (?, ?, ?, ?, ?)')
        .run(String(providedId), payload.nombre || null, payload.apellido || null, payload.email || null, payload.telefono || null);
    } catch (e) {}
    return item;
  }
  const all = await getAll();
  const id = nextIdWithPrefix(all, 'D-');
  const item = { id, ...payload };
  db.prepare('INSERT INTO doctores (id, json) VALUES (?, ?)').run(String(id), JSON.stringify(item));
  try {
    db.prepare('INSERT OR REPLACE INTO doctores_norm (id, nombre, apellido, email, telefono) VALUES (?, ?, ?, ?, ?)')
      .run(String(id), payload.nombre || null, payload.apellido || null, payload.email || null, payload.telefono || null);
  } catch (e) {}
  return item;
}

async function remove(id) {
  db.prepare('DELETE FROM doctores WHERE id = ?').run(String(id));
}

module.exports = { getAll, create, remove };

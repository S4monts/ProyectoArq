const db = require('../db');

async function getAll() {
  try {
    const rows = db.prepare('SELECT id, status, createdAt, pacienteId FROM ingresos_norm').all();
    if (rows && rows.length) return rows.map(r => ({ id: String(r.id), status: r.status, createdAt: r.createdAt, pacienteId: r.pacienteId }));
  } catch (e) {}
  const rows = db.prepare('SELECT json FROM ingresos').all();
  return rows.map(r => JSON.parse(r.json));
}

async function getByStatus(status) {
  const all = await getAll();
  if (!status) return all;
  return all.filter((i) => i.status === status);
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
  const item = { id, status: 'pendiente', createdAt: new Date().toISOString(), ...payload };
  db.prepare('INSERT INTO ingresos (id, json) VALUES (?, ?)').run(String(id), JSON.stringify(item));
  try {
    db.prepare('INSERT OR REPLACE INTO ingresos_norm (id, status, createdAt, pacienteId) VALUES (?, ?, ?, ?)')
      .run(String(id), item.status, item.createdAt, item.pacienteId || null);
  } catch (e) {}
  return item;
}

async function update(id, patch) {
  const existingRow = db.prepare('SELECT json FROM ingresos WHERE id = ?').get(String(id));
  if (!existingRow) return null;
  const existing = JSON.parse(existingRow.json);
  const updated = { ...existing, ...patch };
  db.prepare('UPDATE ingresos SET json = ? WHERE id = ?').run(JSON.stringify(updated), String(id));
  try {
    db.prepare('INSERT OR REPLACE INTO ingresos_norm (id, status, createdAt, pacienteId) VALUES (?, ?, ?, ?)')
      .run(String(id), updated.status, updated.createdAt, updated.pacienteId || null);
  } catch (e) {}
  return updated;
}

module.exports = { getAll, getByStatus, create, update };

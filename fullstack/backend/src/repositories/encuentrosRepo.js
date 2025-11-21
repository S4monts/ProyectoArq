const db = require('../db');

async function getAll(filters = {}) {
  try {
    const rows = db.prepare('SELECT id, fecha, hora, doctorId, pacienteId, createdAt FROM encuentros_norm').all();
    let all = rows.map(r => ({ id: String(r.id), fecha: r.fecha, hora: r.hora, doctorId: r.doctorId, pacienteId: r.pacienteId, createdAt: r.createdAt }));
    if (filters.doctorId) all = all.filter((e) => String(e.doctorId) === String(filters.doctorId));
    return all;
  } catch (e) {}
  const rows = db.prepare('SELECT json FROM encuentros').all();
  let all = rows.map(r => JSON.parse(r.json));
  if (filters.doctorId) all = all.filter((e) => String(e.doctorId) === String(filters.doctorId));
  return all;
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
  const item = { id, createdAt: new Date().toISOString(), ...payload };
  db.prepare('INSERT INTO encuentros (id, json) VALUES (?, ?)').run(String(id), JSON.stringify(item));
  try {
    db.prepare('INSERT OR REPLACE INTO encuentros_norm (id, fecha, hora, doctorId, pacienteId, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .run(String(id), item.fecha || null, item.hora || null, item.doctorId || null, item.pacienteId || null, item.createdAt || null);
  } catch (e) {}
  return item;
}

async function findConflicts(doctorId, fecha, hora) {
  const all = await getAll();
  return all.find((e) => String(e.doctorId) === String(doctorId) && e.fecha === fecha && e.hora === hora);
}

async function removeByPacienteId(pacienteId) {
  try {
    const rows = db.prepare('SELECT id, fecha, hora, doctorId, pacienteId, createdAt FROM encuentros_norm').all();
    const all = rows.map(r => ({ id: r.id, fecha: r.fecha, hora: r.hora, doctorId: r.doctorId, pacienteId: r.pacienteId, createdAt: r.createdAt }));
    const toRemove = all.filter(e => String(e.pacienteId) === String(pacienteId));
    const del = db.prepare('DELETE FROM encuentros WHERE id = ?');
    let removed = 0;
    for (const r of toRemove) { del.run(String(r.id)); removed++; }
    return removed;
  } catch (e) {}
  const rows = db.prepare('SELECT id, json FROM encuentros').all();
  const all = rows.map(r => ({ id: r.id, ...JSON.parse(r.json) }));
  const toRemove = all.filter(e => String(e.pacienteId) === String(pacienteId));
  const del = db.prepare('DELETE FROM encuentros WHERE id = ?');
  let removed = 0;
  for (const r of toRemove) { del.run(String(r.id)); removed++; }
  return removed;
}

module.exports = { getAll, create, findConflicts, removeByPacienteId };

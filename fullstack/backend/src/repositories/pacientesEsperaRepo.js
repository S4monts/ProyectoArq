const db = require('../db');

async function getAll() {
  try {
    const rows = db.prepare('SELECT id, nombre, apellido, dni, edad, habitacion, cama, createdBy FROM pacientes_espera_norm').all();
    if (rows && rows.length) {
      return rows.map(r => ({ id: String(r.id), nombre: r.nombre, apellido: r.apellido, dni: r.dni, edad: r.edad, habitacion: r.habitacion, cama: r.cama, createdBy: r.createdBy }));
    }
  } catch (e) {}
  const rows = db.prepare('SELECT json FROM pacientes_espera').all();
  return rows.map(r => JSON.parse(r.json));
}

async function getById(id) {
  const sid = String(id);
  try {
    const row = db.prepare('SELECT id, nombre, apellido, dni, edad, habitacion, cama, createdBy FROM pacientes_espera_norm WHERE id = ?').get(sid);
    if (row) return { id: String(row.id), nombre: row.nombre, apellido: row.apellido, dni: row.dni, edad: row.edad, habitacion: row.habitacion, cama: row.cama, createdBy: row.createdBy };
  } catch (e) {}
  const row = db.prepare('SELECT json FROM pacientes_espera WHERE id = ?').get(sid);
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
  db.prepare('INSERT INTO pacientes_espera (id, json) VALUES (?, ?)').run(String(id), JSON.stringify(item));
  try {
    db.prepare('INSERT OR REPLACE INTO pacientes_espera_norm (id, nombre, apellido, dni, edad, habitacion, cama, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(String(id), payload.nombre || null, payload.apellido || null, payload.dni || null, payload.edad || null, payload.habitacion || null, payload.cama || null, payload.createdBy || null);
  } catch (e) {}
  return item;
}

async function remove(id) {
  db.prepare('DELETE FROM pacientes_espera WHERE id = ?').run(String(id));
}

module.exports = { getAll, getById, create, remove };

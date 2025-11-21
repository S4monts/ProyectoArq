const db = require('../db');

async function getAllByPaciente(pacienteId) {
  try {
    const rows = db.prepare('SELECT id, pacienteId, timestamp, nota, procedimientoMedicamento, detalleProcedimiento, authorId, encuentroId FROM historias_norm').all();
    const all = rows.map(r => ({ id: String(r.id), pacienteId: r.pacienteId, timestamp: r.timestamp, nota: r.nota, procedimientoMedicamento: r.procedimientoMedicamento, detalleProcedimiento: r.detalleProcedimiento, authorId: r.authorId, encuentroId: r.encuentroId }));
    return all.filter((h) => String(h.pacienteId) === String(pacienteId));
  } catch (e) {
    const rows = db.prepare('SELECT json FROM historias').all();
    const all = rows.map(r => JSON.parse(r.json));
    return all.filter((h) => String(h.pacienteId) === String(pacienteId));
  }
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

async function addEvolucion(pacienteId, payload) {
  // attempt to insert into normalized table first
  try {
    const row = db.prepare('SELECT MAX(id) as maxId FROM historias_norm').get();
    const next = row && row.maxId ? Number(row.maxId) + 1 : 1;
    const item = { id: next, pacienteId, timestamp: new Date().toISOString(), ...payload };
    db.prepare('INSERT INTO historias_norm (id, pacienteId, timestamp, nota, procedimientoMedicamento, detalleProcedimiento, authorId, encuentroId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(String(item.id), item.pacienteId || null, item.timestamp || null, item.nota || null, item.procedimientoMedicamento || null, item.detalleProcedimiento || null, item.authorId || null, item.encuentroId || null);
    return item;
  } catch (e) {
    const rows = db.prepare('SELECT json FROM historias').all();
    const all = rows.map(r => JSON.parse(r.json));
    const id = nextNumericId(all);
    const item = { id, pacienteId, timestamp: new Date().toISOString(), ...payload };
    db.prepare('INSERT INTO historias (id, json) VALUES (?, ?)').run(String(id), JSON.stringify(item));
    return item;
  }
}

module.exports = { getAllByPaciente, addEvolucion };

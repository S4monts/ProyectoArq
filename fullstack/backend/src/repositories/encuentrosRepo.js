const { readJSON, writeJSON, nextId } = require('../utils/fileStore');

const FILE = 'encuentros.json';

async function getAll(filters = {}) {
  const all = await readJSON(FILE);
  let res = all;
  if (filters.doctorId) res = res.filter((e) => String(e.doctorId) === String(filters.doctorId));
  return res;
}

async function create(payload) {
  const all = await readJSON(FILE);
  const id = nextId(all);
  const item = { id, createdAt: new Date().toISOString(), ...payload };
  all.push(item);
  await writeJSON(FILE, all);
  return item;
}

async function findConflicts(doctorId, fecha, hora) {
  const all = await readJSON(FILE);
  return all.find((e) => e.doctorId === doctorId && e.fecha === fecha && e.hora === hora);
}

async function removeByPacienteId(pacienteId) {
  let all = await readJSON(FILE);
  const before = all.length;
  all = all.filter((e) => String(e.pacienteId) !== String(pacienteId));
  await writeJSON(FILE, all);
  return before - all.length;
}

module.exports = { getAll, create, findConflicts, removeByPacienteId };

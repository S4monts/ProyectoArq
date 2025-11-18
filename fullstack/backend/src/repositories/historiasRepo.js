const { readJSON, writeJSON, nextId } = require('../utils/fileStore');

const FILE = 'historias.json';

async function getAllByPaciente(pacienteId) {
  const all = await readJSON(FILE);
  return all.filter((h) => String(h.pacienteId) === String(pacienteId));
}

async function addEvolucion(pacienteId, payload) {
  const all = await readJSON(FILE);
  const id = nextId(all);
  const item = { id, pacienteId, timestamp: new Date().toISOString(), ...payload };
  all.push(item);
  await writeJSON(FILE, all);
  return item;
}

module.exports = { getAllByPaciente, addEvolucion };

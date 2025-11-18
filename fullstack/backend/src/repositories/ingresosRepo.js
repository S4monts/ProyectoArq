const { readJSON, writeJSON, nextId } = require('../utils/fileStore');

const FILE = 'ingresos.json';

async function getAll() {
  return await readJSON(FILE);
}

async function getByStatus(status) {
  const all = await readJSON(FILE);
  if (!status) return all;
  return all.filter((i) => i.status === status);
}

async function create(payload) {
  const all = await readJSON(FILE);
  const id = nextId(all);
  const item = { id, status: 'pendiente', createdAt: new Date().toISOString(), ...payload };
  all.push(item);
  await writeJSON(FILE, all);
  return item;
}

async function update(id, patch) {
  const all = await readJSON(FILE);
  const idx = all.findIndex((i) => String(i.id) === String(id));
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  await writeJSON(FILE, all);
  return all[idx];
}

module.exports = { getAll, getByStatus, create, update };

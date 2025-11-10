// Servicio que encapsula acceso file-based a data/pacientes.json
const path = require('path');
const { readJSON, writeJSON } = require('../utils/fileStore');
const DATA_FILE = path.join(__dirname, '../../data/pacientes.json');

async function getAll() {
  return await readJSON(DATA_FILE);
}

async function getById(id) {
  const list = await readJSON(DATA_FILE);
  return list.find(p => p.id === id) || null;
}

async function create(data) {
  const list = await readJSON(DATA_FILE);
  const nextId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
  const nuevo = { id: nextId, ...data };
  list.push(nuevo);
  await writeJSON(DATA_FILE, list);
  return nuevo;
}

async function update(id, updates) {
  const list = await readJSON(DATA_FILE);
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  await writeJSON(DATA_FILE, list);
  return list[idx];
}

async function remove(id) {
  const list = await readJSON(DATA_FILE);
  const newList = list.filter(p => p.id !== id);
  if (newList.length === list.length) return false;
  await writeJSON(DATA_FILE, newList);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
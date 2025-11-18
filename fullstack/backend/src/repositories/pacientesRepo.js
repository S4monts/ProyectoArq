const { readJSON, writeJSON, nextId } = require('../utils/fileStore');

const FILE = 'pacientes.json';

async function getAll() {
  return await readJSON(FILE);
}

async function getById(id) {
  const all = await readJSON(FILE);
  return all.find((p) => String(p.id) === String(id));
}

async function create(payload) {
  const all = await readJSON(FILE);
  const id = nextId(all);
  const item = { id, ...payload };
  all.push(item);
  await writeJSON(FILE, all);
  return item;
}

async function remove(id) {
  let all = await readJSON(FILE);
  all = all.filter((p) => String(p.id) !== String(id));
  await writeJSON(FILE, all);
}

module.exports = { getAll, getById, create, remove };

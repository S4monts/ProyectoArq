const { readJSON, writeJSON, nextId } = require('../utils/fileStore');

const FILE = 'admins.json';

async function getAll() {
  return await readJSON(FILE);
}

async function getById(id) {
  const all = await readJSON(FILE);
  return all.find((a) => String(a.id) === String(id));
}

async function create(payload) {
  const all = await readJSON(FILE);
  const id = nextId(all);
  const item = { id, ...payload };
  all.push(item);
  await writeJSON(FILE, all);
  return item;
}

async function update(id, patch) {
  const all = await readJSON(FILE);
  const idx = all.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  await writeJSON(FILE, all);
  return all[idx];
}

async function remove(id) {
  let all = await readJSON(FILE);
  all = all.filter((a) => String(a.id) !== String(id));
  await writeJSON(FILE, all);
}

module.exports = { getAll, getById, create, update, remove };

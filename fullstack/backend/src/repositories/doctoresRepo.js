const { readJSON, writeJSON, nextId } = require('../utils/fileStore');

const FILE = 'doctores.json';

async function getAll() {
  return await readJSON(FILE);
}

async function create(payload) {
  const all = await readJSON(FILE);
  const id = nextId(all, 'D-');
  const item = { id, ...payload };
  all.push(item);
  await writeJSON(FILE, all);
  return item;
}

module.exports = { getAll, create };

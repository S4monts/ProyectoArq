const { readJSON, writeJSON, nextId } = require('../utils/fileStore');

const FILE = 'users.json';

async function getAll() {
  return await readJSON(FILE);
}

async function findByCredentials(username, password, role) {
  const all = await readJSON(FILE);
  return all.find((u) => u.username === username && u.password === password && u.role === role);
}

async function getById(id) {
  const all = await readJSON(FILE);
  return all.find((u) => String(u.id) === String(id));
}

module.exports = { getAll, findByCredentials, getById };

const { readJSON, writeJSON, nextId } = require('../utils/fileStore');
const crypto = require('crypto');

const FILE = 'users.json';

async function getAll() {
  return await readJSON(FILE);
}

async function findByCredentials(username, password, role) {
  const all = await readJSON(FILE);
  const credentialDigest = crypto.createHash('sha256').update(String(password)).digest('hex');
  return all.find((u) => u.username === username && u.credentialDigest === credentialDigest && u.role === role);
}

async function getById(id) {
  const all = await readJSON(FILE);
  return all.find((u) => String(u.id) === String(id));
}

module.exports = { getAll, findByCredentials, getById };

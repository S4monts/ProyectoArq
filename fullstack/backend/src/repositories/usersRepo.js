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

async function create(payload) {
  const all = await readJSON(FILE);
  // If caller provided an id (e.g., 'D-1'), use it if it's not already taken
  let id;
  if (payload && payload.id) {
    id = payload.id;
    const exists = all.find((u) => String(u.id) === String(id));
    if (exists) throw new Error('user id already exists');
  } else {
    id = nextId(all);
  }
  const item = { id, ...payload };
  all.push(item);
  await writeJSON(FILE, all);
  return item;
}

module.exports = { getAll, findByCredentials, getById, create };

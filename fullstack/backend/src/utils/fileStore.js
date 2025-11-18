const fs = require('fs').promises;
const path = require('path');

// NOTE: This file uses JSON files as the persistence layer.
// TODO: replace readJSON/writeJSON with DB queries (e.g., Sequelize/Mongoose)

const dataDir = path.join(__dirname, '..', 'data');

async function ensureFile(filename, initialData = []) {
  const filePath = path.join(dataDir, filename);
  try {
    await fs.access(filePath);
  } catch (err) {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
  }
  return filePath;
}

async function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  await ensureFile(filename, []);
  const raw = await fs.readFile(filePath, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

async function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  await ensureFile(filename, data);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function nextId(list, prefix = '') {
  if (!Array.isArray(list) || list.length === 0) return prefix ? `${prefix}1` : 1;
  const ids = list.map((i) => {
    if (typeof i.id === 'number') return i.id;
    if (typeof i.id === 'string' && prefix && i.id.startsWith(prefix)) {
      const n = parseInt(i.id.slice(prefix.length), 10);
      return Number.isNaN(n) ? 0 : n;
    }
    return 0;
  });
  const max = Math.max(...ids);
  if (prefix) return `${prefix}${max + 1}`;
  return max + 1;
}

module.exports = { ensureFile, readJSON, writeJSON, nextId, dataDir };

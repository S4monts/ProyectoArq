const fs = require('fs').promises;
const path = require('path');

async function ensureFile(filePath, initial = '[]') {
  try {
    await fs.access(filePath);
  } catch (err) {
    // crear directorio si no existe y escribir valor inicial
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, initial, 'utf8');
  }
}

async function readJSON(filePath) {
  await ensureFile(filePath);
  const content = await fs.readFile(filePath, 'utf8');
  try {
    return JSON.parse(content || '[]');
  } catch (err) {
    // si el JSON está corrupto, lo reseteamos a []
    await fs.writeFile(filePath, '[]', 'utf8');
    return [];
  }
}

async function writeJSON(filePath, data) {
  await ensureFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  ensureFile,
  readJSON,
  writeJSON
};
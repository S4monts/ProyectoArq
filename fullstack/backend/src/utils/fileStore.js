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
    // Log parse errors to help debugging when JSON files are corrupted
    console.error(`fileStore.readJSON: failed to parse ${filePath}:`, err.message);
    // Optionally dump the raw content for debugging (commented out by default)
    // console.error('raw file content:', raw);
    return [];
  }
}

async function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  await ensureFile(filename, data);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function nextId(list, prefix = '') {
  // If no items, start at 1 (or prefix+1)
  if (!Array.isArray(list) || list.length === 0) return prefix ? `${prefix}1` : 1;

  // Build a set of used numeric IDs (for prefixed IDs, extract number part)
  const used = new Set();
  for (const item of list) {
    const id = item && item.id;
    if (prefix) {
      // Look for string ids that start with the prefix, e.g. 'D-3'
      if (typeof id === 'string' && id.startsWith(prefix)) {
        const numPart = id.slice(prefix.length);
        const n = parseInt(numPart, 10);
        if (!Number.isNaN(n) && n > 0) used.add(n);
      }
      // If someone stored numeric ids alongside prefixed ones, ignore them for prefix generation
    } else {
      // No prefix: accept numeric ids and numeric-strings
      if (typeof id === 'number' && Number.isInteger(id) && id > 0) used.add(id);
      else if (typeof id === 'string' && /^\d+$/.test(id)) {
        const n = parseInt(id, 10);
        if (!Number.isNaN(n) && n > 0) used.add(n);
      }
    }
  }

  // Find the smallest positive integer not in the set (recycle gaps)
  let n = 1;
  while (used.has(n)) n += 1;

  return prefix ? `${prefix}${n}` : n;
}

module.exports = { ensureFile, readJSON, writeJSON, nextId, dataDir };

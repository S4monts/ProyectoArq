const { readJSON, writeJSON, nextId } = require('./fileStore');

const FILE = 'activities.json';

async function log(action, byUserId, byUserName, targetType, targetId, details = {}) {
  const all = await readJSON(FILE);
  const id = nextId(all);
  const item = { id, action, byUserId, byUserName, targetType, targetId, details, timestamp: new Date().toISOString() };
  all.push(item);
  await writeJSON(FILE, all);
  return item;
}

module.exports = { log };

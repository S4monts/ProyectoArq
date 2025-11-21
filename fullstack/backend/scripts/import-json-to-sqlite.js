const fs = require('fs');
const path = require('path');
const db = require('../src/db');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const backupDir = path.join(__dirname, '..', 'src', 'data_backup');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

function tableNameFromFile(file) {
  return path.basename(file, '.json');
}

function ensureTable(name) {
  db.prepare(`CREATE TABLE IF NOT EXISTS ${name} (id TEXT PRIMARY KEY, json TEXT NOT NULL)`).run();
}

function importFile(filePath) {
  const file = path.basename(filePath);
  const table = tableNameFromFile(file);
  ensureTable(table);
  const raw = fs.readFileSync(filePath, 'utf8');
  let arr = [];
  try {
    arr = JSON.parse(raw) || [];
  } catch (e) {
    console.error('Skipping file (invalid JSON):', filePath, e.message);
    return { file, imported: 0 };
  }
  const insert = db.prepare(`INSERT OR REPLACE INTO ${table} (id, json) VALUES (?, ?)`);
  const insertMany = db.transaction((items) => {
    for (const it of items) {
      const id = (it && it.id !== undefined && it.id !== null) ? String(it.id) : (Math.random().toString(36).slice(2,10));
      insert.run(id, JSON.stringify(it));
    }
  });
  insertMany(arr);
  // copy to backup
  const dest = path.join(backupDir, file);
  fs.copyFileSync(filePath, dest);
  return { file, imported: arr.length, backup: dest };
}

function main() {
  if (!fs.existsSync(dataDir)) {
    console.error('Data directory not found:', dataDir);
    process.exit(1);
  }
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  const results = [];
  for (const f of files) {
    // skip DB file if present
    if (f === 'medicor.db') continue;
    const full = path.join(dataDir, f);
    results.push(importFile(full));
  }
  console.log('Import complete:');
  results.forEach(r => console.log(`- ${r.file}: imported=${r.imported} backup=${r.backup || 'n/a'}`));
}

if (require.main === module) main();

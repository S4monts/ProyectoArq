const db = require('../db');

function createTable(name) {
  const stmt = `CREATE TABLE IF NOT EXISTS ${name} (id TEXT PRIMARY KEY, json TEXT NOT NULL)`;
  db.prepare(stmt).run();
}

function main() {
  console.log('Running DB init...');
  const tables = [
    'users', 'admins', 'doctores', 'pacientes', 'pacientes_espera', 'ingresos', 'encuentros', 'activities', 'historias'
  ];
  tables.forEach(t => createTable(t));
  console.log('Tables created:', tables.join(', '));
  console.log('DB init complete. DB file at:', db.name || 'medicor.db');
}

if (require.main === module) main();

module.exports = { createTable };

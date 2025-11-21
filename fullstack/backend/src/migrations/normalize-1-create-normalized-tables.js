const db = require('../db');

function run() {
  console.log('Creating normalized tables...');
  // users_norm
  db.prepare(`CREATE TABLE IF NOT EXISTS users_norm (
    id TEXT PRIMARY KEY,
    username TEXT,
    password TEXT,
    role TEXT,
    name TEXT,
    isSenior INTEGER
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS doctores_norm (
    id TEXT PRIMARY KEY,
    nombre TEXT,
    apellido TEXT,
    email TEXT,
    telefono TEXT
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS pacientes_norm (
    id TEXT PRIMARY KEY,
    nombre TEXT,
    apellido TEXT,
    dni TEXT,
    edad INTEGER,
    habitacion TEXT,
    cama TEXT,
    doctorControl TEXT
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS pacientes_espera_norm (
    id TEXT PRIMARY KEY,
    nombre TEXT,
    apellido TEXT,
    dni TEXT,
    edad INTEGER,
    habitacion TEXT,
    cama TEXT,
    createdBy TEXT
  )`).run();

  console.log('Normalized tables created.');
}

if (require.main === module) run();
module.exports = run;

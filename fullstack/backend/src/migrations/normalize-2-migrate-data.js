const db = require('../db');

function migrate() {
  console.log('Migrating data from json column to normalized tables...');

  const users = db.prepare('SELECT id, json FROM users').all();
  const insertUser = db.prepare('INSERT OR REPLACE INTO users_norm (id, username, password, role, name, isSenior) VALUES (?, ?, ?, ?, ?, ?)');
  users.forEach(row => {
    const obj = JSON.parse(row.json);
    insertUser.run(
      row.id,
      obj.username || null,
      obj.password || null,
      obj.role || null,
      obj.name || null,
      obj.isSenior ? 1 : 0
    );
  });

  const doctores = db.prepare('SELECT id, json FROM doctores').all();
  const insertDoc = db.prepare('INSERT OR REPLACE INTO doctores_norm (id, nombre, apellido, email, telefono) VALUES (?, ?, ?, ?, ?)');
  doctores.forEach(row => {
    const obj = JSON.parse(row.json);
    insertDoc.run(
      row.id,
      obj.nombre || null,
      obj.apellido || null,
      obj.email || null,
      obj.telefono || null
    );
  });

  const pacientes = db.prepare('SELECT id, json FROM pacientes').all();
  const insertPac = db.prepare('INSERT OR REPLACE INTO pacientes_norm (id, nombre, apellido, dni, edad, habitacion, cama, doctorControl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  pacientes.forEach(row => {
    const obj = JSON.parse(row.json);
    insertPac.run(
      row.id,
      obj.nombre || null,
      obj.apellido || null,
      obj.dni || null,
      obj.edad || null,
      obj.habitacion || null,
      obj.cama || null,
      obj.doctorControl || null
    );
  });

  const espera = db.prepare('SELECT id, json FROM pacientes_espera').all();
  const insertEspera = db.prepare('INSERT OR REPLACE INTO pacientes_espera_norm (id, nombre, apellido, dni, edad, habitacion, cama, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  espera.forEach(row => {
    const obj = JSON.parse(row.json);
    insertEspera.run(
      row.id,
      obj.nombre || null,
      obj.apellido || null,
      obj.dni || null,
      obj.edad || null,
      obj.habitacion || null,
      obj.cama || null,
      obj.createdBy || null
    );
  });

  console.log('Migration complete.');
}

if (require.main === module) migrate();
module.exports = migrate;

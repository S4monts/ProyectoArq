const path = require('path');
const { readJSON, writeJSON } = require('../utils/fileStore');

const DATA_FILE = path.join(__dirname, '../../data/citas.json');

async function listar(req, res) {
  const citas = await readJSON(DATA_FILE);
  res.json({ ok: true, data: citas });
}

async function crear(req, res) {
  const { paciente, fecha, motivo } = req.body || {};
  if (!paciente || !fecha) return res.status(400).json({ ok: false, msg: 'Faltan datos' });
  const citas = await readJSON(DATA_FILE);
  const nextId = citas.length ? Math.max(...citas.map(c => c.id)) + 1 : 1;
  const nueva = { id: nextId, paciente, fecha, motivo };
  citas.push(nueva);
  await writeJSON(DATA_FILE, citas);
  res.status(201).json({ ok: true, data: nueva });
}

module.exports = { listar, crear };
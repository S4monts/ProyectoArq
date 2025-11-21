const esperaRepo = require('../repositories/pacientesEsperaRepo');
const pacientesRepo = require('../repositories/pacientesRepo');
const usersRepo = require('../repositories/usersRepo');
const { respondOK, respondError } = require('../utils/validators');
const activities = require('../utils/activities');

async function listEspera(req, res) {
  const all = await esperaRepo.getAll();
  const users = await usersRepo.getAll();
  const enriched = all.map(item => {
    const creator = users.find(u => String(u.id) === String(item.createdBy));
    return { ...item, createdByName: creator ? (creator.name || creator.username) : null };
  });
  return respondOK(res, enriched);
}

async function createEspera(req, res) {
  const { nombre, apellido, dni, edad, habitacion, cama, createdByDoctorId } = req.body || {};
  if (!nombre && !apellido && !cama) return respondError(res, 'datos insuficientes para lista de espera');
  // prefer createdByDoctorId from body (sent by doctor UI), fallback to authenticated user id
  const creator = createdByDoctorId || (req.user && req.user.id) || null;
  const created = await esperaRepo.create({ nombre, apellido, dni, edad, habitacion, cama, createdBy: creator });
  try {
    const user = creator ? await usersRepo.getById(creator) : null;
    const payload = { ...created, createdByName: user ? (user.name || user.username) : null };
    await activities.log('create_paciente_espera', req.user && req.user.id, req.user && req.user.name, 'paciente_espera', created.id);
    return respondOK(res, payload);
  } catch (e) {
    await activities.log('create_paciente_espera', req.user && req.user.id, req.user && req.user.name, 'paciente_espera', created.id);
    return respondOK(res, created);
  }
}

async function removeEspera(req, res) {
  const id = req.params.id;
  await esperaRepo.remove(id);
  await activities.log('delete_paciente_espera', req.user && req.user.id, req.user && req.user.name, 'paciente_espera', id);
  return respondOK(res, { id });
}

async function acceptEspera(req, res) {
  const id = req.params.id;
  const item = await esperaRepo.getById(id);
  if (!item) return respondError(res, 'Entrada de espera no encontrada', 404);
  // Prevent accepting if patient already exists (match by DNI if available, otherwise by nombre+apellido)
  if (item.dni) {
    const existing = await pacientesRepo.getAll();
    const found = existing.find(p => p.dni && String(p.dni) === String(item.dni));
    if (found) return respondError(res, 'Paciente con ese DNI ya existe', 400);
  } else {
    const existing = await pacientesRepo.getAll();
    const found = existing.find(p => String((p.nombre||'').toLowerCase()) === String((item.nombre||'').toLowerCase()) && String((p.apellido||'').toLowerCase()) === String((item.apellido||'').toLowerCase()));
    if (found) return respondError(res, 'Paciente ya existe', 400);
  }
  // create paciente in main table, include doctorControl from request creator
  const paciente = await pacientesRepo.create({ nombre: item.nombre, apellido: item.apellido, dni: item.dni, edad: item.edad, habitacion: item.habitacion, cama: item.cama, doctorControl: item.createdBy });
  await esperaRepo.remove(id);
  await activities.log('accept_paciente_espera', req.user && req.user.id, req.user && req.user.name, 'paciente', paciente.id);
  return respondOK(res, paciente);
}

module.exports = { listEspera, createEspera, removeEspera, acceptEspera };

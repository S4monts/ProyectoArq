const doctoresRepo = require('../repositories/doctoresRepo');
const encuentrosRepo = require('../repositories/encuentrosRepo');
const { respondOK, respondError } = require('../utils/validators');
const activities = require('../utils/activities');

async function listDoctores(req, res) {
  const all = await doctoresRepo.getAll();
  // calculate cantidadPacientesAsignados by counting encuentros
  const encuentros = await encuentrosRepo.getAll();
  const mapped = all.map((d) => {
    const count = encuentros.filter((e) => String(e.doctorId) === String(d.id)).length;
    return { ...d, cantidadPacientesAsignados: count };
  });
  return respondOK(res, mapped);
}

async function createDoctor(req, res) {
  const { nombre, apellido, email, telefono } = req.body || {};
  if (!nombre || !apellido) return respondError(res, 'nombre y apellido obligatorios');
  const created = await doctoresRepo.create({ nombre, apellido, email, telefono });
  await activities.log('create_doctor', req.user.id, req.user.name, 'doctor', created.id);
  return respondOK(res, created);
}

module.exports = { listDoctores, createDoctor };

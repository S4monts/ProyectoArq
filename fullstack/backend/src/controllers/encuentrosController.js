const encuentrosRepo = require('../repositories/encuentrosRepo');
const { isISODate, isHHMM, respondOK, respondError } = require('../utils/validators');
const activities = require('../utils/activities');

async function createEncuentro(req, res) {
  const { pacienteId, doctorId, fecha, hora, habitacion, cama, motivo } = req.body || {};
  if (!pacienteId || !doctorId || !fecha || !hora) return respondError(res, 'pacienteId, doctorId, fecha y hora son obligatorios');
  if (!isISODate(fecha)) return respondError(res, 'Fecha debe ser YYYY-MM-DD');
  if (!isHHMM(hora)) return respondError(res, 'Hora debe ser HH:MM');

  // simple conflict check
  const conflict = await encuentrosRepo.findConflicts(doctorId, fecha, hora);
  if (conflict) return respondError(res, 'Doctor ocupado', 409);

  const created = await encuentrosRepo.create({ pacienteId, doctorId, fecha, hora, habitacion, cama, motivo });
  await activities.log('create_encuentro', req.user.id, req.user.name, 'encuentro', created.id, { created });
  return respondOK(res, created);
}

async function listEncuentros(req, res) {
  const filters = {};
  if (req.query.doctorId) filters.doctorId = req.query.doctorId;
  const list = await encuentrosRepo.getAll(filters);
  return respondOK(res, list);
}

module.exports = { createEncuentro, listEncuentros };

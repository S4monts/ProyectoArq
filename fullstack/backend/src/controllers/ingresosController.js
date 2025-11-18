const ingresosRepo = require('../repositories/ingresosRepo');
const { respondOK, respondError } = require('../utils/validators');
const activities = require('../utils/activities');

async function createIngreso(req, res) {
  const body = req.body || {};
  const { nombre, apellido, edad, diagnosticoBreve, indicacion, indicacionDetalle, habitacion, cama, createdByDoctorId } = body;
  if ((!nombre || nombre === '') && (!diagnosticoBreve || diagnosticoBreve === '')) return respondError(res, 'Nombre o diagnosticoBreve requerido');
  if (typeof indicacion === 'undefined') return respondError(res, 'indicacion es obligatorio');
  if (indicacion && (!indicacionDetalle || indicacionDetalle === '')) return respondError(res, 'indicacionDetalle requerido cuando indicacion es true');
  // if urgency flag provided, enforce cama
  if (body.urgencia === true && (!cama || cama === '')) return respondError(res, 'cama es obligatorio para solicitud de urgencia');

  const created = await ingresosRepo.create({ nombre, apellido, edad, diagnosticoBreve, indicacion, indicacionDetalle, habitacion, cama, createdByDoctorId });
  await activities.log('create_ingreso', req.user.id, req.user.name, 'ingreso', created.id, { created });
  return respondOK(res, created);
}

async function listIngresos(req, res) {
  const status = req.query.status;
  const list = await ingresosRepo.getByStatus(status);
  return respondOK(res, list);
}

module.exports = { createIngreso, listIngresos };

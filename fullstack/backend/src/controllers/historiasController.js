const historiasRepo = require('../repositories/historiasRepo');
const { respondOK, respondError } = require('../utils/validators');
const activities = require('../utils/activities');

async function listHistorias(req, res) {
  const pacienteId = req.query.pacienteId;
  if (!pacienteId) return respondError(res, 'pacienteId query required');
  const list = await historiasRepo.getAllByPaciente(pacienteId);
  return respondOK(res, list);
}

async function addEvolucion(req, res) {
  const pacienteId = req.params.pacienteId;
  const { encuentroId, nota, procedimientoMedicamento, detalleProcedimiento, authorId } = req.body || {};
  if (!encuentroId || !nota) return respondError(res, 'encuentroId y nota son obligatorios');
  const created = await historiasRepo.addEvolucion(pacienteId, { encuentroId, nota, procedimientoMedicamento, detalleProcedimiento, authorId });
  await activities.log('add_evolucion', req.user.id, req.user.name, 'historia', pacienteId, { created });
  return respondOK(res, created);
}

module.exports = { listHistorias, addEvolucion };

const pacientesRepo = require('../repositories/pacientesRepo');
const encuentrosRepo = require('../repositories/encuentrosRepo');
const historiasRepo = require('../repositories/historiasRepo');
const { respondOK, respondError } = require('../utils/validators');
const { readJSON, writeJSON } = require('../utils/fileStore');
const activities = require('../utils/activities');

async function listPacientes(req, res) {
  const all = await pacientesRepo.getAll();
  return respondOK(res, all);
}

async function createPaciente(req, res) {
  const { nombre, apellido, dni, edad, habitacion, cama } = req.body || {};
  if (!nombre || !apellido) return respondError(res, 'nombre y apellido son obligatorios');
  const created = await pacientesRepo.create({ nombre, apellido, dni, edad, habitacion, cama });
  await activities.log('create_paciente', req.user.id, req.user.name, 'paciente', created.id);
  return respondOK(res, created);
}

async function deletePaciente(req, res) {
  const id = req.params.id;
  const paciente = await pacientesRepo.getById(id);
  if (!paciente) return respondError(res, 'Paciente no encontrado', 404);

  // delete encuentros
  const removedEncuentros = await encuentrosRepo.removeByPacienteId(id);

  // delete historias
  const historias = await readJSON('historias.json');
  const filtered = historias.filter((h) => String(h.pacienteId) !== String(id));
  await writeJSON('historias.json', filtered);

  // mark ingresos related (best-effort: mark those with cama equal)
  const ingresos = await readJSON('ingresos.json');
  let changed = false;
  const updatedIngresos = ingresos.map((ig) => {
    if (ig.cama && paciente.cama && ig.cama === paciente.cama) {
      changed = true;
      return { ...ig, status: 'cancelled' };
    }
    return ig;
  });
  if (changed) await writeJSON('ingresos.json', updatedIngresos);

  await pacientesRepo.remove(id);
  await activities.log('delete_paciente', req.user.id, req.user.name, 'paciente', id, { removedEncuentros, changedIngresos: changed });
  return respondOK(res, { id });
}

module.exports = { listPacientes, createPaciente, deletePaciente };

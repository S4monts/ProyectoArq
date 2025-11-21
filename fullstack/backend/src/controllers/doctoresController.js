const doctoresRepo = require('../repositories/doctoresRepo');
const encuentrosRepo = require('../repositories/encuentrosRepo');
const usersRepo = require('../repositories/usersRepo');
const { readJSON, writeJSON } = require('../utils/fileStore');
const { respondOK, respondError } = require('../utils/validators');
const activities = require('../utils/activities');

async function listDoctores(req, res) {
  const all = await doctoresRepo.getAll();
  // calculate cantidadPacientesAsignados by counting encuentros
  const encuentros = await encuentrosRepo.getAll();
  // enrich doctors with username/password from users.json if present
  const users = await readJSON('users.json');
  const mapped = all.map((d) => {
    const count = encuentros.filter((e) => String(e.doctorId) === String(d.id)).length;
    const user = users.find(u => String(u.id) === String(d.id) && u.role === 'doctor');
    return { ...d, cantidadPacientesAsignados: count, username: user ? user.username : undefined, password: user ? user.password : undefined };
  });
  return respondOK(res, mapped);
}

async function createDoctor(req, res) {
  // Allow creation of doctor and corresponding user record
  const { nombre, apellido, email, telefono, username, password } = req.body || {};
  if (!nombre || !apellido) return respondError(res, 'nombre y apellido obligatorios');
  // create doctor entry (id will be like 'D-#')
  const created = await doctoresRepo.create({ nombre, apellido, email, telefono });

  // create corresponding user in users.json with role 'doctor' and same id
  try {
    const userPayload = { id: created.id, username: username || String(created.id), password: password || 'changeme', role: 'doctor', name: `${nombre} ${apellido}` };
    const createdUser = await usersRepo.create(userPayload);
    console.log('doctoresController.createDoctor: created user', createdUser.id);
  } catch (err) {
    console.error('doctoresController.createDoctor: failed to create user', err.message);
    // If user creation fails, roll back doctor creation to keep consistency
    await doctoresRepo.remove(created.id);
    return respondError(res, 'failed to create user for doctor', 500);
  }

  await activities.log('create_doctor', req.user && req.user.id, req.user && req.user.name, 'doctor', created.id);
  return respondOK(res, created);
}

async function deleteDoctor(req, res) {
  // Only admins (and senior) should be allowed via frontend; authMiddleware already applied
  const id = req.params.id;
  // prevent accidental deletion of doctors by themselves is not necessary here
  // remove doctor entry and corresponding user
  await doctoresRepo.remove(id);
  try {
    const users = await readJSON('users.json');
    const filtered = users.filter(u => String(u.id) !== String(id));
    await writeJSON('users.json', filtered);
    console.log('doctoresController.deleteDoctor: removed user id', id, 'from users.json');
  } catch (err) {
    console.error('doctoresController.deleteDoctor: failed to remove user', err.message);
  }
  await activities.log('delete_doctor', req.user && req.user.id, req.user && req.user.name, 'doctor', id);
  return respondOK(res, { id });
}

module.exports = { listDoctores, createDoctor, deleteDoctor };

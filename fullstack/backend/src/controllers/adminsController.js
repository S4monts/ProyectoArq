const adminsRepo = require('../repositories/adminsRepo');
const usersRepo = require('../repositories/usersRepo');
const { readJSON, writeJSON } = require('../utils/fileStore');
const { respondOK, respondError } = require('../utils/validators');
const activities = require('../utils/activities');

async function checkSenior(req) {
  // helper: ensure the current user is an admin and isSenior
  const admins = await adminsRepo.getAll();
  return admins.find((a) => String(a.id) === String(req.user.id) && a.isSenior === true);
}

async function listAdmins(req, res) {
  const senior = await checkSenior(req);
  if (!senior) return respondError(res, 'Requires isAdminSenior', 403);
  const all = await adminsRepo.getAll();
  return respondOK(res, all);
}

async function createAdmin(req, res) {
  const senior = await checkSenior(req);
  if (!senior) return respondError(res, 'Requires isAdminSenior', 403);
  const { username, password, name, isSenior } = req.body || {};
  console.log('adminsController.createAdmin called by', req.user && req.user.id, 'body:', { username, name, isSenior });
  if (!username || !password || !name) return respondError(res, 'username, password, name required');
  // Crear admin en admins.json
  const created = await adminsRepo.create({ username, password, name, isSenior: !!isSenior });
  // MIGRATION-TODO: Al migrar a DB, asegúrate de crear el usuario y el admin en la misma transacción.
  // Crear usuario en users.json usando usersRepo.create para consistencia
  const userPayload = { username, password, role: 'admin', name };
  // ensure id matches admin id if usersRepo supports numeric ids; override id after create if necessary
  const createdUser = await usersRepo.create(userPayload);
  console.log('usersRepo.create returned', createdUser);
  // If the created user id doesn't match admin id, attempt to align IDs by updating users.json directly
  if (String(createdUser.id) !== String(created.id)) {
    const users = await readJSON('users.json');
    // find createdUser and replace id with admin id
    const idx = users.findIndex(u => u.username === username && u.role === 'admin');
    if (idx !== -1) {
      users[idx].id = created.id;
      await writeJSON('users.json', users);
      console.log('aligned users.json id for', username, 'to', created.id);
    }
  }
  await activities.log('create_admin', req.user.id, req.user.name, 'admin', created.id);
  return respondOK(res, created);
}

async function updateAdmin(req, res) {
  const senior = await checkSenior(req);
  if (!senior) return respondError(res, 'Requires isAdminSenior', 403);
  const id = req.params.id;
  const patch = req.body || {};
  const updated = await adminsRepo.update(id, patch);
  if (!updated) return respondError(res, 'Admin not found', 404);
  await activities.log('update_admin', req.user.id, req.user.name, 'admin', id, { patch });
  return respondOK(res, updated);
}

async function deleteAdmin(req, res) {
  const senior = await checkSenior(req);
  if (!senior) return respondError(res, 'Requires isAdminSenior', 403);
  const id = req.params.id;
  // Prevent admins from deleting their own account
  if (String(id) === String(req.user && req.user.id)) {
    return respondError(res, 'Cannot delete own account', 400);
  }
  await adminsRepo.remove(id);
  // Also remove corresponding user record in users.json (if exists)
  try {
    const users = await readJSON('users.json');
    const filtered = users.filter(u => String(u.id) !== String(id));
    await writeJSON('users.json', filtered);
    console.log('adminsController.deleteAdmin: removed user id', id, 'from users.json');
  } catch (err) {
    console.error('adminsController.deleteAdmin: failed to remove user from users.json', err.message);
  }
  await activities.log('delete_admin', req.user.id, req.user.name, 'admin', id);
  return respondOK(res, { id });
}

module.exports = { listAdmins, createAdmin, updateAdmin, deleteAdmin };

const adminsRepo = require('../repositories/adminsRepo');
const { readJSON } = require('../utils/fileStore');
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
  if (!username || !password || !name) return respondError(res, 'username, password, name required');
  const created = await adminsRepo.create({ username, password, name, isSenior: !!isSenior });
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
  await adminsRepo.remove(id);
  await activities.log('delete_admin', req.user.id, req.user.name, 'admin', id);
  return respondOK(res, { id });
}

module.exports = { listAdmins, createAdmin, updateAdmin, deleteAdmin };

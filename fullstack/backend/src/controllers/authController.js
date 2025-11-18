const usersRepo = require('../repositories/usersRepo');

async function login(req, res) {
  const { username, password, role } = req.body || {};
  if (!username || !password || !role) return res.status(400).json({ ok: false, msg: 'username, password and role required' });
  const user = await usersRepo.findByCredentials(username, password, role);
  if (!user) return res.status(401).json({ ok: false, msg: 'Invalid credentials' });
  const token = `demo-${user.id}`; // demo token
  return res.json({ ok: true, data: { token, role: user.role, userId: user.id, name: user.name || user.username } });
}

module.exports = { login };

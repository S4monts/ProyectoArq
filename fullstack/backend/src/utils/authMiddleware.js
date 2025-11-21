const usersRepo = require('../repositories/usersRepo');

// Token format for demo: demo-<userId>
async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ ok: false, msg: 'No token' });
  const token = auth.slice(7);
  if (!token.startsWith('demo-')) return res.status(401).json({ ok: false, msg: 'Invalid token' });
  const userId = token.slice(5);
  const user = await usersRepo.getById(userId);
  if (!user) return res.status(401).json({ ok: false, msg: 'User not found' });
  req.user = { id: user.id, role: user.role, name: user.name || user.username };
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, msg: 'No auth' });
    if (req.user.role !== role) return res.status(403).json({ ok: false, msg: 'Forbidden' });
    next();
  };
}

module.exports = { authMiddleware, requireRole };

const { readJSON } = require('./fileStore');
const { verifyToken } = require('./tokens');

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ ok: false, msg: 'No token' });
  const token = auth.slice(7);
  const tokenData = verifyToken(token);
  if (!tokenData) return res.status(401).json({ ok: false, msg: 'Invalid token' });
  const userId = tokenData.sub;
  const users = await readJSON('users.json');
  const user = users.find((u) => String(u.id) === String(userId));
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

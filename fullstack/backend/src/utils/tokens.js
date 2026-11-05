const crypto = require('crypto');

const TOKEN_TTL_SECONDS = 60 * 60;
const secret = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');

function createToken(userId) {
  const payload = Buffer.from(JSON.stringify({
    sub: String(userId),
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token) {
  const [payload, signature] = String(token).split('.');
  if (!payload || !signature) return null;

  const expected = crypto.createHmac('sha256', secret).update(payload).digest();
  const received = Buffer.from(signature, 'base64url');
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.sub || typeof data.exp !== 'number' || data.exp <= Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

module.exports = { createToken, verifyToken };

import { createHmac } from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'scia-fallback-secret-changeme';
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || '15');

export function signPayload(payload) {
  const data = JSON.stringify(payload);
  const sig = createHmac('sha256', SECRET).update(data).digest('hex');
  return Buffer.from(data).toString('base64url') + '.' + sig;
}

export function verifyPayload(cookieValue) {
  try {
    const dot = cookieValue.lastIndexOf('.');
    if (dot === -1) return null;
    const dataB64 = cookieValue.slice(0, dot);
    const sig     = cookieValue.slice(dot + 1);
    const data    = Buffer.from(dataB64, 'base64url').toString('utf8');
    const expected = createHmac('sha256', SECRET).update(data).digest('hex');
    if (sig !== expected) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function todayUTC() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export { DAILY_LIMIT };

// ─── POST /api/auth ───────────────────────────────────────────────────────────
export default function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};
  if (!email || !email.includes('@'))
    return res.status(400).json({ error: 'Email inválido' });

  const payload = {
    email: email.toLowerCase().trim(),
    date:  todayUTC(),
    count: 0,
  };

  const cookieVal = signPayload(payload);
  const maxAge    = 60 * 60 * 24 * 60; // 60 días

  res.setHeader('Set-Cookie',
    `_scia=${cookieVal}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
  );
  return res.status(200).json({ ok: true });
}

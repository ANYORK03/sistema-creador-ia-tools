import { verifyPayload } from './auth.js';

function getCookieFromReq(req, name) {
  const header = req.headers.cookie || '';
  const match  = header.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
  return match ? match.slice(name.length + 1) : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  // Leer email desde la cookie firmada
  const cookieVal = getCookieFromReq(req, '_scia');
  const session   = cookieVal ? verifyPayload(cookieVal) : null;
  const email     = session?.email;

  if (!email) return res.status(401).json({ error: 'Sin sesión' });

  const API_KEY        = process.env.MAILERLITE_API_KEY;
  const WAITLIST_GROUP = process.env.MAILERLITE_WAITLIST_GROUP_ID;

  if (!API_KEY || !WAITLIST_GROUP) {
    console.error('waitlist: faltan variables de entorno');
    return res.status(200).json({ ok: true }); // No bloquear la UX
  }

  try {
    // Buscar suscriptor existente y añadirlo al grupo de lista de espera
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        groups: [WAITLIST_GROUP],
        status: 'active',
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('MailerLite waitlist error:', err);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('waitlist error:', err);
    return res.status(200).json({ ok: true }); // Nunca bloquear la UX
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { nombre, email } = req.body || {};
  if (!email || !email.includes('@'))
    return res.status(400).json({ error: 'Email inválido' });

  const API_KEY  = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_GROUP_ID_WAITLIST;

  try {
    await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        fields: { name: nombre || '' },
        groups: GROUP_ID ? [GROUP_ID] : [],
        status: 'active',
      }),
    });
  } catch (err) {
    console.error('waitlist:', err);
  }

  // Never block UX on email errors
  return res.status(200).json({ ok: true });
}

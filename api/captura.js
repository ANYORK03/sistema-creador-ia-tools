export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { nombre, email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requerido" });

  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_GROUP_ID;

  try {
    const body = {
      email,
      fields: { name: nombre || "" },
      groups: GROUP_ID ? [GROUP_ID] : [],
      status: "active",
    };

    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("MailerLite error:", err);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ success: true }); // No bloquear al usuario
  }
}

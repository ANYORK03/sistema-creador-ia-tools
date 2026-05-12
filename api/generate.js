export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { nicho, tema, audiencia, tipo, tono, cta, visual, plataforma } = req.body;
  if (!nicho || !tema)
    return res.status(400).json({ error: "Faltan campos requeridos" });

  const aud = audiencia || "emprendedores y creadores de contenido latinos";
  const esPost = plataforma === "Post";

  let prompt;

  if (esPost) {
    prompt = `Eres un experto en contenido para Instagram de York Martínez — "Tu Primer Empleado IA".
Genera contenido para un Post de Instagram en español.

DATOS:
- Nicho: ${nicho}
- Audiencia: ${aud}
- Tema: ${tema}
- Tipo de hook: ${tipo}
- Tono: ${tono}
- CTA: ${cta}
- Estilo visual: ${visual}

Responde ÚNICAMENTE con este JSON válido, sin texto adicional:

{
  "caption": {
    "hook": "primera línea impactante que para el scroll, máxima 1 oración",
    "cuerpo": "3-4 párrafos cortos, lenguaje conversacional, emojis estratégicos, historia o valor real",
    "cta": "llamada a acción directa para ${cta}",
    "longitud": "150-200 palabras"
  },
  "hashtags": ["#hashtag1","#hashtag2","#hashtag3","#hashtag4","#hashtag5","#hashtag6","#hashtag7","#hashtag8","#hashtag9","#hashtag10"],
  "imagen": {
    "instruccion": "Copia este prompt y pégalo en ChatGPT, DALL-E o Canva IA:",
    "herramientas": ["ChatGPT / DALL-E","Canva IA","Adobe Firefly"],
    "prompt": "prompt completo en español para el post de Instagram. Estilo ${visual}. Nicho: ${nicho}. Formato cuadrado 1:1. Mínimo 60 palabras.",
    "notas": ["tip sobre colores para el feed","tip sobre texto en la imagen","tip sobre primera impresión visual"]
  }
}`;

  } else {
    // Reels
    prompt = `Eres un experto en contenido viral de York Martínez — "Tu Primer Empleado IA".
Genera contenido para un Reel de Instagram en español.

DATOS:
- Nicho: ${nicho}
- Audiencia: ${aud}
- Tema: ${tema}
- Tipo de hook: ${tipo}
- Tono: ${tono}
- CTA: ${cta}
- Estilo visual: ${visual}

Responde ÚNICAMENTE con este JSON válido, sin texto adicional:

{
  "hooks": [
    {"texto": "hook #1 impactante, máximo 2 oraciones", "duracion": "3-5 seg"},
    {"texto": "hook #2 diferente ángulo", "duracion": "4-6 seg"},
    {"texto": "hook #3 ángulo completamente distinto", "duracion": "3-5 seg"}
  ],
  "guion": {
    "hook": "primeros 5 segundos hablando a cámara",
    "desarrollo": "cuerpo 5-50 seg. 3 puntos concretos. Frases cortas. Pausas con '...'",
    "cta": "últimos 10 seg — acción clara para ${cta}",
    "duracion": "55-60 segundos",
    "palabras": "130-150 palabras"
  },
  "descripcion": "descripción completa para el Reel: 2-3 líneas de copy + hashtags relevantes + CTA para ${cta}. Máximo 150 palabras."
}`;
  }

  const apiKey = process.env.GROQ_API_KEY;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1800,
        temperature: 0.8,
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Groq error:", response.status, errBody);
      throw new Error(`Groq ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON no encontrado");

    const result = JSON.parse(match[0]);
    return res.status(200).json(result);
  } catch (err) {
    clearTimeout(timeout);
    console.error("ERROR:", err.message);
    return res.status(500).json({ error: "Error generando contenido. Intenta de nuevo." });
  }
}

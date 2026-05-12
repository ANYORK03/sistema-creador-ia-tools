export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { nicho, tema, audiencia, tipo, tono, cta, visual, plataforma } = req.body;
  if (!nicho || !tema)
    return res.status(400).json({ error: "Faltan campos requeridos" });

  const aud = audiencia || "emprendedores y creadores de contenido latinos";
  const esCarrusel = plataforma === "Carrusel de Instagram";
  const esPost = plataforma === "Post de Instagram";
  const esVideo = !esCarrusel && !esPost;

  let prompt;

  if (esVideo) {
    prompt = `Eres el sistema de contenido IA de York Martínez — "Tu Primer Empleado IA".
Genera contenido viral en español para ${plataforma}.

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
  "tipo": "video",
  "hooks": [
    {"texto": "hook #1 para video, máximo 2 oraciones impactantes", "tipo": "estilo del hook", "duracion": "3-5 seg"},
    {"texto": "hook #2 diferente ángulo", "tipo": "estilo del hook", "duracion": "4-6 seg"},
    {"texto": "hook #3 ángulo completamente distinto", "tipo": "estilo del hook", "duracion": "3-5 seg"}
  ],
  "tipshooks": [
    "tip para entregar este hook en ${plataforma}",
    "tip sobre energía y voz en los primeros 3 segundos",
    "tip sobre qué NO decir al inicio"
  ],
  "guion": {
    "hook": "primeros 5 segundos hablando a cámara",
    "desarrollo": "cuerpo 5-50 seg. 3 puntos concretos. Frases cortas. Pausas con '...'",
    "cta": "últimos 10 seg — acción clara para ${cta}",
    "duracion": "55-60 segundos",
    "palabras": "130-150 palabras",
    "ritmo": "Rápido y dinámico"
  },
  "imagen": {
    "instruccion": "Copia este prompt y pégalo en ChatGPT, DALL-E o Canva IA:",
    "herramientas": ["ChatGPT / DALL-E", "Midjourney", "Canva IA", "Adobe Firefly"],
    "prompt": "prompt completo en español para la miniatura o portada del video. Estilo ${visual}. Nicho: ${nicho}. Formato 9:16. Mínimo 60 palabras.",
    "notas": [
      "tip sobre colores que convierten en ${plataforma}",
      "tip sobre si incluir texto en pantalla",
      "tip sobre el formato recomendado"
    ]
  }
}`;
  } else if (esPost) {
    prompt = `Eres el sistema de contenido IA de York Martínez — "Tu Primer Empleado IA".
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
  "tipo": "post",
  "hooks": [
    {"texto": "primera línea del caption que para el scroll, máximo 1 oración", "tipo": "estilo", "duracion": "lectura 2 seg"},
    {"texto": "variante 2 del caption hook", "tipo": "estilo", "duracion": "lectura 2 seg"},
    {"texto": "variante 3 completamente diferente", "tipo": "estilo", "duracion": "lectura 2 seg"}
  ],
  "caption": {
    "hook": "primera línea impactante del caption",
    "cuerpo": "desarrollo del caption en 3-5 párrafos cortos. Lenguaje conversacional. Emojis estratégicos. Contar historia o dar valor real.",
    "cta": "llamada a acción para ${cta}. Directa y sin rodeos.",
    "longitud": "150-200 palabras"
  },
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6", "#hashtag7", "#hashtag8", "#hashtag9", "#hashtag10"],
  "imagen": {
    "instruccion": "Copia este prompt y pégalo en ChatGPT, DALL-E o Canva IA:",
    "herramientas": ["ChatGPT / DALL-E", "Canva IA", "Adobe Firefly"],
    "prompt": "prompt completo en español para el post de Instagram. Estilo ${visual}. Nicho: ${nicho}. Formato 1:1. Mínimo 60 palabras.",
    "notas": [
      "tip sobre colores y estética para el feed de Instagram",
      "tip sobre si incluir texto en la imagen",
      "tip sobre la primera impresión visual"
    ]
  }
}`;
  } else {
    // Carrusel
    prompt = `Eres el sistema de contenido IA de York Martínez — "Tu Primer Empleado IA".
Genera contenido para un Carrusel de Instagram en español.

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
  "tipo": "carrusel",
  "titulo": "título principal del carrusel — primera diapositiva, máximo 8 palabras, que genere curiosidad",
  "slides": [
    {"numero": 1, "titulo": "Portada — igual al título principal", "contenido": "subtítulo o gancho de 1 línea"},
    {"numero": 2, "titulo": "título slide 2, máximo 6 palabras", "contenido": "desarrollo en 2-3 líneas cortas"},
    {"numero": 3, "titulo": "título slide 3", "contenido": "desarrollo en 2-3 líneas cortas"},
    {"numero": 4, "titulo": "título slide 4", "contenido": "desarrollo en 2-3 líneas cortas"},
    {"numero": 5, "titulo": "título slide 5", "contenido": "desarrollo en 2-3 líneas cortas"},
    {"numero": 6, "titulo": "título slide 6", "contenido": "desarrollo en 2-3 líneas cortas"},
    {"numero": 7, "titulo": "CTA final", "contenido": "acción concreta para ${cta}. Directa."}
  ],
  "caption": "caption corto para acompañar el carrusel. 2-3 líneas. Con emoji y CTA para guardar o compartir.",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "imagen": {
    "instruccion": "Copia este prompt para diseñar la portada del carrusel en Canva o DALL-E:",
    "herramientas": ["Canva", "ChatGPT / DALL-E", "Adobe Firefly"],
    "prompt": "prompt completo en español para la portada del carrusel. Estilo ${visual}. Nicho: ${nicho}. Formato 1:1. Texto de portada visible. Mínimo 60 palabras.",
    "notas": [
      "tip sobre tipografía y contraste para carruseles de Instagram",
      "tip sobre consistencia visual entre slides",
      "tip para que el primer slide genere curiosidad y haga deslizar"
    ]
  }
}`;
  }

  const apiKey = process.env.GROQ_API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

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
        max_tokens: 2500,
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

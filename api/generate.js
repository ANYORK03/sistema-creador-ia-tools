export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { nicho, tema, audiencia, tipo, tono, cta, visual, plataforma } = req.body;
  if (!nicho || !tema)
    return res.status(400).json({ error: "Faltan campos requeridos" });

  const prompt = `Eres el sistema de contenido IA de York Martínez — "Tu Primer Empleado IA".
Tu trabajo es generar contenido viral en español para creadores y emprendedores latinos.

DATOS:
- Plataforma: ${plataforma}
- Nicho: ${nicho}
- Audiencia: ${audiencia || "emprendedores y creadores de contenido latinos"}
- Tema: ${tema}
- Tipo de hook: ${tipo}
- Tono de voz: ${tono}
- CTA deseado: ${cta}
- Estilo visual: ${visual}

Genera el sistema completo de contenido respondiendo ÚNICAMENTE con este JSON válido, sin texto adicional antes ni después:

{
  "hooks": [
    {
      "texto": "hook completo, máximo 3 oraciones cortas, sin emoji al inicio",
      "tipo": "nombre del estilo (ej: Controversia, Miedo a perder, Dato duro)",
      "duracion": "3-5 seg"
    },
    {
      "texto": "hook diferente al anterior, mismo tema distinto ángulo",
      "tipo": "nombre del estilo",
      "duracion": "4-6 seg"
    },
    {
      "texto": "tercer hook con ángulo completamente diferente",
      "tipo": "nombre del estilo",
      "duracion": "3-5 seg"
    }
  ],
  "tipshooks": [
    "tip específico para usar estos hooks en ${plataforma}",
    "tip sobre cómo entregar el hook con la voz y energía correcta",
    "tip sobre qué NO decir en los primeros 3 segundos"
  ],
  "guion": {
    "hook": "Los primeros 5 segundos — usa el mejor hook adaptado para hablar a cámara",
    "desarrollo": "El cuerpo del guión (5-50 segundos). Mínimo 3 puntos concretos. Lenguaje conversacional. Frases cortas. Pausas con '...'",
    "cta": "Los últimos 10 segundos — llamada a la acción clara para ${cta}. Directa y sin rodeos.",
    "duracion": "55-60 segundos",
    "palabras": "130-150 palabras",
    "ritmo": "Rápido y dinámico"
  },
  "imagen": {
    "instruccion": "Copia este prompt y pégalo en ChatGPT, DALL-E, Midjourney o Canva IA:",
    "herramientas": ["ChatGPT / DALL-E", "Midjourney", "Canva IA", "Adobe Firefly"],
    "prompt": "Prompt completo en inglés para generar la imagen del post. Incluye composición, colores basados en '${visual}', ambiente, iluminación, estilo, formato 1:1 para post o 9:16 para reels. Específico para el nicho '${nicho}'. Mínimo 80 palabras en inglés.",
    "notas": [
      "nota sobre los colores que más convierten en ${plataforma} para este nicho",
      "nota sobre si incluir texto en la imagen",
      "nota sobre el formato recomendado para este contenido"
    ]
  }
}`;

  const apiKey = process.env.GROQ_API_KEY;
  console.log("KEY presente:", !!apiKey, "| longitud:", apiKey ? apiKey.length : 0);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Groq HTTP error:", response.status, errBody);
      throw new Error(`Groq ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON no encontrado");

    const result = JSON.parse(match[0]);
    return res.status(200).json(result);
  } catch (err) {
    console.error("ERROR COMPLETO:", err.message, err.stack);
    return res.status(500).json({ error: "Error generando contenido. Intenta de nuevo." });
  }
}


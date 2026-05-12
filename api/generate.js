import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

Genera el sistema completo de contenido respondiendo ÚNICAMENTE con este JSON válido:

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
    "hook": "Los primeros 5 segundos del guión — usa el mejor hook generado arriba, adaptado para hablar",
    "desarrollo": "El cuerpo del guión (5-50 segundos). Mínimo 3 puntos concretos y accionables. Usar lenguaje conversacional como si hablaras directo a cámara. Sin tecnicismos. Frases cortas. Pausas naturales indicadas con '...'",
    "cta": "Los últimos 10 segundos — llamada a la acción clara para ${cta}. Directa, sin rodeos.",
    "duracion": "55-60 segundos",
    "palabras": "130-150 palabras",
    "ritmo": "Rápido y dinámico"
  },
  "imagen": {
    "instruccion": "Copia este prompt maestro y pégalo en ChatGPT, DALL-E, Midjourney o Canva IA para generar la imagen perfecta para este post:",
    "herramientas": ["ChatGPT / DALL-E", "Midjourney", "Canva IA", "Adobe Firefly"],
    "prompt": "Prompt completo en inglés para generar la imagen del post. Debe incluir: composición visual, colores (basado en '${visual}'), elementos de texto si aplica, ambiente, iluminación, estilo fotográfico o ilustrado, formato (1:1 para post, 9:16 para stories/reels). Específico para el nicho '${nicho}' y audiencia '${audiencia || 'emprendedores latinos'}'. Mínimo 80 palabras en inglés.",
    "notas": [
      "nota sobre los colores que más convierten en ${plataforma} para este nicho",
      "nota sobre si incluir o no texto en la imagen y por qué",
      "nota sobre el formato recomendado (proporción) para este tipo de contenido"
    ]
  }
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON no encontrado en respuesta");

    const data = JSON.parse(match[0]);
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error generando contenido" });
  }
}

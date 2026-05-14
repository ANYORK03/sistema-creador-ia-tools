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
    prompt = `Eres un copywriter experto en Instagram para emprendedores hispanos. Tu trabajo es escribir captions que generan engagement real — no genéricos, no corporativos, sino contenido que siente que lo escribió una persona real con experiencia.

DATOS DEL CONTENIDO:
- Nicho: ${nicho}
- Audiencia: ${aud}
- Tema: ${tema}
- Tipo de hook: ${tipo}
- Tono: ${tono}
- CTA: ${cta}
- Estilo visual: ${visual}

REGLAS OBLIGATORIAS:
- El hook es la primera línea — tiene que parar el scroll en 2 segundos. Usa tensión, dato específico, pregunta incómoda o afirmación polémica. NUNCA empieces con "¿Sabías que...?" ni "Hoy quiero hablarte de..."
- El cuerpo cuenta una historia corta O entrega 3 puntos de valor concretos con ejemplos reales del nicho. Nada de generalidades.
- Usa el lenguaje exacto que usa la audiencia — informal, directo, con emojis naturales (no decorativos).
- El CTA es una sola instrucción clara. Sin "si te gustó" ni "no olvides".
- Los hashtags: 5 de nicho específico + 3 de tema + 2 masivos.

Responde ÚNICAMENTE con este JSON válido, sin texto adicional, sin markdown:

{
  "caption": {
    "hook": "primera línea — máximo 12 palabras, específica para ${nicho}, tono ${tono}",
    "cuerpo": "4-5 párrafos cortos con saltos de línea. Historia real o 3 puntos de valor con ejemplos concretos del nicho ${nicho}. Emojis estratégicos. Lenguaje de la audiencia: ${aud}. Mínimo 120 palabras.",
    "cta": "instrucción directa para ${cta} — máximo 15 palabras",
    "longitud": "150-200 palabras"
  },
  "hashtags": ["#hashtag1","#hashtag2","#hashtag3","#hashtag4","#hashtag5","#hashtag6","#hashtag7","#hashtag8","#hashtag9","#hashtag10"],
  "imagen": {
    "instruccion": "Copia este prompt y pégalo en ChatGPT, DALL-E o Canva IA:",
    "herramientas": ["ChatGPT / DALL-E","Canva IA","Adobe Firefly"],
    "prompt": "Diseña una imagen para un post de Instagram sobre ${tema} en el nicho de ${nicho}. Estilo visual: ${visual}. La imagen debe comunicar visualmente el tema sin necesitar texto explicativo. Formato cuadrado 1:1. Alta resolución. Paleta de colores coherente con el nicho. Incluye elementos visuales específicos que conecten con ${aud}. La composición debe capturar atención en el feed en menos de 2 segundos.",
    "notas": [
      "tip específico sobre colores que funcionan en el nicho ${nicho}",
      "tip sobre si incluir o no texto superpuesto y cómo",
      "tip sobre el elemento visual principal que más convierte para esta audiencia"
    ]
  }
}`;

  } else {
    // Reels
    prompt = `Eres un guionista profesional de Reels virales para creadores hispanos. Escribes guiones REALES — el texto exacto que alguien va a decir frente a la cámara. No estructuras, no títulos, no indicaciones de escena. Solo las palabras que se hablan.

DATOS:
- Nicho: ${nicho}
- Audiencia: ${aud}
- Tema: ${tema}
- Tipo de hook: ${tipo}
- Tono: ${tono}
- CTA final: ${cta}

REGLAS DEL GUIÓN (obligatorias):
1. Escribe como se habla en voz alta, no como se escribe. Español natural, sin formalismos.
2. Frases cortas. Máximo 10 palabras por frase.
3. Pausas dramáticas marcadas con "..."
4. Palabras clave en MAYÚSCULAS para indicar énfasis de voz.
5. El hook (primeros 3-5 seg) debe causar "espera ¿qué?" — sin saludos, sin presentaciones.
6. El desarrollo da 3 puntos de valor CONCRETOS con ejemplos del nicho ${nicho}. Sin frases motivacionales vacías.
7. El CTA cierra con una instrucción directa para ${cta}.
8. El guión completo escrito en un solo bloque de texto corrido — listo para copiar en un teleprompter y leer de arriba a abajo.
9. Mínimo 150 palabras. Máximo 180 palabras. Tiempo de lectura: 60-70 segundos a ritmo natural.

REGLAS DE LOS HOOKS (3 opciones):
- Cada hook funciona SOLO como primera línea de video — sin contexto previo.
- Específicos para el nicho ${nicho} y el tema ${tema}. Nada genérico.
- Patrones: pregunta que duele / afirmación polémica / dato concreto con contradicción.

Responde ÚNICAMENTE con este JSON válido, sin texto adicional, sin markdown:

{
  "hooks": [
    {"texto": "hook #1 — pregunta o afirmación que genera curiosidad inmediata sobre ${tema} en el nicho ${nicho}", "duracion": "3-5 seg"},
    {"texto": "hook #2 — ángulo completamente diferente, más polémico o provocador", "duracion": "4-6 seg"},
    {"texto": "hook #3 — basado en un dolor concreto de ${aud}", "duracion": "3-5 seg"}
  ],
  "guion": {
    "hook": "Texto exacto de los primeros 5 segundos. Sin saludo. Sin presentación. Directo al choque o la curiosidad. 1-2 frases máximo.",
    "desarrollo": "Texto exacto del cuerpo (segundos 5-50). Escrito como se habla. Frases cortas separadas por puntos o '...'. 3 puntos de valor concretos con ejemplos reales del nicho ${nicho}. MAYÚSCULAS en las palabras que necesitan énfasis de voz. Mínimo 110 palabras. Este campo es el guión completo — no un resumen.",
    "cta": "Texto exacto del cierre (últimos 10-15 segundos). Instrucción directa para ${cta}. 2-3 frases. Con urgencia real.",
    "guion_completo": "El guión entero en un solo bloque de texto corrido: hook + desarrollo + cta. Sin títulos. Sin secciones. Solo el texto que se dice de principio a fin. Mínimo 150 palabras. Listo para teleprompter.",
    "duracion": "60-70 segundos",
    "palabras": "150-180 palabras"
  },
  "descripcion": "Descripción del Reel para Instagram. Primera línea: el hook más fuerte (copia el mejor de los 3). Segunda y tercera línea: amplifica el valor del video en 1-2 frases. Cuarta línea: CTA para ${cta}. Al final: 8 hashtags del nicho ${nicho}. Total: máximo 150 palabras."
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
        max_tokens: 2000,
        temperature: 0.85,
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

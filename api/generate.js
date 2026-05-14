export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { nicho, tema, audiencia, tipo, tono, cta, visual, plataforma } = req.body;
  if (!nicho || !tema)
    return res.status(400).json({ error: "Faltan campos requeridos" });

  const aud = audiencia || "emprendedores y creadores de contenido latinos";
  const esPost = plataforma === "Post";

  // ─── SISTEMA (separado del prompt) ───────────────────────────────────────
  const sistema = `Eres el mejor copywriter de Instagram y TikTok para creadores hispanos.
Escribes contenido que se siente REAL — como si lo escribiera alguien que vive ese nicho todos los días, no una IA.

REGLAS QUE NUNCA PUEDES VIOLAR:
1. NADA genérico. Cada línea debe referirse al nicho exacto con situaciones concretas.
2. NADA de openers muertos: "¿Sabías que...?", "Hoy quiero hablarte de...", "En el mundo de hoy...", "Es importante que..."
3. NADA de frases motivacionales vacías: "el éxito es un proceso", "confía en ti mismo", "tú puedes lograrlo"
4. NADA de porcentajes inventados que no se puedan creer ("el 99% de las personas...")
5. USA el lenguaje exacto del nicho — si es fitness: PR, bulk, macros, AMRAP. Si es marketing: CTR, funnel, retención, copy. Si es finanzas: flujo de caja, margen, ROI. Si es otro nicho: habla como alguien que lo vive.
6. El dolor en los hooks tiene que ser ESPECÍFICO. No "te cuesta crear contenido" — sino "llevas 3 semanas con el mismo borrador sin publicar"
7. Responde SOLO con JSON válido. Sin texto adicional. Sin markdown. Sin comentarios.`;

  let prompt;

  if (esPost) {
    // ─── POST ──────────────────────────────────────────────────────────────
    prompt = `Crea el contenido completo para un post de Instagram.

DATOS:
- Nicho: ${nicho}
- Audiencia: ${aud}
- Tema: ${tema}
- Tipo de hook: ${tipo}
- Tono: ${tono}
- CTA: ${cta}
- Estilo visual: ${visual}

CAPTION — reglas:
- Hook: primera línea que para el scroll en 2 segundos. Máximo 10 palabras. Tensión real, dato que duela o afirmación que genere "¿qué?". Específico para el nicho "${nicho}" — no sirve para cualquier post.
- Cuerpo: historia corta de 3-4 párrafos O 3 puntos concretos con ejemplos reales del nicho. Con emojis donde tienen sentido. Lenguaje del avatar, no de blog corporativo. Mínimo 100 palabras.
- CTA: una sola instrucción directa para "${cta}". Sin "si te gustó" ni "no olvides dar like". Máximo 12 palabras.

HASHTAGS: 5 nicho específico + 3 tema + 2 masivos.

IMAGEN — el prompt debe estar en español y ser visual concreto:
- Describe qué se ve en la imagen, no qué debe transmitir
- Estilo: ${visual}
- Formato cuadrado 1:1, alta resolución, paleta coherente con ${nicho}
- Incluye 3 notas tácticas específicas para este nicho (colores, texto superpuesto, elemento principal)

Devuelve este JSON exacto:
{
  "caption": {
    "hook": "",
    "cuerpo": "",
    "cta": ""
  },
  "hashtags": [],
  "imagen": {
    "instruccion": "Copia este prompt y pégalo en ChatGPT o Canva IA:",
    "herramientas": ["ChatGPT / DALL-E", "Canva IA", "Adobe Firefly"],
    "prompt": "",
    "notas": ["", "", ""]
  }
}`;

  } else {
    // ─── REELS ─────────────────────────────────────────────────────────────
    prompt = `Escribe el contenido completo para un Reel de Instagram/TikTok.

DATOS:
- Nicho: ${nicho}
- Audiencia: ${aud}
- Tema: ${tema}
- Tipo de hook: ${tipo}
- Tono: ${tono}
- CTA: ${cta}

HOOKS — 3 opciones con ángulos completamente distintos:
- Hook 1: pregunta que duele (algo que el avatar piensa pero no dice en voz alta)
- Hook 2: afirmación polémica o contraintuitiva (algo que va contra lo que todos dicen)
- Hook 3: situación concreta con contradicción (número real + giro inesperado)
- Regla absoluta: cada hook funciona solo, sin contexto previo. El espectador no sabe quién eres. Sin saludos.
- Deben ser específicos para "${nicho}" y "${tema}" — no pueden servir para otro nicho.

GUIÓN — reglas estrictas:
- Escríbelo como se habla en voz alta, no como se escribe
- Frases cortas. Máximo 10 palabras por frase.
- Pausas dramáticas con "..."
- Palabras de énfasis en MAYÚSCULAS
- Arranca directo con el hook elegido. Cero saludos, cero presentaciones.
- Desarrollo: 3 puntos CONCRETOS con ejemplos reales del nicho ${nicho}. Sin frases de relleno.
- CTA: instrucción directa para "${cta}". Urgencia real. 2-3 frases.
- guion_completo: TODO el guión seguido (hook + desarrollo + cta). Sin títulos ni secciones. Solo las palabras que se dicen. Mínimo 150 palabras, máximo 180. Listo para copiar en teleprompter.

DESCRIPCIÓN para Instagram:
- Línea 1: el hook más fuerte de los 3
- Líneas 2-3: amplifica el valor del video en máximo 2 frases
- Línea 4: CTA directo para "${cta}"
- Al final: 8 hashtags del nicho ${nicho}
- Total: máximo 150 palabras

Devuelve este JSON exacto:
{
  "hooks": [
    {"texto": "", "duracion": ""},
    {"texto": "", "duracion": ""},
    {"texto": "", "duracion": ""}
  ],
  "guion": {
    "hook": "",
    "desarrollo": "",
    "cta": "",
    "guion_completo": "",
    "duracion": "60-70 segundos",
    "palabras": ""
  },
  "descripcion": ""
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
        messages: [
          { role: "system", content: sistema },
          { role: "user",   content: prompt  }
        ],
        max_tokens: 2000,
        temperature: 0.9,
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

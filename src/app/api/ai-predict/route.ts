import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { baseName, weatherData } = body;

    // Puedes usar GROQ_API_KEY o la que inyectamos temporalmente (NEXT_PUBLIC_GROQ_API_KEY) o el fallback directo provisto hoy
    const customFallback = "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";
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || customFallback;

    if (!apiKey) {
      return NextResponse.json({ error: "No se encontró la clave API de Groq configurada en el servidor." }, { status: 500 });
    }

    // Prompt estandarizado y profesional para que la IA actúe como un Meteorólogo de la Aviación
    const systemPrompt = `Eres SERMETAVIA-AI, el asistente predictivo avanzado de la plataforma del Servicio Meteorológico de la Aviación Militar Venezolana.
    Tu tarea es analizar los datos actuales y emitir un pronóstico y recomendación operativa de máximo 3 o 4 oraciones.
    Actúa con tono militar, analítico, conciso y profesional.
    No des explicaciones largas. Solo el análisis y la recomendación (Ej. "Operaciones VFR suspendidas").`;

    const userPrompt = `Analiza la siguiente situación para la base: ${baseName}.
    Datos climáticos actuales medidos por sensores/Open-Meteo:
    - Visibilidad: ${weatherData.visKm} km
    - Cobertura de Nubes: ${weatherData.clouds}%
    - Velocidad del Viento: ${weatherData.wind} km/h
    - Temperatura: ${weatherData.temp}°C
    - Precipitaciones: ${weatherData.precip} mm
    
    ¿Cuál es la predicción probabilística de riesgo a corto plazo (12-24h) y tu recomendación operativa para aeronaves militares/civiles?`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Modelo extremadamente rápido y menos propenso a Rate Limits
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      // Log más descriptivo para vercel
      const errText = await response.text();
      console.error(`[GROQ API ERROR] Status: ${response.status}`, errText);
      return NextResponse.json({ error: `Groq rechazó la solicitud (Cod: ${response.status}). Intente de nuevo.` }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("[GROQ PARSE ERROR] Estructura inesperada:", data);
      return NextResponse.json({ error: "El modelo respondió pero con una estructura vacía o inválida." }, { status: 500 });
    }

    const resultText = data.choices[0].message.content;

    return NextResponse.json({ prediction: resultText });

  } catch (error: any) {
    console.error("[NEXTJS ENDPOINT ERROR] Fallo Crítico:", error.message || error);
    return NextResponse.json({ error: error.message || "Fallo crítico al generar el pronóstico predictivo." }, { status: 500 });
  }
}

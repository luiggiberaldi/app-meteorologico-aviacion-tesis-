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

    // Prompt estandarizado y profesional para que la IA actúe como un Meteorólogo de la Aviación exportando JSON
    const systemPrompt = `Eres SERMETAVIA-AI, el motor analítico del Servicio Meteorológico de la Aviación Militar Venezolana.
    Tu tarea es procesar datos crudos y devolver EXCLUSIVAMENTE un objeto JSON válido, sin Markdown, sin backticks y sin texto adicional.
    El JSON DEBE cumplir estrictamente con esta estructura exacta:
    {
      "ice": <numero de 0 a 100>, // Porcentaje de riesgo de engelamiento calculado en base a temperatura y humedad/nubes
      "turbulence": <numero de 0 a 100>, // Porcentaje de riesgo de turbulencia en base al viento y presión
      "visibility": <numero de 0 a 100>, // Porcentaje de impacto negativo en visibilidad (si visibilidad es 10km, impacto=0%. Si es 1km, impacto=100%)
      "recommendation": "<Texto de máximo 3 oraciones con consejo táctico y decisivo>"
    }
    No agregues introducciones ni des explicaciones, solo devuelve el JSON puro.`;

    const userPrompt = `Analiza la base: ${baseName}.
    Datos climáticos:
    - Visibilidad: ${weatherData.visKm} km
    - Cobertura Nubes: ${weatherData.clouds}%
    - Viento: ${weatherData.wind} km/h
    - Temperatura: ${weatherData.temp}°C
    - Precipitaciones: ${weatherData.precip} mm
    
    Genera la matriz de riesgo JSON solicitada para esta operación aeronáutica táctica.`;

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

    let resultText = data.choices[0].message.content;
    
    // Limpieza de Markdown si la IA se equivocó y mandó ```json ... ```
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        const jsonParsed = JSON.parse(resultText);
        return NextResponse.json({ prediction: jsonParsed });
    } catch (parseError) {
        console.error("Error parseando respuesta del LLM a JSON:", resultText);
        return NextResponse.json({ error: "La IA no respetó el formato JSON de salida requerido." }, { status: 500 });
    }

  } catch (error: any) {
    console.error("[NEXTJS ENDPOINT ERROR] Fallo Crítico:", error.message || error);
    return NextResponse.json({ error: error.message || "Fallo crítico al generar el pronóstico predictivo." }, { status: 500 });
  }
}

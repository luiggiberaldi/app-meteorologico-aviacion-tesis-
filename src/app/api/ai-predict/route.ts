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

    // Prompt calibrado con reglas de cálculo meteorológico aeronáutico reales
    const systemPrompt = `Eres SERMETAVIA-AI, el motor analítico del Servicio Meteorológico de la Aviación Militar Venezolana.
    Tu tarea es procesar datos meteorológicos y calcular riesgos operativos devolviendo EXCLUSIVAMENTE un objeto JSON válido.

    REGLAS DE CÁLCULO OBLIGATORIAS (úsalas estrictamente):

    1. ENGELAMIENTO (ice): Calcula así:
       - Si temp <= 0°C: riesgo base 80-95%
       - Si temp entre 1-5°C con nubes > 60%: riesgo 40-70%
       - Si temp entre 5-10°C con nubes > 80%: riesgo 20-40%
       - Si temp entre 10-20°C: riesgo 5-15%
       - Si temp > 20°C: riesgo 2-8% (nunca 0, siempre hay riesgo residual en altitud)
       - Si hay precipitaciones > 0mm, suma +10% al resultado

    2. TURBULENCIA (turbulence): Calcula así:
       - Si viento > 50 km/h: riesgo 75-95%
       - Si viento 30-50 km/h: riesgo 45-70%
       - Si viento 15-30 km/h: riesgo 20-40%
       - Si viento 5-15 km/h: riesgo 8-18%
       - Si viento < 5 km/h: riesgo 3-8%
       - Si precipitaciones > 2mm, suma +15%

    3. VISIBILIDAD (visibility = impacto negativo):
       - Fórmula: max(5, 100 - (visibilidadKm * 10))
       - Si nubes > 80%, suma +10%
       - Si precipitaciones > 0mm, suma +15%
       - Nunca devuelvas 0%, mínimo 5%

    IMPORTANTE: Los valores NUNCA deben ser todos 0%. Siempre existe riesgo residual. Valores mínimos: ice>=3, turbulence>=3, visibility>=5.

    FORMATO DE SALIDA (solo esto, nada más):
    {"ice": <int>, "turbulence": <int>, "visibility": <int>, "recommendation": "<máx 3 oraciones, tono militar táctico>"}
    
    Sin Markdown, sin backticks, sin texto adicional. Solo el JSON.`;

    const userPrompt = `DATOS DE SENSORES para base ${baseName}:
    VIS=${weatherData.visKm}km | NUBES=${weatherData.clouds}% | VIENTO=${weatherData.wind}km/h | TEMP=${weatherData.temp}°C | PRECIP=${weatherData.precip}mm
    
    Aplica las reglas de cálculo y genera la matriz de riesgo JSON.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Modelo actualizado y soportado
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 250,
        response_format: { type: "json_object" }
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

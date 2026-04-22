export const runtime = 'edge';

import { NextResponse } from 'next/server';

const CACHE_TTL_MINUTES = 30;

async function getCachedPrediction(baseName: string, supabaseUrl: string, supabaseKey: string) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/ai_predictions?base_name=eq.${encodeURIComponent(baseName)}&expires_at=gt.${new Date().toISOString()}&order=created_at.desc&limit=1`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    }
  );
  const data = await res.json();
  return data?.[0] ?? null;
}

async function savePrediction(baseName: string, prediction: any, weatherData: any, supabaseUrl: string, supabaseKey: string) {
  const expiresAt = new Date(Date.now() + CACHE_TTL_MINUTES * 60 * 1000).toISOString();
  await fetch(`${supabaseUrl}/rest/v1/ai_predictions`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      base_name: baseName,
      ice_risk: prediction.ice,
      turbulence_risk: prediction.turbulence,
      visibility_risk: prediction.visibility,
      recommendation: prediction.recommendation,
      weather_snapshot: weatherData,
      expires_at: expiresAt
    })
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { baseName, weatherData } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // 1. VERIFICAR CACHE EN SUPABASE — mismo reporte para todos los dispositivos
    const cached = await getCachedPrediction(baseName, supabaseUrl, supabaseKey);
    if (cached) {
      return NextResponse.json({
        prediction: {
          ice: cached.ice_risk,
          turbulence: cached.turbulence_risk,
          visibility: cached.visibility_risk,
          recommendation: cached.recommendation,
        },
        cached: true,
        cachedAt: cached.created_at
      });
    }

    // 2. CÁLCULOS MATEMÁTICOS DUROS
    const temp = weatherData.temp;
    const wind = weatherData.wind;
    const precip = weatherData.precip;
    const clouds = weatherData.clouds;
    const visKm = weatherData.visKm;

    let iceRisk = 5;
    if (temp <= 0) iceRisk = 90;
    else if (temp > 0 && temp <= 5 && clouds > 60) iceRisk = 60;
    else if (temp > 5 && temp <= 10 && clouds > 80) iceRisk = 30;
    else if (temp > 10 && temp <= 20) iceRisk = 10;
    if (precip > 0) iceRisk = Math.min(100, iceRisk + 10);

    let turbRisk = 5;
    if (wind > 50) turbRisk = 85;
    else if (wind > 30) turbRisk = 60;
    else if (wind > 15) turbRisk = 30;
    else if (wind > 5) turbRisk = 15;
    if (precip > 2) turbRisk = Math.min(100, turbRisk + 15);

    let visRisk = Math.max(5, 100 - (visKm * 10));
    if (clouds > 80) visRisk = Math.min(100, visRisk + 10);
    if (precip > 0) visRisk = Math.min(100, visRisk + 15);

    iceRisk = Math.round(Math.max(3, Math.min(100, iceRisk)));
    turbRisk = Math.round(Math.max(3, Math.min(100, turbRisk)));
    visRisk = Math.round(Math.max(5, Math.min(100, visRisk)));

    const isNacional = baseName.toLowerCase().includes('nacional');
    const locationContext = isNacional ? "todas las bases a Nivel Nacional" : `la base ${baseName}`;

    // 3. LLAMADA A GROQ (solo cuando no hay cache)
    const customFallback = "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";
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || customFallback;

    if (!apiKey) {
      return NextResponse.json({ error: "No se encontró la clave API de Groq configurada en el servidor." }, { status: 500 });
    }

    const systemPrompt = `Eres SERMETAVIA-AI, el analista táctico del Servicio Meteorológico de la Aviación Militar Venezolana.
    Debes emitir un dictamen o recomendación operativa de máximo 3 oraciones.

    REGLAS ESTRICTAS:
    1. DEBES mencionar explícitamente en el texto el lugar evaluado: "${locationContext}".
    2. Usa un tono militar, profesional, táctico y directo.
    3. Tienes los porcentajes de riesgo calculados. NO repitas los números de los porcentajes, solo analiza si la situación es favorable o peligrosa en base a ellos.
       - Nota: Visibilidad ALTA (ej 90%) significa ALTO RIESGO de no ver nada (peligro). Visibilidad BAJA (ej 5%) significa buen clima despejado.
    4. NO uses markdown, no saludes. Entrega solo el párrafo de texto crudo.`;

    const userPrompt = `Evalúa la factibilidad de operaciones aéreas para ${locationContext} con estos riesgos calculados por nuestros sistemas:
    - Riesgo de Engelamiento/Hielo: ${iceRisk}%
    - Riesgo de Turbulencia/Cizalladura: ${turbRisk}%
    - Riesgo por Baja Visibilidad: ${visRisk}% (Nota: mientras más alto este porcentaje, peor es la visibilidad).

    Genera el dictamen táctico final.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[GROQ API ERROR] Status: ${response.status}`, errText);
      return NextResponse.json({ error: `Groq rechazó la solicitud (Cod: ${response.status}).` }, { status: response.status });
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json({ error: "Estructura inválida devuelta por IA." }, { status: 500 });
    }

    const recommendationText = data.choices[0].message.content.trim().replace(/"/g, '');

    const prediction = {
      ice: iceRisk,
      turbulence: turbRisk,
      visibility: visRisk,
      recommendation: recommendationText
    };

    // 4. GUARDAR EN CACHE para todos los dispositivos
    savePrediction(baseName, prediction, weatherData, supabaseUrl, supabaseKey).catch(console.error);

    return NextResponse.json({ prediction, cached: false });

  } catch (error: any) {
    console.error("[NEXTJS ENDPOINT ERROR]", error.message || error);
    return NextResponse.json({ error: error.message || "Fallo crítico al predecir." }, { status: 500 });
  }
}

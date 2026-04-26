const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (url.pathname === '/api/ai-predict' && request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Handle the AI prediction API endpoint
    if (url.pathname === '/api/ai-predict' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { baseName, weatherData } = body;

        // Input validation
        if (!baseName || !weatherData) {
          return new Response(JSON.stringify({ error: 'Faltan campos requeridos: baseName, weatherData' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        }

        const apiKey = env.NEXT_PUBLIC_GROQ_API_KEY || env.GROQ_API_KEY;
        if (!apiKey) {
          // Fallback para entorno sin secrets configurados
          return new Response(JSON.stringify({ error: 'API key de IA no configurada en el servidor' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        }

        const temp = weatherData.temp ?? 25;
        const wind = weatherData.wind ?? 0;
        const precip = weatherData.precip ?? 0;
        const clouds = weatherData.clouds ?? 0;
        const visKm = weatherData.visKm ?? 10;

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
        const locationContext = isNacional ? 'todas las bases a Nivel Nacional' : `la base ${baseName}`;

        const systemPrompt = `Eres AEROMETRIX-AI, el analista táctico del Servicio Meteorológico de la Aviación Militar Venezolana. Debes emitir un dictamen o recomendación operativa de máximo 3 oraciones. REGLAS ESTRICTAS: 1. DEBES mencionar explícitamente en el texto el lugar evaluado: "${locationContext}". 2. Usa un tono militar, profesional, táctico y directo. 3. Tienes los porcentajes de riesgo calculados. NO repitas los números de los porcentajes, solo analiza si la situación es favorable o peligrosa en base a ellos. 4. NO uses markdown, no saludes. Entrega solo el párrafo de texto crudo.`;

        const userPrompt = `Evalúa la factibilidad de operaciones aéreas para ${locationContext} con estos riesgos calculados por nuestros sistemas: - Riesgo de Engelamiento/Hielo: ${iceRisk}% - Riesgo de Turbulencia/Cizalladura: ${turbRisk}% - Riesgo por Baja Visibilidad: ${visRisk}% (Nota: mientras más alto este porcentaje, peor es la visibilidad). Genera el dictamen táctico final.`;

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 150,
          }),
        });

        if (!groqResponse.ok) {
          return new Response(JSON.stringify({ error: `Error del servicio de IA: ${groqResponse.status}` }), {
            status: groqResponse.status,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        }

        const data = await groqResponse.json();
        const recommendationText = data.choices?.[0]?.message?.content?.trim() || 'No se pudo generar recomendación';

        return new Response(JSON.stringify({
          prediction: {
            ice: iceRisk,
            turbulence: turbRisk,
            visibility: visRisk,
            recommendation: recommendationText,
          },
        }), {
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Error interno del servidor' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
    }

    // Serve static assets for everything else
    return env.ASSETS.fetch(request);
  },
};

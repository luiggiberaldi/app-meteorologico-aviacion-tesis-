const apiKey = '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';
const systemPrompt = `Eres SERMETAVIA-AI, el motor analítico del Servicio Meteorológico de la Aviación Militar Venezolana.
Tu tarea es procesar datos crudos y devolver EXCLUSIVAMENTE un objeto JSON válido, sin Markdown, sin backticks y sin texto adicional.
El JSON DEBE cumplir estrictamente con esta estructura exacta:
{
  "ice": <numero de 0 a 100>,
  "turbulence": <numero de 0 a 100>,
  "visibility": <numero de 0 a 100>,
  "recommendation": "<Texto de máximo 3 oraciones con consejo táctico y decisivo>"
}
No agregues introducciones ni des explicaciones, solo devuelve el JSON puro.`;

const userPrompt = 'hola';

fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + apiKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama3-8b-8192',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3,
    max_tokens: 250,
  })
})
.then(res => res.text())
.then(text => console.log("GROQ_RES:", text))
.catch(err => console.error("ERR:", err));

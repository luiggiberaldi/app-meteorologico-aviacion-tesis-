
const apiKey = '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';
const systemPrompt = 'Eres un bot. Devuelve un JSON.';
const userPrompt = 'hola';
async function run() {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [ { role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt } ],
      response_format: { type: 'json_object' }
    })
  });
  console.log(await res.text());
}
run();


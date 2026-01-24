
const OLLAMA_URL = 'http://localhost:11434/api/chat';
const MODEL = 'llama3.1'; // or llama3 if that’s what you pulled

export async function callLLM(messages) {
  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: false
    })
  });

  const data = await res.json();

  // Safety check
  if (!data.message || !data.message.content) {
    console.error('Raw LLM response:', data);
    throw new Error('Invalid LLM response');
  }

  return data.message.content;
}

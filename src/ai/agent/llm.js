
const OLLAMA_URL = `${process.env.OLLAMA_BASE_URL}/api/chat`;
const MODEL = 'llama3:8b-instruct-q4_0'; // or llama3 if that’s what you pulled

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

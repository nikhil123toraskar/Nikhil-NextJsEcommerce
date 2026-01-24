import fs from 'fs';
import { cosineSimilarity } from './similarity.js';

const VECTOR_STORE = './embeddings/vectorStore.json';
const vectors = JSON.parse(fs.readFileSync(VECTOR_STORE, 'utf-8'));

async function embedQuery(query) {
  const res = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'nomic-embed-text',
      prompt: query
    })
  });

  const data = await res.json();
  return data.embedding;
}

export async function searchProducts(query, topK = 5) {
  const queryEmbedding = await embedQuery(query);

  return vectors
    .map(v => ({
      ...v,
      score: cosineSimilarity(queryEmbedding, v.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

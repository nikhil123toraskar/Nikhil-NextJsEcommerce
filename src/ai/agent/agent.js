import fs from "fs";
import path from "path";
import { fetchProductsByIds } from "@/ai/data/fetchProductsByIds";

const intentCache = new Map();
const queryEmbeddingCache = new Map();
let VECTOR_STORE = null;

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default class Agent {
  constructor(callLLM) {
    this.callLLM = callLLM;
  }

  async extractIntent(query) {
    if (intentCache.has(query)) {
      return intentCache.get(query);
    }

    const systemPrompt = `
        You extract structured shopping intent from user queries.

        Return ONLY valid JSON.
        Do not explain anything.

        Fields:
        - category (string | null)
        - minPrice (number | null)
        - maxPrice (number | null)

        Examples:
        "shoes under 3000"
        → {"category":"shoes","minPrice":null,"maxPrice":3000}

        "sneakers between 2000 and 5000"
        → {"category":"sneakers","minPrice":2000,"maxPrice":5000}

        "perfume"
        → {"category":"perfume","minPrice":null,"maxPrice":null}
        `;

    const response = await this.callLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ]);

    try {
      const intent = JSON.parse(response);
      intentCache.set(query, intent);
      return intent;
    } catch {
      return { category: null, minPrice: null, maxPrice: null };
    }
  }

  async embedQuery(query) {
    if (queryEmbeddingCache.has(query)) {
      return queryEmbeddingCache.get(query);
    }

    const res = await fetch("http://localhost:11434/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: query,
      }),
    });

    const data = await res.json();
    const embedding = data.embedding;
    queryEmbeddingCache.set(query, embedding);
    return embedding;
  }

  loadVectorStore() {
    const filePath = path.join(process.cwd(), "src", "ai", "vectorStore.json");
    if(!VECTOR_STORE) {
        const raw = fs.readFileSync(filePath, "utf-8");
        VECTOR_STORE = JSON.parse(raw);
    }

    return VECTOR_STORE;
  }

  async think(query) {
    const vectors = this.loadVectorStore();

    const intent = await this.extractIntent(query);

    console.log(intent, "extracted intent");

    const queryEmbedding = await this.embedQuery(query);

    // Score vectors
    const scored = vectors.map((item) => ({
      id: item.id,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, 10);

    // Fetch real products
    const productIds = top.map((r) => r.id);
    const productMap = await fetchProductsByIds(productIds);

    // Enrich response
    const results = top
      .map((r) => {
        const product = productMap[r.id];

        if (!product) return null;

        return {
          id: r.id,
          name: product.name,
          price: product.price?.price,
          image: product.media?.mainMedia?.image?.url,
          score: Number(r.score.toFixed(3)),
        };
      })
      .filter(Boolean);

    let filteredResults = results;

    if (intent.maxPrice != null) {
      filteredResults = filteredResults.filter(
        (p) => p.price != null && p.price <= intent.maxPrice,
      );
    }

    if (intent.minPrice != null) {
      filteredResults = filteredResults.filter(
        (p) => p.price != null && p.price >= intent.minPrice,
      );
    }

    return {
      query,
      intent,
      results: filteredResults,
    };
  }
}

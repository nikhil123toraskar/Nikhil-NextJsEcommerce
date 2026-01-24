import fs from "fs";
import path from "path";
import { fetchProductsByIds } from "@/ai/data/fetchProductsByIds";


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
    const content = await this.callLLM([
      {
        role: "system",
        content: `
You extract shopping intent from a search query.

Return ONLY valid JSON.
No markdown. No explanation.

Schema:
{
  "query": string,
  "minPrice": number | null,
  "maxPrice": number | null
}

Examples:
"shoes under 3000" -> { "query": "shoes", "minPrice": null, "maxPrice": 3000 }
"sneakers below 2000" -> { "query": "sneakers", "minPrice": null, "maxPrice": 2000 }
"formal shoes" -> { "query": "formal shoes", "minPrice": null, "maxPrice": null }
`
      },
      {
        role: "user",
        content: query
      }
    ]);

    return JSON.parse(content);
  }


  async embedQuery(query) {
    const res = await fetch("http://localhost:11434/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: query,
      }),
    });

    const data = await res.json();
    return data.embedding;
  }

  loadVectorStore() {
    const filePath = path.join(process.cwd(), "src", "ai", "vectorStore.json");

    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  }

  async think(query) {
    const vectors = this.loadVectorStore();

    //const intent = await this.extractIntent(query);

    //console.log(intent, "extracted intent");

    const queryEmbedding = await this.embedQuery(query);

    // Score vectors
    const scored = vectors.map((item) => ({
      id: item.id,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, 5);

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

      // let filteredResults = results;

      // if (intent.minPrice !== null) {
      //   filteredResults = filteredResults.filter(
      //     (p) => p.price >= intent.minPrice,
      //   );
      // }

      // if (intent.maxPrice !== null) {
      //   filteredResults = filteredResults.filter(
      //     (p) => p.price <= intent.maxPrice,
      //   );
      // }


    return {
      query,
      results: results,
    };

  }
}

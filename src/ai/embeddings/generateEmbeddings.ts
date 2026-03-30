import fs from "fs";
import path from "path";
import { wixClientServer } from "@/lib/wixClientServer";

const VECTOR_PATH = path.join(process.cwd(), "src/ai/vectorStore.json");
const OLLAMA_URL = "http://localhost:11434/api/embeddings";
const MODEL = "llama3.1";

async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: text,
    }),
  });

  const data = await res.json();
  return data.embedding;
}

async function main() {
  console.log("🔄 Generating embeddings for all products...");

  const wixClient = await wixClientServer();

  // Fetch a large number (safe for now)
  const productsRes = await wixClient.products
    .queryProducts()
    .limit(200)
    .find();

  const vectors = [];

  for (const product of productsRes.items) {
    const text = `
      Name: ${product.name}
      Description: ${product.description || ""}
      Price: ${product.priceData?.price || ""}
      Type: ${product.productType || ""}
      ${product.productOptions ? product.productOptions.map(option => {
        if (option.name === 'Size') {
          const sizes = option.choices?.map(choice => choice.value || choice.description).join(', ') || '';
          return `Available Sizes: ${sizes}`;
        }
        if (option.name === 'Color') {
          const colors = option.choices?.map(choice => choice.description || choice.value).join(', ') || '';
          return `Available Colors: ${colors}`;
        }
        return '';
      }).filter(Boolean).join('\n') : ''}
    `.trim();

    const embedding = await generateEmbedding(text);

    vectors.push({
      id: product._id,
      name: product.name,
      embedding,
    });

    console.log(`✅ Embedded: ${product.name}`);
  }

  fs.writeFileSync(VECTOR_PATH, JSON.stringify(vectors, null, 2));
  console.log("🎉 vectorStore.json updated successfully");
}

main().catch(console.error);

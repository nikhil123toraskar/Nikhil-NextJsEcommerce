import fs from 'fs';
import path from 'path';
import { cosineSimilarity } from './similarity.js';
import { wixClientServer } from '@/lib/wixClientServer';
import { products } from '@wix/stores';

const VECTOR_STORE = path.join(process.cwd(), 'src/ai/vectorStore.json');
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

// Parse price constraints from query
function parsePriceConstraints(query) {
  const lowerQuery = query.toLowerCase();

  // Match patterns like "under 5000", "below 5000", "less than 5000", "< 5000"
  const underPattern = /(?:under|below|less than|<)\s*(\d+(?:,\d+)*)/i;
  const overPattern = /(?:over|above|more than|greater than|>)\s*(\d+(?:,\d+)*)/i;
  const betweenPattern = /(?:between)\s*(\d+(?:,\d+)*)\s*(?:and|-)\s*(\d+(?:,\d+)*)/i;

  let maxPrice = null;
  let minPrice = null;

  // Check for "under/below/less than" patterns
  const underMatch = lowerQuery.match(underPattern);
  if (underMatch) {
    maxPrice = parseInt(underMatch[1].replace(/,/g, ''));
  }

  // Check for "over/above/more than" patterns
  const overMatch = lowerQuery.match(overPattern);
  if (overMatch) {
    minPrice = parseInt(overMatch[1].replace(/,/g, ''));
  }

  // Check for "between" patterns
  const betweenMatch = lowerQuery.match(betweenPattern);
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1].replace(/,/g, ''));
    maxPrice = parseInt(betweenMatch[2].replace(/,/g, ''));
  }

  return { minPrice, maxPrice };
}

// Clean query by removing price constraints for better semantic search
function cleanQueryForEmbedding(query) {
  return query
    .replace(/(?:under|below|less than|<|over|above|more than|greater than|>)\s*\d+(?:,\d+)*/gi, '')
    .replace(/(?:between)\s*\d+(?:,\d+)*\s*(?:and|-)\s*\d+(?:,\d+)*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function searchProducts(query, topK = 5) {
  // Parse price constraints
  const { minPrice, maxPrice } = parsePriceConstraints(query);

  // Clean query for embedding (remove price mentions)
  const cleanQuery = cleanQueryForEmbedding(query);

  // Get semantic search results
  const queryEmbedding = await embedQuery(cleanQuery || query);

  let semanticResults = vectors
    .map(v => ({
      ...v,
      score: cosineSimilarity(queryEmbedding, v.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK * 2); // Get more results initially for filtering

  // If no price constraints, return semantic results
  if (!minPrice && !maxPrice) {
    return semanticResults.slice(0, topK);
  }

  // Fetch full product data to get prices
  const wixClient = await wixClientServer();
  const productIds = semanticResults.map(r => r.id);

  try {
    const res = await wixClient.products
      .queryProducts()
      .hasSome('_id', productIds)
      .find();

    // Filter by price and maintain semantic ranking
    const filteredResults = semanticResults
      .map(semanticResult => {
        const product = res.items.find(p => p._id === semanticResult.id);
        if (!product) return null;

        const price = product.priceData?.price || 0;

        // Check price constraints
        if (minPrice && price < minPrice) return null;
        if (maxPrice && price > maxPrice) return null;

        return {
          ...semanticResult,
          price: price,
          name: product.name
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return filteredResults;

  } catch (error) {
    console.error('Error fetching product prices:', error);
    // Fallback to semantic results if price filtering fails
    return semanticResults.slice(0, topK);
  }
}

import fs from 'fs';
import path from 'path';
import { cosineSimilarity } from './similarity.js';
import { wixClientServer } from '@/lib/wixClientServer';
import { callLLM } from '@/ai/agent/llm';

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

function normalizeNumber(value) {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const digits = value.replace(/[^0-9]/g, '');
    return digits ? Number(digits) : null;
  }
  return null;
}

async function extractQueryConstraints(query) {
  const systemPrompt = `
You are a shopping intent parser. Return ONLY valid JSON.

Required fields:
- category (string|null)
- minPrice (number|null)
- maxPrice (number|null)
- dateRange (string|null)

If the query does not mention a value, return null for that field.
If there is a date constraint, return a short natural phrase like "last month", "past 2 weeks", or "added in the past 30 days".

Examples:
"shoes under 3000" -> {"category":"shoes","minPrice":null,"maxPrice":3000,"dateRange":null}
"sneakers between 2000 and 5000" -> {"category":"sneakers","minPrice":2000,"maxPrice":5000,"dateRange":null}
"shoes added in last month" -> {"category":"shoes","minPrice":null,"maxPrice":null,"dateRange":"last month"}
"perfume" -> {"category":"perfume","minPrice":null,"maxPrice":null,"dateRange":null}
`;

  try {
    const response = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ]);

    const parsed = JSON.parse(response);

    return {
      category: parsed.category ?? null,
      minPrice: normalizeNumber(parsed.minPrice),
      maxPrice: normalizeNumber(parsed.maxPrice),
      dateRange: parsed.dateRange ?? null,
    };
  } catch (error) {
    console.error('LLM constraint extraction failed:', error);
    return {
      category: null,
      minPrice: null,
      maxPrice: null,
      dateRange: null,
    };
  }
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

  const underMatch = lowerQuery.match(underPattern);
  if (underMatch) {
    maxPrice = parseInt(underMatch[1].replace(/,/g, ''));
  }

  const overMatch = lowerQuery.match(overPattern);
  if (overMatch) {
    minPrice = parseInt(overMatch[1].replace(/,/g, ''));
  }

  const betweenMatch = lowerQuery.match(betweenPattern);
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1].replace(/,/g, ''));
    maxPrice = parseInt(betweenMatch[2].replace(/,/g, ''));
  }

  return { minPrice, maxPrice };
}

// Parse date constraints from query
function parseDateConstraints(query) {
  const lowerQuery = query.toLowerCase();

  // Match "last X days/weeks/months" or "last day/week/month"
  const lastPattern = /last\s*(?:(\d+)\s*)?(days?|weeks?|months?)/i;
  const pastPattern = /past\s*(?:(\d+)\s*)?(days?|weeks?|months?)/i;
  const match = lowerQuery.match(lastPattern) || lowerQuery.match(pastPattern);

  if (match) {
    const num = match[1] ? parseInt(match[1]) : 1;
    const unit = match[2].toLowerCase();
    const now = new Date();
    let startDate;

    if (unit.startsWith('day')) {
      startDate = new Date(now.getTime() - num * 24 * 60 * 60 * 1000);
    } else if (unit.startsWith('week')) {
      startDate = new Date(now.getTime() - num * 7 * 24 * 60 * 60 * 1000);
    } else if (unit.startsWith('month')) {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - num);
    }

    return { startDate };
  }

  return null;
}

// Clean query by removing price and date constraints for better semantic search
function cleanQueryForEmbedding(query) {
  return query
    .replace(/(?:under|below|less than|<|over|above|more than|greater than)\s*\d+(?:,\d+)*/gi, '')
    .replace(/(?:between)\s*\d+(?:,\d+)*\s*(?:and|-)\s*\d+(?:,\d+)*/gi, '')
    .replace(/(?:last|past)\s*(?:\d+\s*)?(?:days?|weeks?|months?)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function searchProducts(query, topK = 5) {
  // Extract intent with Ollama, then fall back to basic regex parsing if needed
  const intent = await extractQueryConstraints(query);
  const fallbackPrices = parsePriceConstraints(query);

  const minPrice = intent.minPrice == null ? fallbackPrices.minPrice : intent.minPrice;
  const maxPrice = intent.maxPrice == null ? fallbackPrices.maxPrice : intent.maxPrice;
  const dateConstraints = parseDateConstraints(intent.dateRange || query);

  // Clean query for embedding (remove price and date mentions)
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

  // Filter by date constraints if present
  if (dateConstraints) {
    semanticResults = semanticResults.filter(r => {
      const createdDate = new Date(r.metadata.createdDate);
      return createdDate >= dateConstraints.startDate;
    });
  }

  // If no price constraints, return filtered semantic results
  if (minPrice == null && maxPrice == null) {
    return semanticResults.slice(0, topK).map(r => ({
      ...r,
      createdDate: r.metadata.createdDate
    }));
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
        if (minPrice != null && price < minPrice) return null;
        if (maxPrice != null && price > maxPrice) return null;

        return {
          ...semanticResult,
          price: price,
          name: product.name,
          createdDate: semanticResult.metadata.createdDate
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return filteredResults;

  } catch (error) {
    console.error('Error fetching product prices:', error);
    // Fallback to semantic results if price filtering fails
    return semanticResults.slice(0, topK).map(r => ({
      ...r,
      createdDate: r.metadata.createdDate
    }));
  }
}

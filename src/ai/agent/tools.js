import { searchProducts } from '../embeddings/searchProducts.js';

export const tools = {
  searchProducts: async ({ query, topK = 3 }) => {
    const results = await searchProducts(query, topK);
    return results.map(r => ({
      name: r.metadata.name,
      price: r.metadata.price,
      categories: r.metadata.categories,
      score: r.score
    }));
  }
};

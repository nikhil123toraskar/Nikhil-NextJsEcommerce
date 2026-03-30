# AI Search Explanation

1. What are Embeddings?
- Embeddings are numeric vectors that represent text in a way a machine can compare.
- For a product, the embedding captures the semantic meaning of its title, description, and related text.
- Similar products or search queries get similar vectors, even if the exact words differ.

2. What is `vectorStore.json`?
- `vectorStore.json` is a local store of product embeddings.
- Each entry usually contains:
  - `id`: the product identifier
  - `embedding`: the numeric vector representation
  - `metadata`: supporting info like product name and createdDate
- It lets the app compare a search query to products efficiently without re-embedding every product at runtime.

3. How does our Agentic Search functionality work?
- The user types a query in the search bar and submits it.
- The `/shop` page detects the `name` query parameter and calls the internal API route `/api/ai/recommend`.
- The API route executes `searchProducts(query, 10)` from `src/ai/embeddings/searchProducts.js`.
- The search flow includes both:
  - LLM-based intent extraction
  - semantic embedding comparison
- The LLM interprets query intent and returns structured instructions such as `minPrice`, `maxPrice`, `dateRange`, and category hints.
- The query is cleaned and converted into an embedding vector.
- The app compares the query vector to the product vectors in `vectorStore.json` using cosine similarity.
- Products with the closest vectors are ranked and returned.
- Then the app applies filters like price and date, and fetches full product details from Wix.
- Finally, `ProductList.tsx` renders the AI-ranked product results.

4. Why is this agentic AI?
- Because the system uses the LLM as a reasoning agent, not just a text encoder.
- The LLM decides how the search should behave by extracting structured intent from natural language.
- It outputs instructions like price ranges and date ranges that guide the search logic.
- This means the AI is acting like a controller: it understands intent, makes decisions, and shapes the search.
- Non-agentic search would only embed the query and return nearest matches; this system also applies AI-driven filtering logic.

5. What future possibilities exist for this search functionality?
- Better intent understanding with more fields: category, brand, color, use case, sentiment.
- Conversational search with follow-up questions and refinement.
- Hybrid retrieval combining exact Wix filters, semantic embeddings, and language-based constraints.
- Personalized recommendations using user behavior and history.
- Expanded vector store content including descriptions, tags, reviews, and category text.
- Real-time vector updates so new products appear immediately.
- Multi-modal search with images as well as text.
- Better explainability: show why a product matched the query.
- Search analytics and tuning using query logs and click data.
- More advanced natural language date and price handling such as “past quarter” or “between ₹1500 and ₹2500”.

6. Why is this a strong foundation?
- The project already includes:
  - semantic embeddings
  - an LLM for intent extraction
  - a local vector store
  - date and price filtering
  - an AI-centered search UI
- This makes it easy to evolve from smart search into a more powerful shopping assistant.

# E-commerce with AI-Powered Search

This is a [Next.js](https://nextjs.org/) project with AI-powered product search using local Ollama models.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Local AI (Required for AI Search)

**Prerequisites:**
- Install [Ollama](https://ollama.ai/) on your system

**Quick Setup:**
```bash
# Run the automated setup script
./setup-local-ai.sh
```

**Manual Setup:**
```bash
# Start Ollama service
ollama serve

# Pull required models (in another terminal)
ollama pull nomic-embed-text      # For embeddings
ollama pull llama3.1              # For text generation
ollama pull llama3:8b-instruct-q4_0  # For AI agent
```

### 3. Generate Product Embeddings (One-time setup)
```bash
# Generate embeddings for your products
node src/ai/embeddings/generateEmbeddings.ts
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

### 5. Test AI Search
Visit: `http://localhost:3001/shop?name=shoes&mode=ai`

## AI Features

- **Local AI Search**: Uses Ollama models running locally (no API keys or cloud services required)
- **Semantic Search**: Finds products based on meaning, not just keywords
- **Vector Embeddings**: Pre-computed embeddings stored locally

## Environment Variables

Create a `.env` file with:
```
NEXT_PUBLIC_WIX_CLIENTID=your-wix-client-id
OLLAMA_BASE_URL=http://localhost:11434
```

## Project Structure

- `src/ai/embeddings/` - Vector search and embedding generation
- `src/ai/agent/` - AI agent for complex queries
- `src/app/api/ai/recommend/` - AI search API endpoint
- `src/app/shop/` - Shop page with AI search integration

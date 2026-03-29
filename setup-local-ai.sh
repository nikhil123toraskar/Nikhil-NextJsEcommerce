#!/bin/bash

echo "🚀 Setting up local AI for E-commerce Demo"
echo "=========================================="

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Please install it first:"
    echo "   macOS: brew install ollama"
    echo "   Linux: curl -fsSL https://ollama.ai/install.sh | sh"
    echo "   Windows: Download from https://ollama.ai/download"
    exit 1
fi

echo "✅ Ollama is installed"

# Start Ollama service
echo "🔄 Starting Ollama service..."
ollama serve &
sleep 2

# Pull required models
echo "📥 Pulling required models..."

echo "   Pulling nomic-embed-text for embeddings..."
ollama pull nomic-embed-text

echo "   Pulling llama3.1 for text generation..."
ollama pull llama3.1

echo "   Pulling llama3:8b-instruct-q4_0 for agent..."
ollama pull llama3:8b-instruct-q4_0

echo "✅ All models downloaded!"

# Check if vector store exists
if [ ! -f "src/ai/vectorStore.json" ]; then
    echo "⚠️  Vector store not found. You need to generate embeddings first."
    echo "   Run: node src/ai/embeddings/generateEmbeddings.ts"
else
    echo "✅ Vector store found at src/ai/vectorStore.json"
fi

echo ""
echo "🎉 Setup complete! Your local AI is ready."
echo "   Next.js dev server: npm run dev"
echo "   Visit: http://localhost:3001/shop?name=shoes&mode=ai"
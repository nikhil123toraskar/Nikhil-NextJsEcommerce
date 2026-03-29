// export const runtime = "nodejs";

// import Agent from "@/ai/agent/agent";
// import { callLLM } from "@/ai/agent/llm";

// export async function POST(req) {
//   console.log("OLLAMA BASE URL:", process.env.OLLAMA_BASE_URL);
//   const { query } = await req.json();

//   const agent = new Agent(callLLM);
//   const result = await agent.think(query);

//   return new Response(
//     JSON.stringify({ result }),
//     { status: 200 }
//   );
// }

import { NextResponse } from "next/server";
import { searchProducts } from "@/ai/embeddings/searchProducts";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.query) {
      return NextResponse.json(
        { error: "Query missing" },
        { status: 400 }
      );
    }

    // Use local search functionality instead of deployed server
    const results = await searchProducts(body.query, 10);

    return NextResponse.json({
      result: {
        results: results.map(item => ({
          id: item.id,
          name: item.name,
          score: item.score
        }))
      }
    });

  } catch (err) {
    console.error("Local AI search failed:", err);

    return NextResponse.json(
      { error: "AI search failed" },
      { status: 500 }
    );
  }
}

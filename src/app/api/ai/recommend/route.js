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

const AI_SERVER = "http://103.195.6.92:3001/recommend";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.query) {
      return NextResponse.json(
        { error: "Query missing" },
        { status: 400 }
      );
    }

    const res = await fetch(AI_SERVER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: body.query,
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      result: data,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "AI server failed" },
      { status: 500 }
    );
  }
}

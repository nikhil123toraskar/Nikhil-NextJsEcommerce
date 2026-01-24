export const runtime = "nodejs";

import Agent from "@/ai/agent/agent";
import { callLLM } from "@/ai/agent/llm";

export async function POST(req) {
  const { query } = await req.json();

  const agent = new Agent(callLLM);
  const result = await agent.think(query);

  return new Response(
    JSON.stringify({ result }),
    { status: 200 }
  );
}

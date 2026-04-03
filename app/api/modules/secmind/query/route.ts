/**
 * POST /api/modules/secmind/query  → POST botios-mod-secmind/query
 * RAG query — asks a natural language question over the knowledge graph.
 * Body: { query: string, limit?: number }
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, SECMIND_URL } from "@/lib/module-auth";

export async function POST(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const body = await req.text();

  const res = await fetch(`${SECMIND_URL}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyResponse(res);
}

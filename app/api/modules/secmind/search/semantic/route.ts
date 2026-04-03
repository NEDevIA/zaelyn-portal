/**
 * POST /api/modules/secmind/search/semantic  → POST botios-mod-secmind/search/semantic
 * Semantic (vector) search over nodes via pgvector.
 * Body: { query: string, limit?: number, threshold?: number }
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, SECMIND_URL } from "@/lib/module-auth";

export async function POST(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const body = await req.text();

  const res = await fetch(`${SECMIND_URL}/search/semantic`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyResponse(res);
}

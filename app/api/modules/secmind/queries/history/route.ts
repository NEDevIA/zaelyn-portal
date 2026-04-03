/**
 * GET /api/modules/secmind/queries/history  → GET botios-mod-secmind/queries/history
 * Returns the user's past RAG queries.
 *
 * Query params: limit, offset
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, SECMIND_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const upstream = new URL(`${SECMIND_URL}/queries/history`);
  const allowed = ["limit", "offset"];
  allowed.forEach((k) => {
    const v = req.nextUrl.searchParams.get(k);
    if (v) upstream.searchParams.set(k, v);
  });

  const res = await fetch(upstream.toString(), {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  return proxyResponse(res);
}

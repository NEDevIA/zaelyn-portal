/**
 * GET /api/modules/journal/entries
 * Proxy → GET botios-mod-journal.fly.dev/entries
 *
 * Query params pasados directamente: from, to, mood, topic, limit, offset
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, JOURNAL_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const upstream = new URL(`${JOURNAL_URL}/entries`);
  // Forward supported query params
  const allowed = ["from", "to", "mood", "topic", "source", "limit", "offset"];
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

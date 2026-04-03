/**
 * GET /api/modules/journal/mood?from=YYYY-MM-DD&to=YYYY-MM-DD&granularity=day|week|month
 * Proxy → GET botios-mod-journal.fly.dev/stats/mood-timeline
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, JOURNAL_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const upstream = new URL(`${JOURNAL_URL}/stats/mood-timeline`);
  const allowed = ["from", "to", "granularity"];
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

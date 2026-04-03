/**
 * GET /api/modules/journal/stats?yearMonth=YYYY-MM
 * Proxy → GET botios-mod-journal.fly.dev/stats/monthly
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, JOURNAL_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const yearMonth =
    req.nextUrl.searchParams.get("yearMonth") ??
    new Date().toISOString().substring(0, 7); // default: current month

  const upstream = `${JOURNAL_URL}/stats/monthly?yearMonth=${encodeURIComponent(yearMonth)}`;

  const res = await fetch(upstream, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  return proxyResponse(res);
}

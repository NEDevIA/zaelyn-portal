/**
 * GET /api/modules/journal/streak
 * Proxy → GET botios-mod-journal.fly.dev/stats/streak
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, JOURNAL_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const res = await fetch(`${JOURNAL_URL}/stats/streak`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  return proxyResponse(res);
}

/**
 * GET /api/modules/remind/commitments
 * → GET botios-mod-remind.fly.dev/commitments
 * Returns: { owe: [...], owed: [...], total: number }
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, REMIND_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const res = await fetch(`${REMIND_URL}/commitments`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  return proxyResponse(res);
}

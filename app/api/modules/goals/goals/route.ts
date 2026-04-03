/**
 * GET  /api/modules/goals/goals  → GET  botios-mod-goals/goals
 * POST /api/modules/goals/goals  → POST botios-mod-goals/goals
 *
 * GET params: status (active|paused|completed), type, domain
 * Goals module uses x-user-id header (not Bearer JWT) for REST routes.
 */
import { NextRequest } from "next/server";
import { getModuleAuth, unauthorized, proxyResponse, GOALS_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const auth = await getModuleAuth(req);
  if (!auth) return unauthorized();

  const upstream = new URL(`${GOALS_URL}/goals`);
  const allowed = ["status", "type", "domain"];
  allowed.forEach((k) => {
    const v = req.nextUrl.searchParams.get(k);
    if (v) upstream.searchParams.set(k, v);
  });

  const res = await fetch(upstream.toString(), {
    headers: {
      "x-user-id": auth.userId,
      Authorization: `Bearer ${auth.jwt}`,
    },
    cache: "no-store",
  });
  return proxyResponse(res);
}

export async function POST(req: NextRequest) {
  const auth = await getModuleAuth(req);
  if (!auth) return unauthorized();

  const body = await req.json().catch(() => ({}));

  const res = await fetch(`${GOALS_URL}/goals`, {
    method: "POST",
    headers: {
      "x-user-id": auth.userId,
      Authorization: `Bearer ${auth.jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, userId: auth.userId }),
  });
  return proxyResponse(res);
}

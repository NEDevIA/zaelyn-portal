/**
 * GET  /api/modules/remind/items  → GET  botios-mod-remind.fly.dev/items
 * POST /api/modules/remind/items  → POST botios-mod-remind.fly.dev/items
 *
 * GET query params: status, type, due_today, overdue, limit, offset
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, REMIND_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const upstream = new URL(`${REMIND_URL}/items`);
  const allowed = ["status", "type", "due_today", "overdue", "context", "space", "limit", "offset"];
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

export async function POST(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const body = await req.text();

  const res = await fetch(`${REMIND_URL}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyResponse(res);
}

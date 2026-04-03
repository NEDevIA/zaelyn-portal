/**
 * GET  /api/modules/secmind/nodes  → GET  botios-mod-secmind/nodes
 * POST /api/modules/secmind/nodes  → POST botios-mod-secmind/nodes
 *
 * GET query params: limit, offset, daily, para_bucket, evergreen
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, SECMIND_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  try {
    const jwt = await getModuleJwt(req);
    if (!jwt) return unauthorized();

    const upstream = new URL(`${SECMIND_URL}/nodes`);
    const allowed = ["limit", "offset", "daily", "para_bucket", "evergreen", "include_links"];
    allowed.forEach((k) => {
      const v = req.nextUrl.searchParams.get(k);
      if (v) upstream.searchParams.set(k, v);
    });

    const res = await fetch(upstream.toString(), {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });

    return proxyResponse(res);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[secmind/nodes GET]", msg);
    return Response.json({ error: "Error al conectar con el módulo Sirius" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const body = await req.text();

  const res = await fetch(`${SECMIND_URL}/nodes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyResponse(res);
}

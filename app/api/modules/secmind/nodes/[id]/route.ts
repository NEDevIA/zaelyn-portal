/**
 * GET   /api/modules/secmind/nodes/:id  → GET   botios-mod-secmind/nodes/:id
 * PATCH /api/modules/secmind/nodes/:id  → PATCH botios-mod-secmind/nodes/:id
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, SECMIND_URL } from "@/lib/module-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const { id } = await params;

  const res = await fetch(`${SECMIND_URL}/nodes/${id}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  return proxyResponse(res);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const { id } = await params;
  const body = await req.text();

  const res = await fetch(`${SECMIND_URL}/nodes/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyResponse(res);
}

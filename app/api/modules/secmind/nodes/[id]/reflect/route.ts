/**
 * POST /api/modules/secmind/nodes/:id/reflect  → POST botios-mod-secmind/nodes/:id/reflect
 * Saves a personal reflection on a node.
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, SECMIND_URL } from "@/lib/module-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const { id } = await params;
  const body = await req.text();

  const res = await fetch(`${SECMIND_URL}/nodes/${id}/reflect`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyResponse(res);
}

/**
 * GET /api/modules/secmind/nodes/:id/links  → GET botios-mod-secmind/nodes/:id/links
 * Returns forward and backward links for a node.
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

  const res = await fetch(`${SECMIND_URL}/nodes/${id}/links`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  return proxyResponse(res);
}

/**
 * PATCH  /api/modules/remind/items/:id  → PATCH  botios-mod-remind.fly.dev/items/:id
 * DELETE /api/modules/remind/items/:id  → DELETE botios-mod-remind.fly.dev/items/:id
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, REMIND_URL } from "@/lib/module-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const { id } = await params;
  const body = await req.text();

  const res = await fetch(`${REMIND_URL}/items/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyResponse(res);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const { id } = await params;
  const permanent = req.nextUrl.searchParams.get("permanent");
  const url = `${REMIND_URL}/items/${id}${permanent ? `?permanent=${permanent}` : ""}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${jwt}` },
  });

  // 204 No Content — return empty response
  if (res.status === 204) return new Response(null, { status: 204 });
  return proxyResponse(res);
}

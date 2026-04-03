/**
 * GET   /api/modules/goals/goals/[id] → GET   botios-mod-goals/goals/:id
 * PATCH /api/modules/goals/goals/[id] → PATCH botios-mod-goals/goals/:id
 */
import { NextRequest } from "next/server";
import { getModuleAuth, unauthorized, proxyResponse, GOALS_URL } from "@/lib/module-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getModuleAuth(req);
  if (!auth) return unauthorized();

  const res = await fetch(`${GOALS_URL}/goals/${id}?userId=${auth.userId}`, {
    headers: {
      "x-user-id": auth.userId,
      Authorization: `Bearer ${auth.jwt}`,
    },
    cache: "no-store",
  });
  return proxyResponse(res);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getModuleAuth(req);
  if (!auth) return unauthorized();

  const body = await req.json().catch(() => ({}));

  const res = await fetch(`${GOALS_URL}/goals/${id}`, {
    method: "PATCH",
    headers: {
      "x-user-id": auth.userId,
      Authorization: `Bearer ${auth.jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, userId: auth.userId }),
  });
  return proxyResponse(res);
}

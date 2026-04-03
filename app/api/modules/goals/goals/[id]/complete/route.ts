/**
 * POST /api/modules/goals/goals/[id]/complete → POST botios-mod-goals/goals/:id/complete
 */
import { NextRequest } from "next/server";
import { getModuleAuth, unauthorized, proxyResponse, GOALS_URL } from "@/lib/module-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await getModuleAuth(req);
  if (!auth) return unauthorized();

  const res = await fetch(`${GOALS_URL}/goals/${id}/complete`, {
    method: "POST",
    headers: {
      "x-user-id": auth.userId,
      Authorization: `Bearer ${auth.jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: auth.userId }),
  });
  return proxyResponse(res);
}

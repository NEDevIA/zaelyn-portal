/**
 * GET /api/modules/goals/goals/[id]/health → GET botios-mod-goals/goals/:id/health
 * Returns health_history records (signal_actions, signal_mood, signal_pace, health_score)
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

  const upstream = new URL(`${GOALS_URL}/goals/${id}/health`);
  upstream.searchParams.set("userId", auth.userId);
  const limit = req.nextUrl.searchParams.get("limit");
  if (limit) upstream.searchParams.set("limit", limit);

  const res = await fetch(upstream.toString(), {
    headers: {
      "x-user-id": auth.userId,
      Authorization: `Bearer ${auth.jwt}`,
    },
    cache: "no-store",
  });
  return proxyResponse(res);
}

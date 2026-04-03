/**
 * GET /api/modules/goals/goals/conflicts → GET botios-mod-goals/goals/conflicts
 */
import { NextRequest } from "next/server";
import { getModuleAuth, unauthorized, proxyResponse, GOALS_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const auth = await getModuleAuth(req);
  if (!auth) return unauthorized();

  const res = await fetch(`${GOALS_URL}/goals/conflicts`, {
    headers: {
      "x-user-id": auth.userId,
      Authorization: `Bearer ${auth.jwt}`,
    },
    cache: "no-store",
  });
  return proxyResponse(res);
}

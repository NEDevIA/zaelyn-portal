/**
 * GET  /api/modules/goals/checkin → GET  botios-mod-goals/checkin/weekly (AI questions)
 * POST /api/modules/goals/checkin → POST botios-mod-goals/checkin/weekly (submit answers)
 */
import { NextRequest } from "next/server";
import { getModuleAuth, unauthorized, proxyResponse, GOALS_URL } from "@/lib/module-auth";

export async function GET(req: NextRequest) {
  const auth = await getModuleAuth(req);
  if (!auth) return unauthorized();

  const res = await fetch(`${GOALS_URL}/checkin/weekly?userId=${auth.userId}`, {
    headers: {
      "x-user-id": auth.userId,
      Authorization: `Bearer ${auth.jwt}`,
    },
    cache: "no-store",
  });
  return proxyResponse(res);
}

export async function POST(req: NextRequest) {
  const auth = await getModuleAuth(req);
  if (!auth) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const weekStart = new Date();
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));

  const res = await fetch(`${GOALS_URL}/checkin/weekly`, {
    method: "POST",
    headers: {
      "x-user-id": auth.userId,
      Authorization: `Bearer ${auth.jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: auth.userId,
      weekStart: weekStart.toISOString().slice(0, 10),
      answers: body.answers ?? [],
    }),
  });
  return proxyResponse(res);
}

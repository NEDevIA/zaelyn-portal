/**
 * POST /api/modules/remind/habits/:id/checkin
 * → POST botios-mod-remind.fly.dev/habits/:id/checkin
 */
import { NextRequest } from "next/server";
import { getModuleJwt, unauthorized, proxyResponse, REMIND_URL } from "@/lib/module-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const jwt = await getModuleJwt(req);
  if (!jwt) return unauthorized();

  const { id } = await params;

  const res = await fetch(`${REMIND_URL}/habits/${id}/checkin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  return proxyResponse(res);
}

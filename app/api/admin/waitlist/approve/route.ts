import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth-tokens";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "https://botios-staging.fly.dev";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("zaelyn-token")?.value;
  const payload = await verifySessionToken(token ?? "");
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await req.json();
  const res = await fetch(`${BACKEND}/api/v1/portal/waitlist/approve`, {
    method: "POST",
    headers: {
      "Content-Type":        "application/json",
      "X-Portal-Auth":       process.env.PORTAL_API_SECRET ?? "",
      "X-Portal-User-Email": payload.email,
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

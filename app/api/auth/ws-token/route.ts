import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth-tokens";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "https://botios-staging.fly.dev";

// Exchanges the portal session JWT (signed with MAGIC_LINK_SECRET) for a
// backend JWT (signed with backend JWT_SECRET) suitable for WebSocket auth.
export async function GET(req: NextRequest) {
  const token = req.cookies.get("zaelyn-token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const payload = await verifySessionToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const res = await fetch(`${BACKEND}/api/v1/portal/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: payload.email, channel: "web" }),
    cache: "no-store",
  });

  if (!res.ok) return NextResponse.json({ error: "Backend auth failed" }, { status: 502 });

  const data = await res.json() as { token?: string };
  if (!data.token) return NextResponse.json({ error: "No token from backend" }, { status: 502 });

  return NextResponse.json({ token: data.token });
}

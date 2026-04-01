import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth-tokens";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("zaelyn-token")?.value;
  if (!token) return NextResponse.json({ linked: false }, { status: 401 });

  const payload = await verifySessionToken(token);
  if (!payload) return NextResponse.json({ linked: false }, { status: 401 });

  const API =
    process.env.NEXT_PUBLIC_API_URL ?? "https://ne-botios-staging.fly.dev";

  const res = await fetch(`${API}/api/v1/portal/telegram/link-status`, {
    headers: {
      "X-Portal-User-Email": payload.email,
      "X-Portal-Auth": process.env.PORTAL_API_SECRET ?? "",
    },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}

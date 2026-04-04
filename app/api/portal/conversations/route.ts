import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth-tokens";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://botios-staging.fly.dev";

async function getPortalHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("zaelyn-token")?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;
  return {
    "Content-Type": "application/json",
    "X-Portal-User-Email": payload.email,
    "X-Portal-Auth": process.env.PORTAL_API_SECRET ?? "",
  };
}

export async function GET() {
  const headers = await getPortalHeaders();
  if (!headers) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${API}/api/v1/portal/conversations`, {
    headers,
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}

export async function POST(request: Request) {
  const headers = await getPortalHeaders();
  if (!headers) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API}/api/v1/portal/conversations`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 201 : res.status });
}

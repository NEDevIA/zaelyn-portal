import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth-tokens";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://botios-staging.fly.dev";

async function getHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("zaelyn-token")?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;
  return {
    "X-Portal-User-Email": payload.email,
    "X-Portal-Auth": process.env.PORTAL_API_SECRET ?? "",
    "Content-Type": "application/json",
  };
}

// GET /api/portal/conversations/:id — fetch messages for a conversation
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = await getHeaders();
  if (!headers) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const res = await fetch(
    `${API}/api/v1/portal/conversations/${encodeURIComponent(id)}/messages`,
    { method: "GET", headers, cache: "no-store" }
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = await getHeaders();
  if (!headers) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const res = await fetch(
    `${API}/api/v1/portal/conversations/${encodeURIComponent(id)}`,
    { method: "PATCH", headers, body: JSON.stringify(body) }
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = await getHeaders();
  if (!headers) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const res = await fetch(
    `${API}/api/v1/portal/conversations/${encodeURIComponent(id)}`,
    { method: "DELETE", headers }
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}

import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://ne-botios-staging.fly.dev";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("zaelyn-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  try {
    const res = await fetch(`${API}/api/v1/portal/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Error de red" }, { status: 500 });
  }
}

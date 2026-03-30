import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://ne-botios-staging.fly.dev";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("zaelyn-token")?.value;
  if (token) {
    try {
      await fetch(`${API}/api/v1/portal/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* best-effort */ }
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("zaelyn-token");
  return response;
}

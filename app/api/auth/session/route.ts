import { NextRequest, NextResponse } from "next/server";

// Returns the raw JWT for WebSocket connections.
// Only accessible from the same origin — not sensitive beyond what /api/auth/me already exposes.
export async function GET(req: NextRequest) {
  const token = req.cookies.get("zaelyn-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  return NextResponse.json({ token });
}

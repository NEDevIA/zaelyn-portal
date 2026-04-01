import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth-tokens";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("zaelyn-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Decode session token — email is stored in the JWT payload
  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  // Return minimal user profile derived from session token.
  // When the backend has /api/v1/portal/me ready, swap this for a proxy call.
  const email = payload.email;
  const name = email.split("@")[0].replace(/[._]/g, " ");

  return NextResponse.json({
    id: Buffer.from(email).toString("base64"),
    email,
    name,
    plan: "beta",
    persona: "sabia",
    privacyMode: "sovereign",
  });
}

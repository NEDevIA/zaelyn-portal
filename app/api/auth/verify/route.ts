import { NextRequest, NextResponse } from "next/server";
import { verifyMagicToken, createSessionToken } from "@/lib/auth-tokens";

export async function GET(req: NextRequest) {
  const magicToken = req.nextUrl.searchParams.get("token");

  if (!magicToken) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  // Verify the 15-min magic link token
  const payload = await verifyMagicToken(magicToken);

  if (!payload) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  // Create long-lived session token (30 days)
  const sessionToken = await createSessionToken(payload.email);

  // Set httpOnly cookie and redirect to /chat
  const response = NextResponse.redirect(new URL("/chat", req.url));
  response.cookies.set("zaelyn-token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}

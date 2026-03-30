import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://ne-botios-staging.fly.dev";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  try {
    const res = await fetch(
      `${API}/api/v1/portal/auth/verify?token=${encodeURIComponent(token)}`
    );
    if (!res.ok) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
    }

    const data = await res.json();
    const jwt: string = data.token ?? data.access_token;
    if (!jwt) {
      return NextResponse.redirect(new URL("/login?error=no_token", req.url));
    }

    const response = NextResponse.redirect(new URL("/chat", req.url));
    response.cookies.set("zaelyn-token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=server", req.url));
  }
}

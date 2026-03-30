import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/chat", "/me", "/mira", "/sirius", "/orion", "/polaris"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isProtected) {
    const token = request.cookies.get("zaelyn-token");
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/me/:path*", "/mira/:path*", "/sirius/:path*", "/orion/:path*", "/polaris/:path*"],
};

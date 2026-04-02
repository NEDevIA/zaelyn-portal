import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth-tokens";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "https://botios-staging.fly.dev";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("zaelyn-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const email = payload.email;

  // Fetch real user profile from backend to get plan, display_name, privacy_mode
  let plan: string = "beta";
  let persona: string = "sabia";
  let privacyMode: string = "sovereign";
  let displayName: string = email.split("@")[0].replace(/[._]/g, " ");

  try {
    const res = await fetch(`${BACKEND}/api/v1/portal/user`, {
      headers: {
        "X-Portal-Auth":       process.env.PORTAL_API_SECRET ?? "",
        "X-Portal-User-Email": email,
      },
      cache: "no-store",
    });
    if (res.ok) {
      const { user } = await res.json() as { user: Record<string, string> };
      if (user["plan"])         plan        = user["plan"];
      if (user["display_name"]) displayName = user["display_name"];
      if (user["privacy_mode"]) privacyMode = user["privacy_mode"];
    }
  } catch {
    // Backend unavailable — return safe defaults
  }

  return NextResponse.json({
    id:          Buffer.from(email).toString("base64"),
    email,
    name:        displayName,
    plan,
    persona,
    privacyMode,
  });
}

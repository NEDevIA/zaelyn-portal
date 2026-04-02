import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ?? "https://botios-staging.fly.dev";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  try {
    const res = await fetch(`${BACKEND}/api/v1/portal/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));

    // 409 = email already exists in nexus_users → approved, let them in
    if (res.status === 409) return NextResponse.json({ status: "approved" });

    if (data.already_approved) return NextResponse.json({ status: "approved" });

    if (data.registered || data.already_registered)
      return NextResponse.json({ status: "waiting" });

    if (res.status === 201) return NextResponse.json({ status: "waiting" });

    return NextResponse.json({ status: "approved" }); // fail-open
  } catch {
    // Si el backend no responde, dejamos pasar
    return NextResponse.json({ status: "approved" });
  }
}

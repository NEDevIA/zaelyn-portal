import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("zaelyn-token")?.value;
  if (!token) return NextResponse.json({ linked: false }, { status: 401 });

  const res = await fetch(
    `${process.env.BACKEND_URL ?? "https://ne-botios-staging.fly.dev"}/api/v1/portal/telegram/link-status`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}

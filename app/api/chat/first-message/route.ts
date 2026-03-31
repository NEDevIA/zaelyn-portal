import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("zaelyn-token")?.value;
  if (!token) {
    return NextResponse.json({ isFirstToday: false });
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL ?? "https://ne-botios-staging.fly.dev"}/api/v1/portal/first-message-today`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return NextResponse.json({ isFirstToday: false });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ isFirstToday: false });
  }
}

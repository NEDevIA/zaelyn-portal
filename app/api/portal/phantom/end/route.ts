import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("zaelyn-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const res = await fetch(
    `${process.env.BACKEND_URL ?? "https://ne-botios-staging.fly.dev"}/api/v1/portal/phantom/end`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : res.status });
}

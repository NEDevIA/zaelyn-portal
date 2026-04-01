import { NextRequest, NextResponse } from "next/server";
import { createMagicToken } from "@/lib/auth-tokens";
import { sendMagicLinkEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, inviteCode } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Generate short-lived magic token (15 min)
    const token = await createMagicToken(normalizedEmail);

    // Send via Resend
    const result = await sendMagicLinkEmail(normalizedEmail, token);

    if (!result.ok) {
      console.error("[send-link] Resend error:", result.error);
      return NextResponse.json(
        { error: "No se pudo enviar el email. Intenta de nuevo." },
        { status: 500 }
      );
    }

    // Optionally notify backend of invite usage (fire-and-forget, non-blocking)
    if (inviteCode) {
      const API =
        process.env.NEXT_PUBLIC_API_URL ?? "https://ne-botios-staging.fly.dev";
      fetch(`${API}/api/v1/invites/${encodeURIComponent(inviteCode)}/use`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      }).catch(() => {/* non-critical */});
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-link]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

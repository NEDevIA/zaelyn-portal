/**
 * module-auth.ts
 *
 * Obtiene un JWT válido para llamar a los módulos (journal, remind…)
 *
 * Auth chain:
 *   zaelyn-token cookie  →  verifySessionToken (portal secret)
 *   → email  →  POST /api/v1/portal/auth (ne-botia core)
 *   → backend JWT (sub: userId, firmado con JWT_SECRET)
 *   → usado en Authorization: Bearer <token> en los módulos
 */

import { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth-tokens";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "https://botios-staging.fly.dev";

export const JOURNAL_URL =
  process.env.MODULE_JOURNAL_URL ?? "https://botios-mod-journal.fly.dev";
export const REMIND_URL =
  process.env.MODULE_REMIND_URL ?? "https://botios-mod-remind.fly.dev";
export const SECMIND_URL =
  process.env.MODULE_SECMIND_URL ?? "https://botios-mod-secmind.fly.dev";

/** Extrae un backend JWT a partir del cookie de sesión del portal. */
export async function getModuleJwt(req: NextRequest): Promise<string | null> {
  const sessionToken = req.cookies.get("zaelyn-token")?.value;
  if (!sessionToken) return null;

  const session = await verifySessionToken(sessionToken);
  if (!session?.email) return null;

  try {
    const res = await fetch(`${BACKEND}/api/v1/portal/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.email, channel: "web" }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string };
    return data.token ?? null;
  } catch {
    return null;
  }
}

/** 401 estandarizado */
export function unauthorized(): Response {
  return Response.json({ error: "No autenticado" }, { status: 401 });
}

/** Proxy de respuesta de módulo → cliente */
export async function proxyResponse(res: Response): Promise<Response> {
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

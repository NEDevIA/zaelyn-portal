const API = process.env.NEXT_PUBLIC_API_URL ?? "https://ne-botios-staging.fly.dev";

// All calls go through Next.js API routes (which read the httpOnly cookie).
// Direct backend calls are made server-side only.

export async function sendMagicLink(email: string, inviteCode?: string) {
  const res = await fetch("/api/auth/send-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, ...(inviteCode ? { inviteCode } : {}) }),
  });
  return res.json();
}

export async function getMe() {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function getWsToken(): Promise<string | null> {
  const res = await fetch("/api/auth/session");
  if (!res.ok) return null;
  const data = await res.json();
  return data.token ?? null;
}

// Invite code validation (direct to backend, public endpoint)
export async function validateInviteCode(code: string) {
  const res = await fetch(`${API}/api/v1/invites/${encodeURIComponent(code)}`);
  return res.json();
}

// Conversation history
export async function getConversations() {
  const res = await fetch("/api/auth/me"); // TODO: replace with conversations endpoint
  return [];
}

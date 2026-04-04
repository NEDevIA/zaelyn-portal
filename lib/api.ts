const API = process.env.NEXT_PUBLIC_API_URL ?? "https://botios-staging.fly.dev";

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
  const res = await fetch("/api/auth/ws-token");
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
export interface ConversationSummary {
  id: string;
  first_message: string | null;
  last_message: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export async function getConversations(): Promise<ConversationSummary[]> {
  const res = await fetch("/api/portal/conversations", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json() as { conversations?: ConversationSummary[] };
  return data.conversations ?? [];
}

export async function getConversationMessages(
  conversationId: string
): Promise<{ id: string; role: string; content: string; created_at: string }[]> {
  const res = await fetch(
    `/api/portal/conversations/${encodeURIComponent(conversationId)}/messages`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json() as { messages?: { id: string; role: string; content: string; created_at: string }[] };
  return data.messages ?? [];
}

// Telegram linking
export async function getTelegramLinkCode(): Promise<{ code: string; expiresIn: number } | null> {
  const res = await fetch("/api/portal/telegram/link-code", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function getTelegramLinkStatus(): Promise<{ linked: boolean; username?: string }> {
  const res = await fetch("/api/portal/telegram/link-status", { cache: "no-store" });
  if (!res.ok) return { linked: false };
  return res.json();
}

// Phantom Mode
export async function startPhantom(subMode: "pure" | "selective" | "encrypted"): Promise<{
  anonToken: string;
  expiresAt: string;
  subMode: string;
} | null> {
  const res = await fetch("/api/portal/phantom/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subMode }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function endPhantom(anonToken: string): Promise<void> {
  await fetch("/api/portal/phantom/end", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ anonToken }),
  });
}

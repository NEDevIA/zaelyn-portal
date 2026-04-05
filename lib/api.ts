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
  first_message: string;
  updated_at: string;
  title?: string; // custom rename persisted in backend
}

export async function getConversations(): Promise<ConversationSummary[]> {
  try {
    const res = await fetch("/api/portal/conversations", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json() as { conversations?: ConversationSummary[] };
    return data.conversations ?? [];
  } catch {
    return [];
  }
}

export async function renameConversation(id: string, title: string): Promise<void> {
  await fetch(`/api/portal/conversations/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}

export async function deleteConversation(id: string): Promise<void> {
  await fetch(`/api/portal/conversations/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export async function getConversationMessages(id: string): Promise<ConversationMessage[]> {
  try {
    const res = await fetch(`/api/portal/conversations/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json() as { messages?: ConversationMessage[] };
    return data.messages ?? [];
  } catch {
    return [];
  }
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

// Persona & user preferences
export async function getPersona() {
  const res = await fetch("/api/portal/persona", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function updatePersona(data: {
  personaId?: string;
  tone?: string;
  language?: string;
  briefingEnabled?: boolean;
  briefingTime?: string;
  preferredName?: string;
  customInstructions?: string;
}) {
  const res = await fetch("/api/portal/persona", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateUser(data: {
  preferred_model?: "fast" | "smart";
  privacy_level?: "comfort" | "sovereign" | "phantom" | "full_sovereign";
  display_name?: string;
  city?: string;
}) {
  const res = await fetch("/api/portal/user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

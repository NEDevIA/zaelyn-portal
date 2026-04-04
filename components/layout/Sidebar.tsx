"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, ChatsCircle, CaretDown } from "@phosphor-icons/react";
import { useChatStore } from "@/store/useChatStore";
import { useRightPanelStore } from "@/store/useRightPanelStore";
import { getConversations, type ConversationSummary } from "@/lib/api";

const MODULES = [
  { id: "aura",    label: "Tu aura",     color: "#8b5cf6", path: "/aura" },
  { id: "sirius",  label: "Tu memoria",  color: "#7c3aed", path: "/sirius" },
  { id: "orion",   label: "Tus tareas",  color: "#3b82f6", path: "/orion" },
  { id: "polaris", label: "Tus metas",   color: "#10b981", path: "/polaris" },
  { id: "pulsar",  label: "Tu red",      color: "#e879f9", path: "/pulsar" },
];

type ConvGroup = { label: string; conversations: { id: string; title: string; active?: boolean }[] };

function groupConversations(
  convs: ConversationSummary[],
  activePath: string
): ConvGroup[] {
  if (convs.length === 0) return [];

  const now = Date.now();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7);

  const groups: Record<string, ConversationSummary[]> = {
    Hoy: [],
    Ayer: [],
    "Esta semana": [],
    Anteriores: [],
  };

  for (const c of convs) {
    const d = new Date(c.updated_at).getTime();
    if (d >= todayStart.getTime())         groups["Hoy"]!.push(c);
    else if (d >= yesterdayStart.getTime()) groups["Ayer"]!.push(c);
    else if (d >= weekStart.getTime())      groups["Esta semana"]!.push(c);
    else                                    groups["Anteriores"]!.push(c);
  }

  const activeId = activePath.startsWith("/chat")
    ? new URLSearchParams(activePath.split("?")[1] ?? "").get("id") ?? ""
    : "";

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({
      label,
      conversations: items.map((c) => ({
        id: c.id,
        title: c.first_message?.slice(0, 48) ?? "Conversación",
        active: c.id === activeId,
      })),
    }));
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { newConversation, conversationId } = useChatStore();
  const { clearCards } = useRightPanelStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  // Reload on every mount — ensures history is fresh after navigating back from a module.
  // Zustand singletons don't re-trigger effects on navigation; useEffect with [] does.
  useEffect(() => {
    getConversations().then(setConversations).catch(() => {});
  }, []);

  const groups = groupConversations(conversations, pathname + (typeof window !== "undefined" ? window.location.search : ""));

  function handleNewConv() {
    newConversation();
    clearCards();
    router.push("/chat");
  }

  function toggleGroup(label: string) {
    setCollapsed((s) => ({ ...s, [label]: !s[label] }));
  }

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{
        width: "196px",
        borderRight: "1px solid var(--border)",
        background: "var(--background)",
      }}
    >
      {/* Nueva conversación */}
      <div className="p-3">
        <button
          onClick={handleNewConv}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.4)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
        >
          <Plus size={13} />
          Nueva conversación
        </button>
      </div>

      {/* Historial */}
      <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-1 pb-2">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <ChatsCircle size={24} style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
            <p
              className="text-[11px] text-center"
              style={{ color: "var(--muted-foreground)", opacity: 0.4 }}
            >
              Tus conversaciones aparecerán aquí
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center gap-1.5 w-full py-1.5 px-1 text-[10px] font-medium tracking-widest uppercase"
                style={{ color: "var(--muted-foreground)", opacity: 0.45 }}
              >
                {group.label}
                <CaretDown
                  size={10}
                  style={{
                    transform: collapsed[group.label] ? "rotate(-90deg)" : "rotate(0deg)",
                    transition: "transform 150ms ease",
                  }}
                />
              </button>
              {!collapsed[group.label] && (
                <div className="flex flex-col gap-0.5">
                  {group.conversations.map((conv) => (
                    <Link
                      key={conv.id}
                      href={`/chat?id=${conv.id}`}
                      className="block px-2 py-1.5 rounded-lg text-[12px] truncate transition-colors duration-100"
                      style={{
                        color: conv.active ? "var(--foreground)" : "var(--muted-foreground)",
                        background: conv.active ? "var(--card)" : "transparent",
                      }}
                    >
                      {conv.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Módulos */}
      <div
        className="p-3 flex flex-col gap-1"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p
          className="text-[10px] font-medium tracking-widest uppercase px-1 mb-1"
          style={{ color: "var(--muted-foreground)", opacity: 0.4 }}
        >
          Módulos
        </p>
        {MODULES.map((mod) => {
          const active = pathname.startsWith(mod.path);
          return (
            <Link
              key={mod.id}
              href={mod.path}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] transition-colors duration-100"
              style={{
                color: active ? mod.color : "var(--muted-foreground)",
                background: active ? `${mod.color}10` : "transparent",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: mod.color }}
              />
              {mod.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

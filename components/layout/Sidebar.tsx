"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, ChatsCircle, CaretDown, PencilSimple, Trash } from "@phosphor-icons/react";
import { useChatStore } from "@/store/useChatStore";
import { useRightPanelStore } from "@/store/useRightPanelStore";
import { getConversations, renameConversation, deleteConversation, type ConversationSummary } from "@/lib/api";

// Tu red removed — will appear when Pulsar is implemented
const MODULES = [
  { id: "aura",    label: "Tu aura",    color: "#8b5cf6", path: "/aura" },
  { id: "sirius",  label: "Tu memoria", color: "#7c3aed", path: "/sirius" },
  { id: "orion",   label: "Tus tareas", color: "#3b82f6", path: "/orion" },
  { id: "polaris", label: "Tus metas",  color: "#10b981", path: "/polaris" },
];

type ConvGroup = { label: string; conversations: { id: string; title: string; active?: boolean }[] };

function groupConversations(
  convs: ConversationSummary[],
  activeId: string
): ConvGroup[] {
  if (convs.length === 0) return [];

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
    if (d >= todayStart.getTime())          groups["Hoy"]!.push(c);
    else if (d >= yesterdayStart.getTime()) groups["Ayer"]!.push(c);
    else if (d >= weekStart.getTime())      groups["Esta semana"]!.push(c);
    else                                    groups["Anteriores"]!.push(c);
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({
      label,
      conversations: items.map((c) => ({
        id: c.id,
        title: c.title ?? c.first_message?.slice(0, 48) ?? "Conversación",
        active: c.id === activeId,
      })),
    }));
}

// ── ConvItem — individual conversation row with hover actions ─────────────────
function ConvItem({
  conv,
  onRenamed,
  onDeleted,
  onNavigate,
}: {
  conv: { id: string; title: string; active?: boolean };
  onRenamed: (id: string, title: string) => void;
  onDeleted: (id: string) => void;
  onNavigate: (id: string) => void;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(conv.title);
  const [confirming, setConfirming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditValue(conv.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  async function saveEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== conv.title) {
      await renameConversation(conv.id, trimmed);
      onRenamed(conv.id, trimmed);
    }
    setEditing(false);
  }

  function cancelEdit() {
    setEditing(false);
    setEditValue(conv.title);
  }

  function startDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirming(true);
  }

  async function confirmDelete() {
    await deleteConversation(conv.id);
    onDeleted(conv.id);
    if (conv.active) router.push("/chat");
  }

  if (editing) {
    return (
      <div className="px-2 py-1">
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          onBlur={saveEdit}
          className="w-full px-2 py-1 rounded-md text-[12px] outline-none"
          style={{
            background: "var(--card)",
            border: "1px solid rgba(99,102,241,0.4)",
            color: "var(--foreground)",
            fontFamily: "var(--font-dm-sans)",
          }}
        />
      </div>
    );
  }

  if (confirming) {
    return (
      <div
        className="px-2 py-1.5 rounded-lg flex items-center gap-1"
        style={{ background: "rgba(239,68,68,0.06)" }}
      >
        <span className="text-[11px] flex-1" style={{ color: "var(--muted-foreground)" }}>
          ¿Borrar?
        </span>
        <button
          onClick={confirmDelete}
          className="text-[11px] px-1.5 py-0.5 rounded font-medium"
          style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)" }}
        >
          Sí
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[11px] px-1.5 py-0.5 rounded"
          style={{ color: "var(--muted-foreground)" }}
        >
          No
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/chat?id=${conv.id}`}
        onClick={() => onNavigate(conv.id)}
        className="block px-2 py-1.5 rounded-lg text-[12px] truncate transition-colors duration-100 pr-14"
        style={{
          color: conv.active ? "var(--foreground)" : "var(--muted-foreground)",
          background: conv.active ? "var(--card)" : "transparent",
        }}
      >
        {conv.title}
      </Link>

      {hovered && (
        <div
          className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
          style={{ background: conv.active ? "var(--card)" : "var(--background)" }}
        >
          <button
            onClick={startEdit}
            className="w-5 h-5 flex items-center justify-center rounded transition-colors duration-100"
            style={{ color: "var(--muted-foreground)" }}
            title="Renombrar"
          >
            <PencilSimple size={11} />
          </button>
          <button
            onClick={startDelete}
            className="w-5 h-5 flex items-center justify-center rounded transition-colors duration-100"
            style={{ color: "var(--muted-foreground)" }}
            title="Borrar"
          >
            <Trash size={11} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { newConversation, conversationId, loadConversation } = useChatStore();
  const { clearCards } = useRightPanelStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  // Active conversation comes from URL search params (reactive to navigation)
  const activeId = pathname === "/chat" ? (searchParams.get("id") ?? "") : "";

  useEffect(() => {
    getConversations().then(setConversations).catch(() => {});
  }, [conversationId]);

  const groups = groupConversations(conversations, activeId);

  function handleNewConv() {
    newConversation();
    clearCards();
    router.push("/chat");
  }

  function toggleGroup(label: string) {
    setCollapsed((s) => ({ ...s, [label]: !s[label] }));
  }

  function handleRenamed(id: string, title: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }

  function handleDeleted(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }

  // Called when user clicks a conversation — load immediately without waiting for URL effect
  function handleConvNavigate(id: string) {
    if (id !== activeId) {
      loadConversation(id);
    }
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
                    <ConvItem
                      key={conv.id}
                      conv={conv}
                      onRenamed={handleRenamed}
                      onDeleted={handleDeleted}
                      onNavigate={handleConvNavigate}
                    />
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

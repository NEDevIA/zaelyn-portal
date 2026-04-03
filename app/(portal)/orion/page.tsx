"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import OrionSummary        from "@/components/orion/OrionSummary";
import OrionQuickAdd       from "@/components/orion/OrionQuickAdd";
import OrionHabitsSidebar  from "@/components/orion/OrionHabitsSidebar";
import OrionScoreRing      from "@/components/orion/OrionScoreRing";
import OrionTaskCard       from "@/components/orion/OrionTaskCard";
import OrionCommitmentCard from "@/components/orion/OrionCommitmentCard";
import OrionHabitsMain     from "@/components/orion/OrionHabitsMain";
import {
  ORION_RED, ORION_AMBER, ORION_GREEN,
  type OrionTask, type OrionCommitment, type OrionHabit,
  type TabKey, type ViewKey, type DueType,
} from "@/components/orion/orionData";

// ── Raw API types ──────────────────────────────────────────────────────────

interface RawItem {
  id: string;
  title: string;
  item_type: "reminder" | "commitment" | "habit";
  direction: "owe" | "owed" | null;
  priority: "urgent" | "high" | "medium" | "low";
  due_at: string | null;
  status: "pending" | "completed" | "archived";
  snooze_count: number;
  counterpart_id: string | null;
  created_at: string;
}

interface RawHabit {
  id: string;
  title: string;
  streak_current: number;
  streak_max: number;
  last_completed: string | null;
}

// ── Converters ─────────────────────────────────────────────────────────────

function classifyDueType(due_at: string | null, status: string): DueType {
  if (status === "completed") return "done";
  if (!due_at) return "future";

  const due  = new Date(due_at);
  const now  = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd   = new Date(todayStart.getTime() + 86400000);

  if (due < todayStart) return "overdue";
  if (due < todayEnd)   return "today";
  return "future";
}

function formatDue(due_at: string | null, dueType: DueType): string {
  if (!due_at) return "Sin fecha";
  const d = new Date(due_at);
  const days = ["dom","lun","mar","mié","jue","vie","sáb"];
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

  if (dueType === "today") {
    return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  if (dueType === "overdue") {
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const diff = Math.floor((todayStart.getTime() - d.getTime()) / 86400000);
    if (diff === 1) return "Ayer";
    return `Hace ${diff} días`;
  }
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function rawItemToTask(raw: RawItem): OrionTask {
  const dueType = classifyDueType(raw.due_at, raw.status);
  return {
    id: raw.id as unknown as number, // keep string id disguised as number for component compat
    title: raw.title,
    due: formatDue(raw.due_at, dueType),
    dueType,
    urgent: raw.priority === "urgent" || raw.priority === "high",
    done: raw.status === "completed",
  };
}

function rawItemToCommitment(raw: RawItem): OrionCommitment {
  return {
    id: raw.id as unknown as number,
    title: raw.title,
    due: formatDue(raw.due_at, classifyDueType(raw.due_at, raw.status)),
    direction: raw.direction === "owed" ? "they" : "owe",
    contact: raw.counterpart_id ?? "contacto",
    snoozes: raw.snooze_count,
  };
}

/** Build a 7-day Mon-based week array from last_completed date */
function buildWeekDots(last_completed: string | null): (boolean | null)[] {
  const today    = new Date();
  const todayDay = today.getDay(); // 0=Sun
  const monOffset = todayDay === 0 ? 6 : todayDay - 1; // days since last Monday

  return Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - monOffset + i);
    dayDate.setHours(0, 0, 0, 0);

    if (dayDate > today) return null; // future
    if (!last_completed) return false;

    const lc = new Date(last_completed);
    lc.setHours(0, 0, 0, 0);
    // Simple approximation: mark done only if last_completed matches this day
    return lc.getTime() === dayDate.getTime();
  });
}

function rawHabitToOrion(raw: RawHabit): OrionHabit {
  return {
    id: raw.id as unknown as number,
    name: raw.title,
    streak: raw.streak_current,
    week: buildWeekDots(raw.last_completed),
  };
}

// ── Date helpers ───────────────────────────────────────────────────────────

const DAYS_ES   = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const MONTHS_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

const TABS: { key: TabKey; label: string }[] = [
  { key: "tareas",      label: "Tareas"      },
  { key: "compromisos", label: "Compromisos" },
  { key: "habitos",     label: "Hábitos"     },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function OrionPage() {
  const today = useMemo(() => new Date(), []);

  // Data state
  const [tasks,       setTasks]       = useState<OrionTask[]>([]);
  const [commitments, setCommitments] = useState<OrionCommitment[]>([]);
  const [habits,      setHabits]      = useState<OrionHabit[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  // UI state
  const [activeTab,  setActiveTab]  = useState<TabKey>("tareas");
  const [activeView, setActiveView] = useState<ViewKey>("today");
  const [doneIds,    setDoneIds]    = useState<Set<number>>(new Set());

  // ── Fetch ────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, habitsRes, commitmentsRes] = await Promise.all([
        fetch("/api/modules/remind/items?status=pending&limit=50",   { cache: "no-store" }),
        fetch("/api/modules/remind/habits",                           { cache: "no-store" }),
        fetch("/api/modules/remind/commitments",                      { cache: "no-store" }),
      ]);

      if (!itemsRes.ok) throw new Error(`items: ${itemsRes.status}`);

      const { items: rawItems }: { items: RawItem[] }    = await itemsRes.json();
      const rawHabits: { habits?: RawHabit[] }            = habitsRes.ok ? await habitsRes.json() : { habits: [] };
      const rawComm: { owe?: RawItem[]; owed?: RawItem[] } = commitmentsRes.ok ? await commitmentsRes.json() : {};

      // Split items: reminders go to tasks, commitments already come from /commitments
      const reminders = rawItems.filter((i) => i.item_type !== "commitment");
      setTasks(reminders.map(rawItemToTask));

      // Merge owe + owed commitments
      const allCommitments = [
        ...(rawComm.owe  ?? []).map(rawItemToCommitment),
        ...(rawComm.owed ?? []).map(rawItemToCommitment),
      ];
      setCommitments(allCommitments);

      setHabits((rawHabits.habits ?? []).map(rawHabitToOrion));

      // Pre-mark done items
      const doneSet = new Set(
        reminders.filter((i) => i.status === "completed").map((i) => i.id as unknown as number),
      );
      setDoneIds(doneSet);

    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar tareas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Toggle done (optimistic) ─────────────────────────────────────────

  async function toggleDone(id: number) {
    const strId = String(id);
    const wasAlreadyDone = doneIds.has(id);

    // Optimistic update
    setDoneIds((prev) => {
      const next = new Set(prev);
      wasAlreadyDone ? next.delete(id) : next.add(id);
      return next;
    });

    // Fire and forget — complete via PATCH
    if (!wasAlreadyDone) {
      await fetch(`/api/modules/remind/items/${strId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      }).catch(() => null);
    }
  }

  // ── Derived buckets ──────────────────────────────────────────────────

  const overdueTasks  = tasks.filter((t) => t.dueType === "overdue" && !doneIds.has(t.id));
  const todayTasks    = tasks.filter((t) => t.dueType === "today"   && !doneIds.has(t.id));
  const upcomingTasks = tasks.filter((t) => t.dueType === "future"  && !doneIds.has(t.id));
  const doneTasks     = tasks.filter((t) => doneIds.has(t.id));

  const iOweTasks   = commitments.filter((c) => c.direction === "owe");
  const theyOweTasks = commitments.filter((c) => c.direction === "they");

  const headerSub = [
    todayTasks.length   > 0 ? `${todayTasks.length} pendiente${todayTasks.length > 1 ? "s" : ""} hoy`          : null,
    overdueTasks.length > 0 ? `${overdueTasks.length} vencida${overdueTasks.length > 1 ? "s" : ""}`             : null,
    commitments.length  > 0 ? `${commitments.length} compromiso${commitments.length > 1 ? "s" : ""} activo${commitments.length > 1 ? "s" : ""}` : null,
  ].filter(Boolean).join(" · ");

  const dayName  = DAYS_ES[today.getDay()];
  const dayLabel = `${today.getDate()} de ${MONTHS_ES[today.getMonth()]}`;

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full overflow-hidden">

      {/* ══ LEFT PANEL ══ */}
      <aside
        className="flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ width: 256, borderRight: "1px solid var(--border)", background: "var(--card)" }}
      >
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 3 }}>Orion</div>
          <div style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase", opacity: 0.45 }}>Tus tareas · Zaelyn</div>
        </div>

        <OrionSummary
          activeView={activeView}
          overdueCount={overdueTasks.length}
          todayCount={todayTasks.length}
          upcomingCount={upcomingTasks.length}
          doneCount={doneTasks.length}
          commitmentCount={commitments.length}
          onViewChange={setActiveView}
        />

        <OrionQuickAdd />

        {/* Habits sidebar — show real data or skeleton */}
        {habits.length > 0
          ? <OrionHabitsSidebarReal habits={habits} />
          : <OrionHabitsSidebar />}

        {/* Aura reference */}
        <div style={{ margin: "0 16px 14px", background: "linear-gradient(135deg,rgba(59,130,246,.08),rgba(16,185,129,.05))", border: "1px solid rgba(59,130,246,.15)", borderRadius: 10, padding: "12px 14px", fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.5 }}>
          <strong style={{ color: "#60a5fa" }}>Tu Aura hoy:</strong> Resonante · violeta<br />
          Zaelyn ajustará el tono de los recordatorios.
        </div>

        <OrionScoreRing score={80} label="Muy confiable" description="12 de 15 compromisos cumplidos a tiempo este mes." />
      </aside>

      {/* ══ RIGHT CONTENT ══ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header
          className="flex-shrink-0 flex items-center justify-between"
          style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)", background: "var(--background)", backdropFilter: "blur(20px)", zIndex: 10 }}
        >
          <div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 300, letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 2 }}>
              {dayName.charAt(0).toUpperCase() + dayName.slice(1)},{" "}
              <em style={{ fontStyle: "italic", color: "#60a5fa" }}>{dayLabel}</em>
            </h1>
            <p style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", opacity: 0.55 }}>
              {loading ? "Cargando…" : (headerSub || "Todo al día ✓")}
            </p>
          </div>

          <div style={{ display: "flex", gap: 2, background: "var(--secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: 3 }}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{ padding: "5px 14px", borderRadius: 6, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "inherit", background: activeTab === tab.key ? "#3b82f6" : "transparent", color: activeTab === tab.key ? "#fff" : "var(--muted-foreground)", transition: "all .15s" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: "24px 28px" }}>

          {/* Error */}
          {!loading && error && (
            <div style={{ padding: 20, borderRadius: 10, border: "1px solid rgba(239,68,68,.2)", background: "rgba(239,68,68,.05)", color: "#ef4444", fontSize: 13, marginBottom: 20 }}>
              {error}{" "}
              <button onClick={load} style={{ textDecoration: "underline", cursor: "pointer", background: "none", border: "none", color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}>
                Reintentar
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div style={{ textAlign: "center", padding: 48, color: "var(--muted-foreground)", opacity: 0.5, fontSize: 13 }}>
              Cargando tus tareas…
            </div>
          )}

          {/* ── TAREAS tab ── */}
          {!loading && activeTab === "tareas" && (
            <>
              {overdueTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel(ORION_RED)}>Vencidas ({overdueTasks.length})<span style={{ flex: 1, height: 1, background: `${ORION_RED}30` }} /></div>
                  {overdueTasks.map((t) => <OrionTaskCard key={String(t.id)} task={t} isDone={doneIds.has(t.id)} onToggle={toggleDone} />)}
                </section>
              )}
              {todayTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel(ORION_AMBER)}>Hoy ({todayTasks.length})<span style={{ flex: 1, height: 1, background: `${ORION_AMBER}30` }} /></div>
                  {todayTasks.map((t) => <OrionTaskCard key={String(t.id)} task={t} isDone={doneIds.has(t.id)} onToggle={toggleDone} />)}
                </section>
              )}
              {upcomingTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel()}>Próximas<span style={{ flex: 1, height: 1, background: "var(--border)" }} /></div>
                  {upcomingTasks.map((t) => <OrionTaskCard key={String(t.id)} task={t} isDone={doneIds.has(t.id)} onToggle={toggleDone} />)}
                </section>
              )}
              {doneTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel(ORION_GREEN)}>Completadas ({doneTasks.length})<span style={{ flex: 1, height: 1, background: `${ORION_GREEN}25` }} /></div>
                  {doneTasks.map((t) => <OrionTaskCard key={String(t.id)} task={t} isDone={true} onToggle={toggleDone} />)}
                </section>
              )}
              {!loading && overdueTasks.length === 0 && todayTasks.length === 0 && doneTasks.length === 0 && upcomingTasks.length === 0 && (
                <EmptyState text="Todo al día — sin pendientes" />
              )}
            </>
          )}

          {/* ── COMPROMISOS tab ── */}
          {!loading && activeTab === "compromisos" && (
            <>
              {iOweTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel()}>Yo debo ({iOweTasks.length})<span style={{ flex: 1, height: 1, background: "var(--border)" }} /></div>
                  {iOweTasks.map((c) => <OrionCommitmentCard key={String(c.id)} commitment={c} />)}
                </section>
              )}
              {theyOweTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel()}>Me deben ({theyOweTasks.length})<span style={{ flex: 1, height: 1, background: "var(--border)" }} /></div>
                  {theyOweTasks.map((c) => <OrionCommitmentCard key={String(c.id)} commitment={c} />)}
                </section>
              )}
              {commitments.length === 0 && <EmptyState text="Sin compromisos activos" />}
            </>
          )}

          {/* ── HÁBITOS tab ── */}
          {!loading && activeTab === "habitos" && <OrionHabitsMain />}
        </div>
      </div>
    </div>
  );
}

// ── Inline real habits sidebar ─────────────────────────────────────────────

function OrionHabitsSidebarReal({ habits }: { habits: OrionHabit[] }) {
  const WEEK_DAYS = ["L","M","X","J","V","S","D"];
  const GREEN = "#10b981";

  return (
    <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 12, opacity: 0.55 }}>
        Hábitos — esta semana
      </div>
      {habits.map((h) => (
        <div key={String(h.id)} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--foreground)" }}>{h.name}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: GREEN }}>🔥 {h.streak}d</span>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            {h.week.map((done, i) => (
              <div key={i} title={WEEK_DAYS[i]} style={{ width: 10, height: 10, borderRadius: 3, background: done === true ? GREEN : "transparent", border: `${done === true ? 1 : 1}px solid ${done === true ? GREEN : "var(--border)"}`, opacity: done === null ? 0.3 : 1 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function sectionLabel(color?: string): React.CSSProperties {
  return { fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: color ?? "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 12, display: "flex", alignItems: "center", gap: 10, opacity: color ? 1 : 0.5 };
}

function EmptyState({ text }: { text: string }) {
  return <div style={{ textAlign: "center", padding: 28, color: "var(--muted-foreground)", fontSize: 12, fontStyle: "italic", fontFamily: "var(--font-serif)", opacity: 0.5 }}>{text}</div>;
}

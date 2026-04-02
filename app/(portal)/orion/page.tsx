"use client";

import { useMemo, useState } from "react";

import OrionSummary         from "@/components/orion/OrionSummary";
import OrionQuickAdd        from "@/components/orion/OrionQuickAdd";
import OrionHabitsSidebar   from "@/components/orion/OrionHabitsSidebar";
import OrionScoreRing       from "@/components/orion/OrionScoreRing";
import OrionTaskCard        from "@/components/orion/OrionTaskCard";
import OrionCommitmentCard  from "@/components/orion/OrionCommitmentCard";
import OrionHabitsMain      from "@/components/orion/OrionHabitsMain";
import {
  MOCK_TASKS,
  MOCK_COMMITMENTS,
  ORION_RED,
  ORION_AMBER,
  ORION_GREEN,
  type TabKey,
  type ViewKey,
} from "@/components/orion/orionData";

// ── Date helpers ───────────────────────────────────────────────────────────

const DAYS_ES   = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const MONTHS_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

// ── Page ───────────────────────────────────────────────────────────────────

export default function OrionPage() {
  const today = useMemo(() => new Date(), []);

  const [activeTab,  setActiveTab]  = useState<TabKey>("tareas");
  const [activeView, setActiveView] = useState<ViewKey>("today");
  const [doneIds,    setDoneIds]    = useState<Set<number>>(
    () => new Set(MOCK_TASKS.filter((t) => t.done).map((t) => t.id)),
  );

  function toggleDone(id: number) {
    setDoneIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Derived task buckets
  const overdueTasks  = MOCK_TASKS.filter((t) => t.dueType === "overdue" && !doneIds.has(t.id));
  const todayTasks    = MOCK_TASKS.filter((t) => t.dueType === "today"   && !doneIds.has(t.id));
  const upcomingTasks = MOCK_TASKS.filter((t) => t.dueType === "future");
  const doneTasks     = MOCK_TASKS.filter((t) => doneIds.has(t.id));

  const iOweTasks  = MOCK_COMMITMENTS.filter((c) => c.direction === "owe");
  const theyOweTasks = MOCK_COMMITMENTS.filter((c) => c.direction === "they");

  // Header sub-line
  const headerSub = [
    todayTasks.length  > 0 ? `${todayTasks.length} pendiente${todayTasks.length > 1 ? "s" : ""} hoy`            : null,
    overdueTasks.length > 0 ? `${overdueTasks.length} vencida${overdueTasks.length > 1 ? "s" : ""}`              : null,
    MOCK_COMMITMENTS.length > 0 ? `${MOCK_COMMITMENTS.length} compromiso${MOCK_COMMITMENTS.length > 1 ? "s" : ""} activo${MOCK_COMMITMENTS.length > 1 ? "s" : ""}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const dayName  = DAYS_ES[today.getDay()];
  const dayLabel = `${today.getDate()} de ${MONTHS_ES[today.getMonth()]}`;

  const TABS: { key: TabKey; label: string }[] = [
    { key: "tareas",      label: "Tareas"       },
    { key: "compromisos", label: "Compromisos"  },
    { key: "habitos",     label: "Hábitos"      },
  ];

  return (
    <div className="flex h-full overflow-hidden">

      {/* ══════════════════════════════════════════════
          LEFT PANEL
      ══════════════════════════════════════════════ */}
      <aside
        className="flex-shrink-0 flex flex-col overflow-y-auto"
        style={{
          width: 256,
          borderRight: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        {/* Module header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 17, fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--foreground)", marginBottom: 3,
            }}
          >
            Orion
          </div>
          <div
            style={{
              fontSize: 9, color: "var(--muted-foreground)",
              fontFamily: "var(--font-mono)", letterSpacing: ".1em",
              textTransform: "uppercase", opacity: 0.45,
            }}
          >
            Tus tareas · Zaelyn
          </div>
        </div>

        {/* Smart summary */}
        <OrionSummary
          activeView={activeView}
          overdueCount={overdueTasks.length}
          todayCount={todayTasks.length}
          upcomingCount={upcomingTasks.length}
          doneCount={doneTasks.length}
          commitmentCount={MOCK_COMMITMENTS.length}
          onViewChange={setActiveView}
        />

        {/* Quick add */}
        <OrionQuickAdd />

        {/* Habit tracker */}
        <OrionHabitsSidebar />

        {/* Aura reference */}
        <div
          style={{
            margin: "0 16px 14px",
            background: "linear-gradient(135deg,rgba(59,130,246,.08),rgba(16,185,129,.05))",
            border: "1px solid rgba(59,130,246,.15)",
            borderRadius: 10, padding: "12px 14px",
            fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#60a5fa" }}>Tu Aura hoy:</strong>{" "}
          Resonante · violeta
          <br />
          Zaelyn ajustará el tono de los recordatorios.
        </div>

        {/* Score ring */}
        <OrionScoreRing
          score={80}
          label="Muy confiable"
          description="12 de 15 compromisos cumplidos a tiempo este mes."
        />
      </aside>

      {/* ══════════════════════════════════════════════
          RIGHT CONTENT
      ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Sticky header */}
        <header
          className="flex-shrink-0 flex items-center justify-between"
          style={{
            padding: "16px 28px",
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
            backdropFilter: "blur(20px)",
            zIndex: 10,
          }}
        >
          {/* Title */}
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 18, fontWeight: 300,
                letterSpacing: "-0.02em", color: "var(--foreground)",
                marginBottom: 2,
              }}
            >
              {dayName.charAt(0).toUpperCase() + dayName.slice(1)},{" "}
              <em style={{ fontStyle: "italic", color: "#60a5fa" }}>{dayLabel}</em>
            </h1>
            <p
              style={{
                fontSize: 11, color: "var(--muted-foreground)",
                fontFamily: "var(--font-mono)", opacity: 0.55,
              }}
            >
              {headerSub || "Todo al día ✓"}
            </p>
          </div>

          {/* Tab pills */}
          <div
            style={{
              display: "flex", gap: 2,
              background: "var(--secondary)",
              border: "1px solid var(--border)",
              borderRadius: 8, padding: 3,
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "5px 14px", borderRadius: 6,
                    fontSize: 12, border: "none", cursor: "pointer",
                    fontFamily: "inherit",
                    background: active ? "#3b82f6" : "transparent",
                    color: active ? "#fff" : "var(--muted-foreground)",
                    transition: "all .15s",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: "24px 28px" }}>

          {/* ── TAREAS tab ── */}
          {activeTab === "tareas" && (
            <>
              {/* Vencidas */}
              {overdueTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel(ORION_RED)}>
                    Vencidas ({overdueTasks.length})
                    <span style={{ flex: 1, height: 1, background: `${ORION_RED}30` }} />
                  </div>
                  {overdueTasks.map((t) => (
                    <OrionTaskCard
                      key={t.id} task={t}
                      isDone={doneIds.has(t.id)}
                      onToggle={toggleDone}
                    />
                  ))}
                </section>
              )}

              {/* Hoy */}
              {todayTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel(ORION_AMBER)}>
                    Hoy ({todayTasks.length})
                    <span style={{ flex: 1, height: 1, background: `${ORION_AMBER}30` }} />
                  </div>
                  {todayTasks.map((t) => (
                    <OrionTaskCard
                      key={t.id} task={t}
                      isDone={doneIds.has(t.id)}
                      onToggle={toggleDone}
                    />
                  ))}
                </section>
              )}

              {/* Próximas */}
              {upcomingTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel()}>
                    Próximas
                    <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  </div>
                  {upcomingTasks.map((t) => (
                    <OrionTaskCard
                      key={t.id} task={t}
                      isDone={doneIds.has(t.id)}
                      onToggle={toggleDone}
                    />
                  ))}
                </section>
              )}

              {/* Completadas */}
              {doneTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel(ORION_GREEN)}>
                    Completadas ({doneTasks.length})
                    <span style={{ flex: 1, height: 1, background: `${ORION_GREEN}25` }} />
                  </div>
                  {doneTasks.map((t) => (
                    <OrionTaskCard
                      key={t.id} task={t}
                      isDone={true}
                      onToggle={toggleDone}
                    />
                  ))}
                </section>
              )}

              {overdueTasks.length === 0 && todayTasks.length === 0 && doneTasks.length === 0 && (
                <EmptyState text="Todo al día — sin pendientes" />
              )}
            </>
          )}

          {/* ── COMPROMISOS tab ── */}
          {activeTab === "compromisos" && (
            <>
              {iOweTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel()}>
                    Yo debo ({iOweTasks.length})
                    <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  </div>
                  {iOweTasks.map((c) => <OrionCommitmentCard key={c.id} commitment={c} />)}
                </section>
              )}

              {theyOweTasks.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={sectionLabel()}>
                    Me deben ({theyOweTasks.length})
                    <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  </div>
                  {theyOweTasks.map((c) => <OrionCommitmentCard key={c.id} commitment={c} />)}
                </section>
              )}

              {MOCK_COMMITMENTS.length === 0 && (
                <EmptyState text="Sin compromisos activos" />
              )}
            </>
          )}

          {/* ── HÁBITOS tab ── */}
          {activeTab === "habitos" && <OrionHabitsMain />}

        </div>
      </div>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────

function sectionLabel(color?: string): React.CSSProperties {
  return {
    fontSize: 9, fontWeight: 500, letterSpacing: ".12em",
    textTransform: "uppercase",
    color: color ?? "var(--muted-foreground)",
    fontFamily: "var(--font-mono)",
    marginBottom: 12,
    display: "flex", alignItems: "center", gap: 10,
    opacity: color ? 1 : 0.5,
  };
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        textAlign: "center", padding: 28,
        color: "var(--muted-foreground)", fontSize: 12,
        fontStyle: "italic", fontFamily: "var(--font-serif)", opacity: 0.5,
      }}
    >
      {text}
    </div>
  );
}

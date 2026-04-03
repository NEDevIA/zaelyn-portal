"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import {
  healthColor, healthEmoji, momentumColor, momentumLabel, momentumArrow,
} from "@/components/polaris/PolarisHealthRing";

const PolarisHealthRing = dynamic(
  () => import("@/components/polaris/PolarisHealthRing").then((m) => ({ default: m.PolarisHealthRing })),
  { ssr: false }
);
const PolarisSparkline = dynamic(
  () => import("@/components/polaris/PolarisSparkline").then((m) => ({ default: m.PolarisSparkline })),
  { ssr: false }
);

// ── Types ─────────────────────────────────────────────────────────────────

type GoalStatus = "active" | "paused" | "completed" | "abandoned";
type Momentum   = "accelerating" | "stable" | "slowing" | "stalled";
type TabKey     = "horizonte" | "checkin" | "conflicts";
type FilterKey  = "all" | GoalStatus;

interface PolarisGoal {
  id: string;
  title: string;
  goal_type: string;
  domain: string;
  status: GoalStatus;
  progress: number;
  health_score: number;
  momentum: Momentum;
  target_date: string | null;
  tags: string[];
  created_at: string;
  // detail-only
  description?: string | null;
  metric?: string | null;
  why_now?: string | null;
  why_benefit?: string | null;
  why_cost?: string | null;
  obituary?: string | null;
  milestones?: Milestone[];
  // enriched after health call
  signal_actions?: number;
  signal_mood?: number;
  signal_pace?: number;
  health_history?: number[];
}

interface Milestone {
  id: string;
  title: string;
  completed_at: string | null;
  target_date: string | null;
  is_auto: boolean;
  order_index: number;
}

interface PolarisConflict {
  id: string;
  description: string;
  goal_ids: string[];
  suggestion?: string;
  conflict_type?: string;
}

interface CheckinQuestion {
  goal_id?: string;
  question: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function daysLeft(d: string | null): number | null {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("es-MX", { month: "short", day: "numeric", year: "numeric" });
}

function getQuarter(): string {
  const now = new Date();
  return `Q${Math.ceil((now.getMonth() + 1) / 3)} · ${now.getFullYear()}`;
}

function getWeekLabel(): string {
  const now = new Date();
  const wk = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 604800000);
  return `Semana ${wk} · ${now.getFullYear()}`;
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function PolarisPage() {
  // ── Data ────────────────────────────────────────────────────────────────
  const [goals,     setGoals]     = useState<PolarisGoal[]>([]);
  const [conflicts, setConflicts] = useState<PolarisConflict[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  // ── UI ──────────────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState<TabKey>("horizonte");
  const [filter,       setFilter]       = useState<FilterKey>("all");
  const [isLight,      setIsLight]      = useState(false);

  // Detail panel
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [detailGoal,    setDetailGoal]    = useState<PolarisGoal | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Check-in
  const [checkinQuestions, setCheckinQuestions] = useState<CheckinQuestion[]>([]);
  const [checkinAnswers,   setCheckinAnswers]   = useState<Record<string, string>>({});
  const [checkinScores,    setCheckinScores]    = useState<Record<string, number>>({});
  const [checkinLoading,   setCheckinLoading]   = useState(false);
  const [checkinSent,      setCheckinSent]      = useState(false);

  // New goal
  const [showNewGoal,  setShowNewGoal]  = useState(false);
  const [newTitle,     setNewTitle]     = useState("");
  const [newWhy,       setNewWhy]       = useState("");
  const [creating,     setCreating]     = useState(false);

  // ── Load goals ───────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [activeRes, completedRes, conflictsRes] = await Promise.all([
        fetch("/api/modules/goals/goals", { cache: "no-store" }),
        fetch("/api/modules/goals/goals?status=completed", { cache: "no-store" }),
        fetch("/api/modules/goals/goals/conflicts", { cache: "no-store" }),
      ]);
      if (!activeRes.ok) throw new Error(`goals: ${activeRes.status}`);
      const { goals: active = [] }    = await activeRes.json() as { goals: PolarisGoal[] };
      const { goals: completed = [] } = completedRes.ok
        ? await completedRes.json() as { goals: PolarisGoal[] }
        : { goals: [] };
      const { conflicts: cfls = [] } = conflictsRes.ok
        ? await conflictsRes.json() as { conflicts: PolarisConflict[] }
        : { conflicts: [] };

      setGoals([...active, ...completed]);
      setConflicts(cfls);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar Polaris");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Open detail ──────────────────────────────────────────────────────────

  const openDetail = useCallback(async (id: string) => {
    setSelectedId(id);
    setDetailGoal(goals.find((g) => g.id === id) ?? null);
    setDetailLoading(true);
    try {
      const [detailRes, healthRes] = await Promise.all([
        fetch(`/api/modules/goals/goals/${id}`, { cache: "no-store" }),
        fetch(`/api/modules/goals/goals/${id}/health?limit=7`, { cache: "no-store" }),
      ]);
      let enriched: PolarisGoal | null = null;
      if (detailRes.ok) {
        const d = await detailRes.json() as { goal: PolarisGoal };
        enriched = d.goal;
      }
      if (healthRes.ok) {
        const h = await healthRes.json() as {
          history: Array<{
            health_score: number;
            signal_actions?: number;
            signal_mood?: number;
            signal_pace?: number;
          }>;
        };
        const hist = (h.history ?? []).slice(0, 7).reverse();
        if (enriched && hist.length) {
          enriched.health_history = hist.map((r) => r.health_score);
          const last = hist[hist.length - 1];
          enriched.signal_actions = last.signal_actions ?? enriched.signal_actions;
          enriched.signal_mood    = last.signal_mood    ?? enriched.signal_mood;
          enriched.signal_pace    = last.signal_pace    ?? enriched.signal_pace;
        }
      }
      if (enriched) {
        setDetailGoal(enriched);
        setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...enriched! } : g)));
      }
    } catch { /* keep partial */ }
    finally { setDetailLoading(false); }
  }, [goals]);

  // ── Load check-in questions ──────────────────────────────────────────────

  const loadCheckin = useCallback(async () => {
    if (checkinQuestions.length) return;
    setCheckinLoading(true);
    try {
      const res = await fetch("/api/modules/goals/checkin", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json() as { checkin?: { questions?: CheckinQuestion[] } };
        setCheckinQuestions(data.checkin?.questions ?? []);
      }
    } catch { /* ignore */ }
    finally { setCheckinLoading(false); }
  }, [checkinQuestions.length]);

  useEffect(() => {
    if (activeTab === "checkin") loadCheckin();
  }, [activeTab, loadCheckin]);

  // ── Submit check-in ──────────────────────────────────────────────────────

  async function submitCheckin() {
    const active = goals.filter((g) => g.status === "active");
    const answers = active.map((g, i) => ({
      goal_id: g.id,
      qualitative: checkinAnswers[g.id] ?? "",
      score: checkinScores[g.id] ?? null,
      question: checkinQuestions[i]?.question ?? "",
    }));
    try {
      await fetch("/api/modules/goals/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      setCheckinSent(true);
    } catch { /* ignore */ }
  }

  // ── Create new goal ──────────────────────────────────────────────────────

  async function createGoal() {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/modules/goals/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), whyNow: newWhy.trim() || undefined }),
      });
      if (res.ok) {
        setShowNewGoal(false);
        setNewTitle(""); setNewWhy("");
        await load();
      }
    } catch { /* ignore */ }
    finally { setCreating(false); }
  }

  // ── Stats ────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const active = goals.filter((g) => g.status === "active");
    const avgHealth = active.length
      ? Math.round(active.reduce((s, g) => s + g.health_score, 0) / active.length)
      : 0;
    const momCounts = { accelerating: 0, stable: 0, slowing: 0, stalled: 0 };
    active.forEach((g) => { if (g.momentum in momCounts) momCounts[g.momentum as keyof typeof momCounts]++; });
    const topMom = (Object.entries(momCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "stable") as Momentum;
    const domains: Record<string, number> = {};
    goals.forEach((g) => { if (g.domain) domains[g.domain] = (domains[g.domain] ?? 0) + 1; });
    return { avgHealth, topMom, domains };
  }, [goals]);

  const counts = useMemo(() => ({
    all:       goals.length,
    active:    goals.filter((g) => g.status === "active").length,
    paused:    goals.filter((g) => g.status === "paused").length,
    completed: goals.filter((g) => g.status === "completed").length,
  }), [goals]);

  const northStar = useMemo(() =>
    goals.filter((g) => g.status === "active").sort((a, b) => b.health_score - a.health_score)[0] ?? null,
    [goals]);

  const filteredGoals = useMemo(() =>
    filter === "all" ? goals : goals.filter((g) => g.status === filter),
    [goals, filter]);

  // ── Styles ───────────────────────────────────────────────────────────────

  const bg   = isLight ? "#f9f8f4" : "#07080f";
  const bg2  = isLight ? "#f3f1eb" : "#0b0d1a";
  const bg3  = isLight ? "#eae8e0" : "#10121f";
  const surf = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)";
  const surf2= isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)";
  const bdr  = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)";
  const bdr2 = isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.14)";
  const txt  = isLight ? "#18172a" : "#e8e6f2";
  const txt2 = isLight ? "#6b697f" : "#6b697f";
  const txt3 = isLight ? "#b8b6cc" : "#323048";
  const ACCENT = "#f9a8d4";
  const EASE = "cubic-bezier(0.16,1,0.3,1)";

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", background: bg, color: txt, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 }}>

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside style={{ width: 248, background: bg2, borderRight: `1px solid ${bdr}`, display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>

        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${bdr}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 400, letterSpacing: "-0.02em", color: txt }}>
              P<span style={{ color: ACCENT, fontStyle: "italic" }}>olaris</span>
            </div>
            <div style={{ fontSize: 9, color: txt3, fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 3 }}>
              Tus metas · Zaelyn
            </div>
          </div>
          <button
            onClick={() => setIsLight(!isLight)}
            style={{ width: 28, height: 28, borderRadius: 7, background: surf, border: `1px solid ${bdr}`, color: txt2, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            {isLight ? "🌙" : "☀️"}
          </button>
        </div>

        {/* North Star */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${bdr}`, flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".12em", textTransform: "uppercase", color: txt3, marginBottom: 8 }}>★ Norte</div>
          <div
            onClick={() => northStar && openDetail(northStar.id)}
            style={{ background: surf, border: `1px solid ${bdr}`, borderRadius: 10, padding: "11px 12px", cursor: northStar ? "pointer" : "default", position: "relative", overflow: "hidden" }}
          >
            <span style={{ position: "absolute", right: 10, top: 8, fontSize: 20, color: ACCENT, opacity: .15 }}>★</span>
            {northStar ? (
              <>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, fontWeight: 400, color: txt, lineHeight: 1.3, paddingRight: 24 }}>{northStar.title}</div>
                <div style={{ fontSize: 10, color: txt3, fontFamily: "'JetBrains Mono', monospace", marginTop: 4, textTransform: "uppercase", letterSpacing: ".08em" }}>{northStar.domain} · {northStar.goal_type}</div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: txt3, fontStyle: "italic" }}>Sin meta norte definida</div>
            )}
          </div>
        </div>

        {/* Status filters */}
        <div style={{ padding: "14px 12px 6px", flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8, padding: "0 8px" }}>Estado</div>
          {([
            { key: "all" as const,       label: "Todas",      color: "#6ee7b7", count: counts.all },
            { key: "active" as const,    label: "Activas",    color: "#34d399", count: counts.active },
            { key: "paused" as const,    label: "Pausadas",   color: "#fcd34d", count: counts.paused },
            { key: "completed" as const, label: "Completadas",color: txt3,      count: counts.completed },
          ]).map(({ key, label, color, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                display: "flex", alignItems: "center", gap: 9, padding: "6px 8px", borderRadius: 7,
                cursor: "pointer", background: filter === key ? surf2 : "none",
                border: "none", color: filter === key ? txt : txt2,
                fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, width: "100%", textAlign: "left",
                borderLeft: filter === key ? `2px solid ${color}` : "2px solid transparent", transition: "all .15s",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: txt3 }}>{count}</span>
            </button>
          ))}
        </div>

        <div style={{ height: 1, background: bdr, margin: "8px 20px" }} />

        {/* Domain breakdown */}
        <div style={{ padding: "10px 20px 6px", flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 9 }}>Por dominio</div>
          {Object.entries(stats.domains).slice(0, 4).map(([domain, count]) => (
            <div key={domain} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: txt2, width: 60, flexShrink: 0, textTransform: "capitalize" }}>{domain}</span>
              <div style={{ flex: 1, height: 3, background: surf2, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, background: ACCENT, width: `${(count / Math.max(goals.length, 1)) * 100}%`, transition: `width .6s ${EASE}` }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: txt3, width: 18, textAlign: "right" }}>{count}</span>
            </div>
          ))}
          {Object.keys(stats.domains).length === 0 && (
            <div style={{ fontSize: 11, color: txt3, fontStyle: "italic" }}>Sin metas aún</div>
          )}
        </div>

        {/* Global health ring */}
        <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, borderTop: `1px solid ${bdr}`, marginTop: "auto", flexShrink: 0 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 500, position: "relative", color: healthColor(stats.avgHealth, isLight) }}>
            <PolarisHealthRing score={stats.avgHealth} size={48} light={isLight} />
            <span style={{ position: "relative", zIndex: 1 }}>{stats.avgHealth}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: txt2, marginBottom: 2 }}>Salud global de metas</div>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: momentumColor(stats.topMom, isLight), flexShrink: 0 }} />
              <span style={{ color: momentumColor(stats.topMom, isLight) }}>{momentumLabel(stats.topMom)}</span>
            </div>
          </div>
        </div>

        {/* New goal button */}
        <button
          onClick={() => setShowNewGoal(true)}
          style={{ margin: "8px 12px 12px", padding: 9, borderRadius: 8, border: `1px dashed ${bdr2}`, background: "none", color: "#6ee7b7", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
        >
          + Nueva meta
        </button>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header / tabs */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 52, borderBottom: `1px solid ${bdr}`, flexShrink: 0, background: bg2 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {([
              { key: "horizonte"  as const, label: "◎ Horizonte" },
              { key: "checkin"    as const, label: "✦ Check-in" },
              { key: "conflicts"  as const, label: `⚡ Conflictos${conflicts.length ? ` ${conflicts.length}` : ""}` },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: "6px 13px", borderRadius: 7, border: "none",
                  background: activeTab === key ? "rgba(249,168,212,.08)" : "none",
                  color: activeTab === key ? ACCENT : txt2,
                  fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13,
                  fontWeight: activeTab === key ? 500 : 400, cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: txt2, padding: "4px 10px", borderRadius: 6, border: `1px solid ${bdr}`, background: surf }}>
            {getQuarter()}
          </div>
        </header>

        {/* Error banner */}
        {!loading && error && (
          <div style={{ padding: "10px 24px", fontSize: 12, color: "#94A3B8", background: "rgba(148,163,184,0.06)", borderBottom: `1px solid rgba(148,163,184,0.12)`, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚠️</span>
            <span>Polaris está despertando — puede tardar unos segundos.</span>
            <button onClick={load} style={{ textDecoration: "underline", cursor: "pointer", background: "none", border: "none", color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}>Reintentar</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: txt3, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
            <span>◎</span><span>Cargando metas…</span>
          </div>
        )}

        {/* ── HORIZONTE ────────────────────────────────────────────────── */}
        {!loading && activeTab === "horizonte" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
            {filteredGoals.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: txt3, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: "center" }}>
                <div style={{ fontSize: 48, lineHeight: 1 }}>◎</div>
                <div>Sin metas en esta vista</div>
                {filter === "all" && (
                  <div style={{ marginTop: 8, fontSize: 11, maxWidth: 280, lineHeight: 1.6 }}>
                    Dile a Zaelyn "quiero lograr..." por Telegram y Polaris guardará tu meta aquí.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {filteredGoals.map((g) => (
                  <GoalCard key={g.id} goal={g} isLight={isLight} selected={selectedId === g.id} onClick={() => openDetail(g.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CHECK-IN ─────────────────────────────────────────────────── */}
        {!loading && activeTab === "checkin" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: txt3, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>{getWeekLabel()}</div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 300, color: txt, lineHeight: 1.2, marginBottom: 6 }}>Revisión semanal</div>
              <div style={{ fontSize: 13, color: txt2, lineHeight: 1.5 }}>Zaelyn preparó una pregunta para cada meta activa.<br />Responder toma 5 minutos — y alinea tu semana.</div>
            </div>

            {checkinLoading && (
              <div style={{ color: txt3, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>Generando preguntas con IA…</div>
            )}

            {checkinSent && (
              <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(110,231,183,.08)", border: "1px solid rgba(110,231,183,.2)", color: "#6ee7b7", fontSize: 13 }}>
                ✓ Revisión guardada. Zaelyn actualizará los health scores.
              </div>
            )}

            {!checkinSent && goals.filter((g) => g.status === "active").map((g, i) => {
              const q = checkinQuestions[i]?.question ?? "¿Cómo fue tu semana en relación a esta meta?";
              const hc = healthColor(g.health_score, isLight);
              return (
                <div key={g.id} style={{ background: bg2, border: `1px solid ${bdr}`, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${bdr}` }}>
                    <span style={{ fontSize: 20 }}>{healthEmoji(g.health_score)}</span>
                    <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 15, fontWeight: 400, color: txt, flex: 1 }}>{g.title}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: hc }}>{g.health_score}</span>
                  </div>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${bdr}` }}>
                    <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: txt3, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Zaelyn pregunta</div>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13.5, color: txt, lineHeight: 1.55, marginBottom: 10, fontWeight: 300 }}>{q}</div>
                    <textarea
                      value={checkinAnswers[g.id] ?? ""}
                      onChange={(e) => setCheckinAnswers((p) => ({ ...p, [g.id]: e.target.value }))}
                      placeholder="Escribe tu reflexión..."
                      rows={3}
                      style={{ width: "100%", background: surf, border: `1px solid ${bdr}`, borderRadius: 8, padding: "10px 12px", color: txt, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, lineHeight: 1.5, resize: "none", outline: "none" }}
                    />
                  </div>
                  <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11, color: txt2, flex: 1 }}>¿Cómo te sientes con el avance? (1–5)</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setCheckinScores((p) => ({ ...p, [g.id]: n }))}
                          style={{
                            width: 32, height: 32, borderRadius: "50%",
                            border: `1px solid ${(checkinScores[g.id] ?? 0) >= n ? "#6ee7b7" : bdr}`,
                            background: (checkinScores[g.id] ?? 0) >= n ? "#6ee7b7" : surf,
                            color: (checkinScores[g.id] ?? 0) >= n ? "#07080f" : txt2,
                            fontSize: 13, fontWeight: 500, cursor: "pointer",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {!checkinSent && goals.filter((g) => g.status === "active").length > 0 && (
              <button
                onClick={submitCheckin}
                style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: "#6ee7b7", color: "#07080f", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}
              >
                Guardar revisión →
              </button>
            )}
          </div>
        )}

        {/* ── CONFLICTS ────────────────────────────────────────────────── */}
        {!loading && activeTab === "conflicts" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
            {conflicts.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 8, color: txt3, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: "center" }}>
                <div style={{ fontSize: 32 }}>✓</div>
                <div>Sin conflictos detectados entre metas activas</div>
              </div>
            ) : (
              conflicts.map((c) => {
                const involvedGoals = c.goal_ids.map((id) => goals.find((g) => g.id === id)).filter(Boolean) as PolarisGoal[];
                return (
                  <div key={c.id} style={{ background: bg2, border: "1px solid rgba(248,113,113,.2)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".12em", textTransform: "uppercase", color: "#f87171", marginBottom: 2 }}>⚡ Conflicto detectado</div>
                      <div style={{ fontSize: 13.5, color: txt, lineHeight: 1.55, fontFamily: "'Fraunces', Georgia, serif", fontWeight: 300 }}>{c.description}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {involvedGoals.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => openDetail(g.id)}
                          style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", color: "#f87171", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer" }}
                        >
                          {healthEmoji(g.health_score)} {g.title}
                        </button>
                      ))}
                    </div>
                    {c.suggestion && (
                      <div style={{ fontSize: 12, color: txt2, lineHeight: 1.5, fontStyle: "italic" }}>💡 {c.suggestion}</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* ── Detail Panel ─────────────────────────────────────────────────── */}
      <aside style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 400,
        background: bg2, borderLeft: `1px solid ${bdr}`,
        transform: selectedId ? "translateX(0)" : "translateX(100%)",
        transition: `transform .32s ${EASE}`, zIndex: 20,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {detailGoal && (
          <DetailPanel
            goal={detailGoal}
            loading={detailLoading}
            isLight={isLight}
            bg={bg} bg2={bg2} bg3={bg3} surf={surf} surf2={surf2} bdr={bdr} bdr2={bdr2}
            txt={txt} txt2={txt2} txt3={txt3}
            onClose={() => { setSelectedId(null); setDetailGoal(null); }}
            onCheckin={() => setActiveTab("checkin")}
            onPause={async () => {
              if (!detailGoal) return;
              await fetch(`/api/modules/goals/goals/${detailGoal.id}/pause`, { method: "POST" });
              await load();
              setSelectedId(null); setDetailGoal(null);
            }}
          />
        )}
      </aside>

      {/* ── New Goal Modal ────────────────────────────────────────────────── */}
      {showNewGoal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowNewGoal(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ background: bg2, border: `1px solid ${bdr}`, borderRadius: 16, padding: 28, width: 400, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 300, color: txt }}>Nueva meta</div>
            <div>
              <div style={{ fontSize: 11, color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".08em" }}>¿Qué quieres lograr?</div>
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createGoal()}
                placeholder="Ej: Lanzar mi producto en beta…"
                style={{ width: "100%", background: surf, border: `1px solid ${bdr}`, borderRadius: 8, padding: "10px 12px", color: txt, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, outline: "none" }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".08em" }}>¿Por qué ahora? (opcional)</div>
              <textarea
                value={newWhy}
                onChange={(e) => setNewWhy(e.target.value)}
                placeholder="El contexto que le da urgencia…"
                rows={3}
                style={{ width: "100%", background: surf, border: `1px solid ${bdr}`, borderRadius: 8, padding: "10px 12px", color: txt, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, resize: "none", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowNewGoal(false)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: `1px solid ${bdr}`, background: "none", color: txt2, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
              <button
                onClick={createGoal}
                disabled={creating || !newTitle.trim()}
                style={{ flex: 2, padding: 9, borderRadius: 8, border: "none", background: ACCENT, color: "#07080f", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: creating || !newTitle.trim() ? .6 : 1 }}
              >
                {creating ? "Creando…" : "Crear meta →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Goal Card ─────────────────────────────────────────────────────────────

function GoalCard({ goal: g, isLight, selected, onClick }: {
  goal: PolarisGoal; isLight: boolean; selected: boolean; onClick: () => void;
}) {
  const hc = healthColor(g.health_score, isLight);
  const mc = momentumColor(g.momentum, isLight);
  const dl = daysLeft(g.target_date);
  const dlText = dl === null ? "" : dl > 0 ? `${dl}d restantes` : `venció hace ${Math.abs(dl)}d`;
  const opacity = g.status === "paused" ? 0.6 : g.status === "completed" ? 0.5 : 1;

  return (
    <div
      onClick={onClick}
      style={{
        background: isLight ? "#f3f1eb" : "#0b0d1a",
        border: `1px solid ${selected ? hc : (isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)")}`,
        borderRadius: 14, cursor: "pointer", overflow: "hidden", position: "relative", opacity,
        transition: "all .2s",
      }}
    >
      {/* Progress bar top */}
      <div style={{ height: 3, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", position: "relative" }}>
        <div style={{ height: "100%", width: `${g.progress}%`, background: hc, position: "relative", transition: "width .8s cubic-bezier(0.16,1,0.3,1)" }}>
          <span style={{ position: "absolute", right: -1, top: -3, width: 9, height: 9, borderRadius: "50%", background: hc, boxShadow: `0 0 6px ${hc}` }} />
        </div>
      </div>

      {/* Top section */}
      <div style={{ padding: "16px 16px 14px", display: "flex", alignItems: "flex-start", gap: 12, borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"}` }}>
        {/* Health ring */}
        <div style={{ width: 44, height: 44, flexShrink: 0, position: "relative" }}>
          <PolarisHealthRing score={g.health_score} size={44} light={isLight} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {healthEmoji(g.health_score)}
          </div>
        </div>
        {/* Meta info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".08em", textTransform: "uppercase", color: isLight ? "#b8b6cc" : "#323048" }}>{g.goal_type}</span>
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", color: isLight ? "#6b697f" : "#6b697f", fontFamily: "'JetBrains Mono', monospace" }}>{g.domain}</span>
            {g.status !== "active" && (
              <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", color: g.status === "paused" ? "#fcd34d" : "#6ee7b7", fontFamily: "'JetBrains Mono', monospace" }}>
                {g.status === "paused" ? "pausada" : "completada"}
              </span>
            )}
          </div>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 15, fontWeight: 400, color: isLight ? "#18172a" : "#e8e6f2", lineHeight: 1.3, marginBottom: 4 }}>{g.title}</div>
          <div style={{ fontSize: 10, color: isLight ? "#b8b6cc" : "#323048", fontFamily: "'JetBrains Mono', monospace" }}>
            {dlText}{dlText && " · "}{Math.round(g.progress)}% completado
          </div>
        </div>
      </div>

      {/* Bottom: momentum */}
      <div style={{ padding: "10px 16px 14px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: "3px 8px", borderRadius: 999, background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", border: `1px solid ${mc}33`, color: mc }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: mc, flexShrink: 0 }} />
          {momentumArrow(g.momentum)} {momentumLabel(g.momentum)}
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────

function DetailPanel({ goal: g, loading, isLight, bg, bg2, bg3, surf, surf2, bdr, bdr2, txt, txt2, txt3, onClose, onCheckin, onPause }: {
  goal: PolarisGoal; loading: boolean; isLight: boolean;
  bg: string; bg2: string; bg3: string; surf: string; surf2: string;
  bdr: string; bdr2: string; txt: string; txt2: string; txt3: string;
  onClose: () => void; onCheckin: () => void; onPause: () => void;
}) {
  const hc = healthColor(g.health_score, isLight);
  const mc = momentumColor(g.momentum, isLight);
  const dl = daysLeft(g.target_date);
  const msDone  = (g.milestones ?? []).filter((m) => m.completed_at).length;
  const msTotal = (g.milestones ?? []).length;

  return (
    <>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", flexShrink: 0, position: "relative" }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 14, right: 14, width: 26, height: 26, borderRadius: "50%", border: `1px solid ${bdr}`, background: "none", color: txt2, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >✕</button>

        {/* Ring + score */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 56, height: 56, position: "relative", flexShrink: 0 }}>
            <PolarisHealthRing score={g.health_score} size={56} light={isLight} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{healthEmoji(g.health_score)}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 500, color: hc, lineHeight: 1 }}>{g.health_score}</div>
            <div style={{ fontSize: 10, color: txt3, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>health score</div>
          </div>
        </div>

        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 300, lineHeight: 1.25, color: txt, marginBottom: 10, paddingRight: 32 }}>{g.title}</div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 16, borderBottom: `1px solid ${bdr}` }}>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, fontFamily: "'JetBrains Mono', monospace", background: hc + "18", color: hc }}>{healthEmoji(g.health_score)} {g.health_score}/100</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, fontFamily: "'JetBrains Mono', monospace", background: mc + "18", color: mc }}>{momentumArrow(g.momentum)} {momentumLabel(g.momentum)}</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, fontFamily: "'JetBrains Mono', monospace", background: surf2, color: txt2 }}>{g.domain}</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, fontFamily: "'JetBrains Mono', monospace", background: surf2, color: txt2 }}>{g.goal_type}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 18 }}>

        {loading && (
          <div style={{ color: txt3, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>Cargando detalles…</div>
        )}

        {/* Progress */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Progreso</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ flex: 1, height: 6, background: surf2, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${g.progress}%`, height: "100%", background: hc, borderRadius: 6 }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: txt2 }}>{g.progress}%</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ fontSize: 11, color: txt3, fontFamily: "'JetBrains Mono', monospace" }}>
              {dl !== null ? (dl > 0 ? `${dl} días restantes` : `Venció hace ${Math.abs(dl)} días`) : "Sin fecha"}
            </span>
            {msTotal > 0 && <span style={{ fontSize: 11, color: txt3, fontFamily: "'JetBrains Mono', monospace" }}>{msDone}/{msTotal} hitos</span>}
          </div>
        </div>

        {/* Sparkline */}
        {g.health_history && g.health_history.length > 1 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Historial de salud — 7 semanas</div>
            <div style={{ height: 60, position: "relative" }}>
              <PolarisSparkline data={g.health_history} color={hc} height={60} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 9, color: txt3, fontFamily: "'JetBrains Mono', monospace" }}>−7 sem</span>
              <span style={{ fontSize: 9, color: txt3, fontFamily: "'JetBrains Mono', monospace" }}>hoy</span>
            </div>
          </div>
        )}

        {/* Signals */}
        {(g.signal_actions !== undefined || g.signal_mood !== undefined || g.signal_pace !== undefined) && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Señales (fórmula ponderada)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {([
                { icon: "⚡", name: "Acciones", val: g.signal_actions, color: isLight ? "#6366f1" : "#818cf8", weight: "×.35" },
                { icon: "🌙", name: "Ánimo",    val: g.signal_mood,    color: isLight ? "#9333ea" : "#c084fc", weight: "×.25" },
                { icon: "📅", name: "Ritmo",    val: g.signal_pace,    color: isLight ? "#2563eb" : "#60a5fa", weight: "×.15" },
              ]).map(({ icon, name, val, color, weight }) => val !== undefined && (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, width: 18, textAlign: "center", flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: txt2, width: 56, flexShrink: 0 }}>{name}</span>
                  <div style={{ flex: 1, height: 5, background: surf2, borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 5, background: color, width: `${val}%` }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: txt2, width: 28, textAlign: "right" }}>{val}</span>
                  <span style={{ fontSize: 9, color: txt3, fontFamily: "'JetBrains Mono', monospace" }}>{weight}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: txt3, fontFamily: "'JetBrains Mono', monospace" }}>Momentum ×.20 · Conflicto ×.05 (calculados en servidor)</div>
          </div>
        )}

        {/* Why */}
        {(g.why_now || g.why_benefit) && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>¿Por qué esta meta?</div>
            {g.why_now && (
              <div style={{ background: surf, border: `1px solid ${bdr}`, borderRadius: 8, padding: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: txt3, marginBottom: 4, letterSpacing: ".05em" }}>AHORA</div>
                <div style={{ fontSize: 13, color: txt2, lineHeight: 1.55, fontFamily: "'Fraunces', Georgia, serif", fontWeight: 300 }}>{g.why_now}</div>
              </div>
            )}
            {g.why_benefit && (
              <div style={{ background: surf, border: `1px solid ${bdr}`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: txt3, marginBottom: 4, letterSpacing: ".05em" }}>BENEFICIO</div>
                <div style={{ fontSize: 13, color: txt2, lineHeight: 1.55, fontFamily: "'Fraunces', Georgia, serif", fontWeight: 300 }}>{g.why_benefit}</div>
              </div>
            )}
          </div>
        )}

        {/* Milestones */}
        {g.milestones && g.milestones.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Hitos</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {g.milestones.map((m, idx) => (
                <div key={m.id ?? idx} style={{ display: "flex", gap: 10, padding: "8px 0", position: "relative" }}>
                  {idx < (g.milestones?.length ?? 0) - 1 && (
                    <div style={{ position: "absolute", left: 9, top: 24, bottom: -8, width: 1, background: bdr }} />
                  )}
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: `2px solid ${m.completed_at ? "#6ee7b7" : bdr}`,
                    background: m.completed_at ? "#6ee7b7" : bg3,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, flexShrink: 0, marginTop: 1,
                    color: m.completed_at ? "#07080f" : txt3,
                  }}>
                    {m.completed_at ? "✓" : m.is_auto ? "◎" : ""}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: m.completed_at ? txt3 : txt, lineHeight: 1.3, textDecoration: m.completed_at ? "line-through" : "none" }}>{m.title}</div>
                    <div style={{ fontSize: 10, color: txt3, fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
                      {m.completed_at ? fmtDate(m.completed_at) : m.target_date ? `Meta: ${fmtDate(m.target_date)}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {g.tags && g.tags.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {g.tags.map((t) => (
                <span key={t} style={{ fontSize: 11, padding: "1px 6px", borderRadius: 4, background: surf2, color: txt2, fontFamily: "'JetBrains Mono', monospace" }}>#{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Obituario */}
        {g.obituary && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: txt3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>In memoriam</div>
            <div style={{ background: "linear-gradient(135deg,rgba(249,168,212,.06),rgba(129,140,248,.06))", border: "1px solid rgba(249,168,212,.15)", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#f9a8d4", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>★ Meta completada</div>
              <div style={{ fontSize: 13, color: txt2, lineHeight: 1.65, fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontWeight: 300 }}>{g.obituary}</div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: "14px 18px", borderTop: `1px solid ${bdr}`, display: "flex", gap: 7, flexShrink: 0 }}>
        <button onClick={onCheckin} style={{ flex: 1, padding: 8, borderRadius: 7, border: `1px solid ${bdr}`, background: "none", color: txt2, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>✦ Check-in</button>
        {g.status === "active" && (
          <button onClick={onPause} style={{ flex: 1, padding: 8, borderRadius: 7, border: "1px solid rgba(110,231,183,.3)", background: surf, color: "#6ee7b7", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>⏸ Pausar</button>
        )}
        {g.status === "paused" && (
          <button
            onClick={async () => {
              await fetch(`/api/modules/goals/goals/${g.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "active" }),
              });
            }}
            style={{ flex: 1, padding: 8, borderRadius: 7, border: "1px solid rgba(110,231,183,.3)", background: surf, color: "#6ee7b7", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
          >▶ Reactivar</button>
        )}
      </div>
    </>
  );
}

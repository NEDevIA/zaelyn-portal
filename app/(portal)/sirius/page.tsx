"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import type {
  SiriusNode, SiriusLink, DetailNode,
  ParaBucket, Evergreen, TabKey,
} from "@/components/sirius/siriusData";
import {
  PARA_COLORS, PARA_LABELS, PARA_ICONS,
  NODE_ICONS, NODE_META, EV_ICONS, EV_LABELS,
} from "@/components/sirius/siriusData";

// StarMap only renders on client (canvas)
const SiriusStarMap = dynamic(() => import("@/components/sirius/SiriusStarMap"), { ssr: false });

// ── Raw API shapes ────────────────────────────────────────────────────────

interface RawNodesResponse {
  nodes?: SiriusNode[];
  links?: SiriusLink[];
}

interface RagResponse {
  answer?:  string;
  sources?: SiriusNode[];
}

// ── Helpers ───────────────────────────────────────────────────────────────

function paraColor(bucket: ParaBucket, light = false): string {
  if (light) {
    const lc: Record<ParaBucket, string> = { projects:"#6366f1", areas:"#059669", resources:"#2563eb", archive:"#4b5563" };
    return lc[bucket] ?? "#818CF8";
  }
  return PARA_COLORS[bucket] ?? "#818CF8";
}

// ── Constants ────────────────────────────────────────────────────────────

const PARA_BUCKETS: ParaBucket[] = ["projects", "areas", "resources", "archive"];

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "constellation", label: "Constelación", icon: "✦" },
  { key: "para",          label: "PARA",          icon: "⊞" },
  { key: "buscar",        label: "Buscar",         icon: "⌕" },
];

const EV_FILTERS: { key: Evergreen | null; label: string }[] = [
  { key: null,        label: "Todos"      },
  { key: "seedling",  label: "🌱 Semilla"  },
  { key: "growing",   label: "🌿 Creciendo" },
  { key: "mature",    label: "🌳 Madura"   },
];

// ── Page ──────────────────────────────────────────────────────────────────

export default function SiriusPage() {
  // ── Data ────────────────────────────────────────────────────────────────
  const [nodes,   setNodes]   = useState<SiriusNode[]>([]);
  const [links,   setLinks]   = useState<SiriusLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // ── UI ──────────────────────────────────────────────────────────────────
  const [activeTab,  setActiveTab]  = useState<TabKey>("constellation");
  const [paraFilter, setParaFilter] = useState<ParaBucket | null>(null);
  const [quickQ,     setQuickQ]     = useState("");
  const [evFilter,   setEvFilter]   = useState<Evergreen | null>(null);

  // Detail panel
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [detailNode,   setDetailNode]   = useState<DetailNode | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reflection,   setReflection]   = useState("");

  // Light/dark toggle
  const [isLight, setIsLight] = useState(false);

  // RAG
  const [ragQuery,   setRagQuery]   = useState("");
  const [ragAnswer,  setRagAnswer]  = useState<string | null>(null);
  const [ragSources, setRagSources] = useState<SiriusNode[]>([]);
  const [ragLoading, setRagLoading] = useState(false);

  // Debounce timer for quick filter
  const filterTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── Fetch nodes ─────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/modules/secmind/nodes?limit=200&include_links=true", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`nodes: ${res.status}`);
      const data: RawNodesResponse = await res.json();
      setNodes(data.nodes ?? []);
      setLinks(data.links ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el grafo");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Open detail panel ───────────────────────────────────────────────────

  async function openDetail(id: string) {
    setSelectedId(id);
    setDetailLoading(true);

    // Optimistic: find in local state while fetching full detail
    const local = nodes.find((n) => n.id === id);
    if (local) setDetailNode({ ...local, connected: [], backlinks: [] });

    try {
      const res = await fetch(`/api/modules/secmind/nodes/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data: DetailNode = await res.json();
        setDetailNode(data);
        setReflection(data.reflection ?? "");
      }
    } catch { /* keep optimistic */ }
    finally { setDetailLoading(false); }
  }

  function closeDetail() {
    setSelectedId(null);
    setDetailNode(null);
  }

  // ── Evergreen picker (detail panel) ─────────────────────────────────────

  async function setNodeEvergreen(id: string, ev: Evergreen) {
    setDetailNode((prev) => prev ? { ...prev, evergreen: ev } : prev);
    await fetch(`/api/modules/secmind/nodes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evergreen: ev }),
    }).catch(() => null);
    // Reflect in list
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, evergreen: ev } : n));
  }

  // ── Save reflection ──────────────────────────────────────────────────────

  async function saveReflection(id: string, text: string) {
    await fetch(`/api/modules/secmind/nodes/${id}/reflect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reflection: text }),
    }).catch(() => null);
  }

  // ── Quick filter (debounced, updates textFilter on StarMap) ─────────────

  const [textFilter, setTextFilter] = useState<string | null>(null);

  function handleQuickFilter(q: string) {
    setQuickQ(q);
    clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => {
      setTextFilter(q.trim() ? q.toLowerCase() : null);
    }, 300);
  }

  // ── RAG query ────────────────────────────────────────────────────────────

  async function submitRAG() {
    const q = ragQuery.trim();
    if (!q) return;
    setRagLoading(true);
    setRagAnswer(null);
    setRagSources([]);
    try {
      const res = await fetch("/api/modules/secmind/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, limit: 5 }),
      });
      if (res.ok) {
        const data: RagResponse = await res.json();
        setRagAnswer(data.answer ?? "Sin respuesta.");
        setRagSources(data.sources ?? []);
      } else {
        setRagAnswer("Error al procesar la consulta.");
      }
    } catch {
      setRagAnswer("No se pudo conectar con Sirius.");
    } finally {
      setRagLoading(false);
    }
  }

  // ── Network stats ─────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total   = nodes.length;
    const density = total > 0 ? (links.length / total).toFixed(1) : "0";
    const orphans = nodes.filter((n) => {
      return !links.some((l) => l.source === n.id || l.target === n.id);
    }).length;
    const hubs = nodes.filter((n) => (n.connections ?? 0) >= 4).length;

    const seedling = nodes.filter((n) => n.evergreen === "seedling").length;
    const growing  = nodes.filter((n) => n.evergreen === "growing").length;
    const mature   = nodes.filter((n) => n.evergreen === "mature").length;
    const pct = (v: number) => total > 0 ? Math.round(v / total * 100) : 0;

    return { density, orphans, hubs, seedling, growing, mature, pct };
  }, [nodes, links]);

  const paraCounts = useMemo(() => {
    const counts: Partial<Record<ParaBucket, number>> = {};
    for (const b of PARA_BUCKETS) counts[b] = nodes.filter((n) => n.para_bucket === b).length;
    return counts;
  }, [nodes]);

  const dailyNodes = useMemo(() => nodes.slice(0, 3), [nodes]);

  // Search filtered nodes (for Buscar tab)
  const searchNodes = useMemo(() => {
    let ns = nodes;
    if (evFilter) ns = ns.filter((n) => n.evergreen === evFilter);
    if (textFilter) ns = ns.filter((n) =>
      n.title.toLowerCase().includes(textFilter) ||
      n.summary?.toLowerCase().includes(textFilter) ||
      (n.tags ?? []).some((t) => t.includes(textFilter)),
    );
    return ns;
  }, [nodes, evFilter, textFilter]);

  // ── Render ───────────────────────────────────────────────────────────────

  const EASE = "cubic-bezier(0.16,1,0.3,1)";

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ background: isLight ? "#fafaf8" : "var(--background)", color: isLight ? "#1a1828" : "var(--foreground)" }}
    >

      {/* ══ SIDEBAR ══ */}
      <aside
        className="flex-shrink-0 flex flex-col overflow-hidden"
        style={{ width: 244, borderRight: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, background: isLight ? "#f4f3ef" : "var(--card)", zIndex: 10 }}
      >
        {/* Logo */}
        <div
          style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 400, letterSpacing: "-0.02em", color: isLight ? "#1a1828" : "var(--foreground)" }}>
              S<span style={{ color: "#a78bfa", fontStyle: "italic" }}>irius</span>
            </div>
            <div style={{ fontSize: 9, color: isLight ? "#b0aec4" : "var(--muted-foreground)", fontFamily: "var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 3, opacity: 0.5 }}>
              Tu memoria · Zaelyn
            </div>
          </div>
          {/* Light/dark toggle */}
          <button
            onClick={() => setIsLight((v) => !v)}
            title="Cambiar tema"
            style={{ width: 28, height: 28, borderRadius: 7, background: "transparent", border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, color: isLight ? "#6d6b82" : "var(--muted-foreground)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            {isLight ? "🌙" : "☀️"}
          </button>
        </div>

        {/* PARA nav */}
        <div style={{ padding: "14px 12px 6px", flexShrink: 0 }}>
          <div style={sLabel(isLight)}>Espacio PARA</div>
          {/* All */}
          <ParaNavItem
            label="Todos" icon="●" color="#818CF8" count={nodes.length}
            active={paraFilter === null} isLight={isLight}
            onClick={() => setParaFilter(null)}
          />
          {PARA_BUCKETS.map((b) => (
            <ParaNavItem
              key={b} label={PARA_LABELS[b]} icon={PARA_ICONS[b]}
              color={paraColor(b, isLight)} count={paraCounts[b] ?? 0}
              active={paraFilter === b} isLight={isLight}
              onClick={() => setParaFilter(b === paraFilter ? null : b)}
            />
          ))}
        </div>

        <div style={sDivider(isLight)} />

        {/* Network stats */}
        <div style={{ padding: "10px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", flexShrink: 0 }}>
          {[
            { v: stats.density, l: "densidad" },
            { v: stats.orphans, l: "huérfanas" },
            { v: stats.hubs,    l: "hubs (4+)" },
          ].map(({ v, l }, i) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 4px", borderRight: i < 2 ? `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}` : "none", textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 500, color: "#818CF8", lineHeight: 1 }}>{v}</span>
              <span style={{ fontSize: 9, color: isLight ? "#b0aec4" : "var(--muted-foreground)", marginTop: 3, opacity: 0.6, lineHeight: 1.3 }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Evergreen bars */}
        <div style={{ padding: "10px 20px 8px", flexShrink: 0 }}>
          {(["seedling", "growing", "mature"] as Evergreen[]).map((ev) => {
            const cnt = stats[ev];
            const pct = stats.pct(cnt);
            const clr = ev === "mature" ? "#F0C060" : ev === "growing" ? "#818CF8" : "#34D399";
            return (
              <div key={ev} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <span style={{ fontSize: 11, flexShrink: 0 }}>{EV_ICONS[ev]}</span>
                <div style={{ flex: 1, height: 3, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: clr, width: `${pct}%`, transition: "width .6s" }} />
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: isLight ? "#b0aec4" : "var(--muted-foreground)", opacity: 0.6, flexShrink: 0 }}>{cnt}</span>
              </div>
            );
          })}
        </div>

        <div style={sDivider(isLight)} />

        {/* Daily suggestions */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "12px 12px 6px", minHeight: 0 }}>
          <div style={sLabel(isLight, true)}>Hoy · Sirius sugiere</div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading ? (
              <div style={{ padding: "8px 8px", fontSize: 11, opacity: 0.4, fontFamily: "var(--font-mono)" }}>Cargando…</div>
            ) : dailyNodes.length === 0 ? (
              <div style={{ padding: "8px 8px", fontSize: 11, opacity: 0.3, fontFamily: "var(--font-mono)" }}>Sin notas aún</div>
            ) : dailyNodes.map((n) => (
              <button
                key={n.id}
                onClick={() => openDetail(n.id)}
                style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 8px", borderRadius: 7, cursor: "pointer", transition: "background .15s", width: "100%", background: "none", border: "none", textAlign: "left" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: paraColor(n.para_bucket, isLight), flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: 12, color: isLight ? "#6d6b82" : "var(--muted-foreground)", lineHeight: 1.35, flex: 1 }}>{n.title}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: isLight ? "#b0aec4" : "var(--muted-foreground)", opacity: 0.5, alignSelf: "center", flexShrink: 0 }}>{n.zettel_id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer stats */}
        <div style={{ padding: "12px 20px", display: "flex", gap: 18, borderTop: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, flexShrink: 0 }}>
          {[
            { v: nodes.length, l: "notas"    },
            { v: links.length, l: "vínculos"  },
          ].map(({ v, l }) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 17, color: isLight ? "#1a1828" : "var(--foreground)", lineHeight: 1.1 }}>{v}</div>
              <div style={{ fontSize: 9, color: isLight ? "#b0aec4" : "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginTop: 2, opacity: 0.5 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* New note button */}
        <button
          style={{ margin: "0 12px 12px", padding: 9, borderRadius: 8, border: `1px dashed ${isLight ? "rgba(99,102,241,0.3)" : "rgba(129,140,248,0.3)"}`, background: "none", color: "#818CF8", fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isLight ? "rgba(99,102,241,0.05)" : "rgba(129,140,248,0.06)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          onClick={() => alert("Dile a Zaelyn «nueva nota atómica» para crear notas desde Telegram")}
        >
          + Nueva nota atómica
        </button>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ position: "relative" }}>

        {/* Header / tabs */}
        <header
          className="flex-shrink-0 flex items-center justify-between"
          style={{ padding: "0 24px", height: 52, borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, background: isLight ? "rgba(250,249,246,0.9)" : "var(--card)", backdropFilter: "blur(20px)", zIndex: 10, flexShrink: 0 }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: 2 }}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "6px 13px", borderRadius: 7, border: "none",
                  background: activeTab === tab.key ? (isLight ? "rgba(99,102,241,0.1)" : "rgba(129,140,248,0.12)") : "none",
                  color: activeTab === tab.key ? "#818CF8" : (isLight ? "#6d6b82" : "var(--muted-foreground)"),
                  fontFamily: "inherit", fontSize: 13, fontWeight: activeTab === tab.key ? 500 : 400,
                  cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Mini search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: isLight ? "#b0aec4" : "var(--muted-foreground)", fontSize: 13, pointerEvents: "none" }}>⌕</span>
            <input
              value={quickQ}
              onChange={(e) => handleQuickFilter(e.target.value)}
              placeholder="Filtrar notas..."
              style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, borderRadius: 8, padding: "6px 11px 6px 30px", color: isLight ? "#1a1828" : "var(--foreground)", fontFamily: "inherit", fontSize: 13, outline: "none", width: 188, transition: "all .2s" }}
            />
          </div>
        </header>

        {/* Error bar */}
        {!loading && error && (
          <div style={{ padding: "10px 24px", fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,0.05)", borderBottom: "1px solid rgba(239,68,68,0.2)" }}>
            {error}{" "}
            <button onClick={load} style={{ textDecoration: "underline", cursor: "pointer", background: "none", border: "none", color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}>Reintentar</button>
          </div>
        )}

        {/* Tab content */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>

          {/* ── CONSTELACIÓN ── */}
          {activeTab === "constellation" && (
            <div style={{ position: "absolute", inset: 0, background: isLight ? "#fafaf8" : "#08090e" }}>
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(129,140,248,0.4)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
                  Cargando constelación…
                </div>
              ) : (
                <SiriusStarMap
                  nodes={nodes} links={links}
                  paraFilter={paraFilter} textFilter={textFilter}
                  selectedId={selectedId} isLight={isLight}
                  onNodeClick={openDetail} onCanvasClick={closeDetail}
                />
              )}

              {/* PARA legend */}
              <div style={{ position: "absolute", bottom: 18, left: 18, display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 10, background: isLight ? "rgba(250,249,246,0.9)" : "rgba(8,9,14,0.88)", border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`, borderRadius: 999, padding: "6px 14px", backdropFilter: "blur(12px)" }}>
                  {PARA_BUCKETS.map((b) => (
                    <div key={b} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: isLight ? "#6d6b82" : "rgba(200,210,255,0.7)", fontFamily: "var(--font-mono)" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: PARA_COLORS[b], display: "inline-block" }} />
                      {PARA_LABELS[b]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Node type legend */}
              <div style={{ position: "absolute", top: 14, right: 18, background: isLight ? "rgba(250,249,246,0.9)" : "rgba(8,9,14,0.85)", border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, padding: "10px 13px", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", gap: 5 }}>
                {(["project","insight","note","idea","person","resource"] as const).map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: isLight ? "#6d6b82" : "rgba(200,210,255,0.7)", fontFamily: "var(--font-mono)" }}>
                    <span style={{ width: 16, textAlign: "center", fontSize: 12 }}>{NODE_ICONS[t]}</span>
                    {NODE_META[t].label}
                  </div>
                ))}
              </div>

              {/* Hint */}
              <div style={{ position: "absolute", bottom: 20, right: 22, fontSize: 11, color: "rgba(129,140,248,0.3)", fontFamily: "var(--font-mono)" }}>
                click · arrastra · scroll para explorar
              </div>
            </div>
          )}

          {/* ── PARA BOARD ── */}
          {activeTab === "para" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", height: "100%", background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)", gap: 1 }}>
              {PARA_BUCKETS.map((b) => {
                const col = paraColor(b, isLight);
                const bNodes = nodes.filter((n) => n.para_bucket === b);
                return (
                  <div key={b} style={{ background: isLight ? "#fafaf8" : "var(--background)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ padding: "13px 14px 10px", display: "flex", alignItems: "center", gap: 7, fontSize: 10, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", borderBottom: `2px solid ${col}`, flexShrink: 0, fontFamily: "var(--font-mono)", color: col }}>
                      {PARA_ICONS[b]} {PARA_LABELS[b]}
                      <span style={{ marginLeft: "auto", opacity: 0.45, fontWeight: 400 }}>{bNodes.length}</span>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 7 }}>
                      {bNodes.length === 0 ? (
                        <div style={{ padding: "28px 14px", textAlign: "center", color: isLight ? "#b0aec4" : "var(--muted-foreground)", fontSize: 12, fontFamily: "var(--font-mono)", opacity: 0.5 }}>
                          Sin notas
                        </div>
                      ) : bNodes.map((n) => (
                        <NodeCard key={n.id} node={n} color={col} isLight={isLight} onClick={() => openDetail(n.id)} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── BUSCAR ── */}
          {activeTab === "buscar" && (
            <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 22 }}>

              {/* RAG box */}
              <div style={{ background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", border: `1px solid ${isLight ? "rgba(99,102,241,0.2)" : "rgba(129,140,248,0.2)"}`, borderRadius: 12, padding: 20, position: "relative", overflow: "hidden", flexShrink: 0 }}>
                <div style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "#818CF8", fontWeight: 500, marginBottom: 10, fontFamily: "var(--font-mono)" }}>
                  ✦ Sirius RAG — pregunta sobre tu grafo
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitRAG()}
                    placeholder="¿Qué sé sobre el modelo de precios de Zaelyn?"
                    style={{ flex: 1, background: isLight ? "#f4f3ef" : "var(--card)", border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, borderRadius: 8, padding: "10px 13px", color: isLight ? "#1a1828" : "var(--foreground)", fontFamily: "inherit", fontSize: 14, outline: "none" }}
                  />
                  <button
                    onClick={submitRAG}
                    disabled={ragLoading}
                    style={{ padding: "10px 16px", background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", border: `1px solid ${isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.14)"}`, borderRadius: 8, color: isLight ? "#1a1828" : "var(--foreground)", fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer", opacity: ragLoading ? 0.5 : 1 }}
                  >
                    {ragLoading ? "…" : "Preguntar"}
                  </button>
                </div>

                {/* RAG answer */}
                {ragLoading && (
                  <div style={{ marginTop: 14, padding: "13px 14px", background: isLight ? "#f4f3ef" : "var(--card)", borderRadius: 8, borderLeft: "2px solid #818CF8", fontSize: 13, color: isLight ? "#6d6b82" : "var(--muted-foreground)", animation: "fadeUp .3s ease" }}>
                    Sirius está procesando tu pregunta…
                  </div>
                )}
                {ragAnswer && !ragLoading && (
                  <div style={{ marginTop: 14, padding: "13px 14px", background: isLight ? "#f4f3ef" : "var(--card)", borderRadius: 8, borderLeft: "2px solid #818CF8", fontSize: 13.5, lineHeight: 1.7, color: isLight ? "#1a1828" : "var(--foreground)", animation: "fadeUp .3s ease" }}>
                    {ragAnswer}
                    {ragSources.length > 0 && (
                      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {ragSources.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => openDetail(n.id)}
                            style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "var(--border)"}`, color: isLight ? "#6d6b82" : "var(--muted-foreground)", cursor: "pointer", fontFamily: "var(--font-mono)" }}
                          >
                            {n.zettel_id} {n.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Evergreen filter */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                <div style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: isLight ? "#b0aec4" : "var(--muted-foreground)", fontFamily: "var(--font-mono)", opacity: 0.7 }}>
                  Filtrar por madurez Zettelkasten
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {EV_FILTERS.map(({ key, label }) => (
                    <button
                      key={String(key)}
                      onClick={() => setEvFilter(key)}
                      style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: evFilter === key ? (isLight ? "rgba(99,102,241,0.08)" : "rgba(129,140,248,0.1)") : "none", border: `1px solid ${evFilter === key ? "#818CF8" : (isLight ? "rgba(0,0,0,0.1)" : "var(--border)")}`, color: evFilter === key ? "#818CF8" : (isLight ? "#6d6b82" : "var(--muted-foreground)"), cursor: "pointer", fontFamily: "var(--font-mono)" }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search results grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: isLight ? "#b0aec4" : "var(--muted-foreground)", fontFamily: "var(--font-mono)", opacity: 0.7 }}>
                  Búsqueda semántica {searchNodes.length > 0 && `· ${searchNodes.length} notas`}
                </div>
                {loading ? (
                  <div style={{ textAlign: "center", padding: 28, opacity: 0.3, fontSize: 12, fontFamily: "var(--font-mono)" }}>Cargando…</div>
                ) : searchNodes.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 28, opacity: 0.3, fontSize: 12, fontFamily: "var(--font-mono)" }}>Sin resultados</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 8 }}>
                    {searchNodes.map((n) => (
                      <NodeCard key={n.id} node={n} color={paraColor(n.para_bucket, isLight)} isLight={isLight} onClick={() => openDetail(n.id)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ══ DETAIL PANEL (slide-in from right) ══ */}
        <aside
          style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 370,
            background: isLight ? "#f4f3ef" : "var(--card)",
            borderLeft: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`,
            transform: selectedId ? "translateX(0)" : "translateX(100%)",
            transition: `transform .3s ${EASE}`,
            zIndex: 20, display: "flex", flexDirection: "column", overflow: "hidden",
          }}
        >
          {detailNode && (
            <>
              {/* Header */}
              <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, flexShrink: 0, position: "relative" }}>
                <button
                  onClick={closeDetail}
                  style={{ position: "absolute", top: 14, right: 14, width: 26, height: 26, borderRadius: "50%", border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "var(--border)"}`, background: "none", color: isLight ? "#6d6b82" : "var(--muted-foreground)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  ✕
                </button>

                {/* Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  {(() => {
                    const meta = NODE_META[detailNode.node_type];
                    return (
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, fontFamily: "var(--font-mono)", background: meta.bg, color: meta.color }}>
                        {NODE_ICONS[detailNode.node_type]} {meta.label}
                      </span>
                    );
                  })()}
                  {(() => {
                    const col = paraColor(detailNode.para_bucket, isLight);
                    return (
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, fontFamily: "var(--font-mono)", background: col + "22", color: col }}>
                        {detailNode.para_bucket}
                      </span>
                    );
                  })()}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: isLight ? "#b0aec4" : "var(--muted-foreground)", opacity: 0.6 }}>{detailNode.zettel_id}</span>
                  <span style={{ fontSize: 14 }} title={detailNode.evergreen}>{EV_ICONS[detailNode.evergreen]}</span>
                  {!detailNode.has_embedding && (
                    <span style={{ fontSize: 9, color: "#F87171", fontFamily: "var(--font-mono)" }}>sin embedding</span>
                  )}
                </div>

                <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, lineHeight: 1.3, color: isLight ? "#1a1828" : "var(--foreground)", paddingRight: 30 }}>
                  {detailNode.title}
                </div>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
                {detailLoading && (
                  <div style={{ fontSize: 11, opacity: 0.4, fontFamily: "var(--font-mono)" }}>Cargando detalle…</div>
                )}

                {/* Summary */}
                <div>
                  <div style={dLabel(isLight)}>Resumen</div>
                  <div style={dContent(isLight)}>{detailNode.summary || "—"}</div>
                </div>

                {/* Content */}
                {detailNode.content && (
                  <div>
                    <div style={dLabel(isLight)}>Contenido</div>
                    <div style={dContent(isLight)}>{detailNode.content}</div>
                  </div>
                )}

                {/* Evergreen picker */}
                <div>
                  <div style={dLabel(isLight)}>Madurez Zettelkasten</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["seedling", "growing", "mature"] as Evergreen[]).map((ev) => (
                      <button
                        key={ev}
                        onClick={() => setNodeEvergreen(detailNode.id, ev)}
                        style={{ flex: 1, padding: 7, borderRadius: 7, border: `1px solid ${detailNode.evergreen === ev ? "#818CF8" : (isLight ? "rgba(0,0,0,0.1)" : "var(--border)")}`, background: detailNode.evergreen === ev ? (isLight ? "rgba(99,102,241,0.08)" : "rgba(129,140,248,0.1)") : "none", cursor: "pointer", textAlign: "center" }}
                      >
                        <div style={{ fontSize: 16 }}>{EV_ICONS[ev]}</div>
                        <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: isLight ? "#b0aec4" : "var(--muted-foreground)", marginTop: 2 }}>{EV_LABELS[ev]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reflection */}
                <div>
                  <div style={dLabel(isLight)}>Reflexión</div>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    onBlur={(e) => saveReflection(detailNode.id, e.target.value)}
                    placeholder="Reflexión personal sobre esta nota…"
                    style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, borderRadius: 8, padding: "9px 11px", color: isLight ? "#1a1828" : "var(--foreground)", fontFamily: "inherit", fontSize: 13, lineHeight: 1.5, resize: "none", outline: "none", width: "100%", minHeight: 72 }}
                  />
                </div>

                {/* Tags */}
                {(detailNode.tags ?? []).length > 0 && (
                  <div>
                    <div style={dLabel(isLight)}>Tags</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {detailNode.tags.map((t) => (
                        <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 9, padding: "1px 5px", borderRadius: 4, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", color: isLight ? "#b0aec4" : "var(--muted-foreground)" }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connected nodes */}
                {(detailNode.connected ?? []).length > 0 && (
                  <div>
                    <div style={dLabel(isLight)}>Notas enlazadas ({detailNode.connected.length})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {detailNode.connected.map((c) => (
                        <ConnItem key={c.id} node={c} isLight={isLight} onClick={() => openDetail(c.id)} prefix="→" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Backlinks */}
                {(detailNode.backlinks ?? []).length > 0 && (
                  <div>
                    <div style={dLabel(isLight)}>← Backlinks ({detailNode.backlinks.length})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {detailNode.backlinks.map((c) => (
                        <ConnItem key={c.id} node={c} isLight={isLight} onClick={() => openDetail(c.id)} prefix="←" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "var(--border)"}`, display: "flex", gap: 6, flexShrink: 0 }}>
                <ActionBtn label="💬 Hablar" isLight={isLight} onClick={() => {}} />
                <ActionBtn label="↗ Conectar" isLight={isLight} onClick={() => {}} />
                <ActionBtn label="⊙ Archivar" isLight={isLight} primary onClick={() => {
                  setNodeEvergreen(detailNode.id, "mature");
                  alert("Dile a Zaelyn «archivar esta nota» para moverla a Archive");
                }} />
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function ParaNavItem({ label, icon, color, count, active, isLight, onClick }: {
  label: string; icon: string; color: string; count: number;
  active: boolean; isLight: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 8px", borderRadius: 7, cursor: "pointer", background: active ? (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)") : "none", border: "none", color: active ? (isLight ? "#1a1828" : "var(--foreground)") : (isLight ? "#6d6b82" : "var(--muted-foreground)"), fontFamily: "inherit", fontSize: 13, width: "100%", textAlign: "left", position: "relative", transition: "all .15s" }}
    >
      {active && <span style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2, borderRadius: 2, background: color }} />}
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span>{label}</span>
      <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, opacity: 0.4 }}>{count}</span>
    </button>
  );
}

function NodeCard({ node, color, isLight, onClick }: { node: SiriusNode; color: string; isLight: boolean; onClick: () => void }) {
  const icon   = NODE_ICONS[node.node_type] ?? "·";
  const evIcon = EV_ICONS[node.evergreen]   ?? "";

  return (
    <div
      onClick={onClick}
      style={{ background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)"}`, borderRadius: 8, padding: "11px 11px 9px", cursor: "pointer", transition: "all .15s", position: "relative", overflow: "hidden", ["--cc" as string]: color }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = isLight ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.14)";
        (e.currentTarget as HTMLDivElement).style.background  = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.background  = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)";
      }}
    >
      {/* Top: zettel_id + evergreen */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: isLight ? "#b0aec4" : "var(--muted-foreground)", opacity: 0.6 }}>{node.zettel_id}</span>
        <span style={{ fontSize: 11 }} title={node.evergreen}>{evIcon}</span>
      </div>

      {/* Title */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 5 }}>
        <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>{icon}</span>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 13, fontWeight: 400, color: isLight ? "#1a1828" : "var(--foreground)", lineHeight: 1.3 }}>{node.title}</span>
      </div>

      {/* Summary */}
      <div style={{ fontSize: 11.5, color: isLight ? "#6d6b82" : "var(--muted-foreground)", lineHeight: 1.45, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", marginBottom: 7 }}>
        {node.summary}
      </div>

      {/* Footer: tags + link count */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, flex: 1 }}>
          {(node.tags ?? []).slice(0, 3).map((t) => (
            <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 9, padding: "1px 5px", borderRadius: 4, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", color: isLight ? "#b0aec4" : "var(--muted-foreground)" }}>
              #{t}
            </span>
          ))}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: isLight ? "#b0aec4" : "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 3, flexShrink: 0, opacity: 0.6 }}>
          ↗ {node.connections ?? 0}
        </div>
      </div>
    </div>
  );
}

function ConnItem({ node, isLight, onClick, prefix }: { node: SiriusNode; isLight: boolean; onClick: () => void; prefix: string }) {
  const col = PARA_COLORS[node.para_bucket] ?? "#818CF8";
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 8px", borderRadius: 7, cursor: "pointer", border: "1px solid transparent", transition: "all .15s", width: "100%", background: "none", fontFamily: "inherit" }}
      onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"; b.style.borderColor = isLight ? "rgba(0,0,0,0.08)" : "var(--border)"; }}
      onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "none"; b.style.borderColor = "transparent"; }}
    >
      <span style={{ fontSize: 11, color: isLight ? "#6d6b82" : "var(--muted-foreground)" }}>{prefix} {NODE_ICONS[node.node_type] ?? "·"}</span>
      <span style={{ fontSize: 12.5, color: isLight ? "#6d6b82" : "var(--muted-foreground)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>{node.title}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: isLight ? "#b0aec4" : "var(--muted-foreground)", opacity: 0.5 }}>{node.zettel_id}</span>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: col, flexShrink: 0 }} />
    </button>
  );
}

function ActionBtn({ label, isLight, onClick, primary }: { label: string; isLight: boolean; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ flex: 1, padding: 8, borderRadius: 7, border: `1px solid ${primary ? "#818CF8" : (isLight ? "rgba(0,0,0,0.1)" : "var(--border)")}`, background: primary ? (isLight ? "rgba(99,102,241,0.06)" : "rgba(129,140,248,0.08)") : "none", color: primary ? "#818CF8" : (isLight ? "#6d6b82" : "var(--muted-foreground)"), fontFamily: "inherit", fontSize: 12, cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
    >
      {label}
    </button>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────

function sLabel(isLight: boolean, noBottom?: boolean): React.CSSProperties {
  return { fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: isLight ? "#b0aec4" : "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: noBottom ? 7 : 8, padding: "0 8px", opacity: 0.7 };
}

function sDivider(isLight: boolean): React.CSSProperties {
  return { height: 1, background: isLight ? "rgba(0,0,0,0.06)" : "var(--border)", margin: "8px 20px" };
}

function dLabel(isLight: boolean): React.CSSProperties {
  return { fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: isLight ? "#b0aec4" : "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 6, opacity: 0.7 };
}

function dContent(isLight: boolean): React.CSSProperties {
  return { fontSize: 13.5, lineHeight: 1.65, color: isLight ? "#6d6b82" : "var(--muted-foreground)", fontFamily: "var(--font-serif)", fontWeight: 300 };
}

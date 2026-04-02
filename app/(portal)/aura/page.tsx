"use client";

import { useMemo, useState } from "react";
import AuraCalendar  from "@/components/aura/AuraCalendar";
import AuraMoodBars  from "@/components/aura/AuraMoodBars";
import AuraStats     from "@/components/aura/AuraStats";
import AuraEntryCard from "@/components/aura/AuraEntryCard";
import { MOCK_ENTRIES, type MoodKey } from "@/components/aura/auraData";

// ── Constants ──────────────────────────────────────────────────────────────

const DAYS_ES = [
  "domingo", "lunes", "martes", "miércoles",
  "jueves", "viernes", "sábado",
];
const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const FILTERS: { key: "all" | MoodKey; label: string }[] = [
  { key: "all",       label: "Todo"           },
  { key: "resonante", label: "◉ Aura violeta" },
  { key: "atenta",    label: "◉ Aura naranja" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDayLabel(dateStr: string, today: Date): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date      = new Date(y, m - 1, d);
  const todayMid  = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yestMid   = new Date(todayMid);
  yestMid.setDate(todayMid.getDate() - 1);

  const dayName = DAYS_ES[date.getDay()];
  const cap     = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const suffix  = `${d} de ${MONTHS_ES[m - 1]}`;

  if (date.getTime() === todayMid.getTime()) return `Hoy — ${dayName} ${suffix}`;
  if (date.getTime() === yestMid.getTime())  return `Ayer — ${dayName} ${suffix}`;
  return `${cap} ${suffix}`;
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AuraPage() {
  const today = useMemo(() => new Date(), []);

  const [filter, setFilter] = useState<"all" | MoodKey>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      MOCK_ENTRIES.filter((e) => {
        if (filter !== "all" && e.mood !== filter) return false;
        if (search && !e.content.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [filter, search],
  );

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const totalEntries = MOCK_ENTRIES.length;
  const streak       = 4;

  const todayDayName = DAYS_ES[today.getDay()];
  const todayLabel   = `${today.getDate()} de ${MONTHS_ES[today.getMonth()]}`;

  return (
    <div className="flex h-full overflow-hidden">

      {/* ══════════════════════════════════════════════
          LEFT PANEL — calendar, mood bars, legend, stats
      ══════════════════════════════════════════════ */}
      <aside
        className="flex-shrink-0 flex flex-col overflow-y-auto"
        style={{
          width: 248,
          borderRight: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        {/* Panel title */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 17, fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--foreground)",
              marginBottom: 3,
            }}
          >
            Aura
          </div>
          <div
            style={{
              fontSize: 10, color: "var(--muted-foreground)",
              fontFamily: "var(--font-mono)", letterSpacing: ".1em",
              textTransform: "uppercase", opacity: 0.45,
            }}
          >
            Tu diario · Zaelyn
          </div>
        </div>

        <AuraCalendar entries={MOCK_ENTRIES} today={today} />
        <AuraMoodBars entries={MOCK_ENTRIES} />
        <AuraStats    entryCount={totalEntries} streak={streak} />

        {/* Bottom padding */}
        <div style={{ height: 24 }} />
      </aside>

      {/* ══════════════════════════════════════════════
          RIGHT CONTENT — header, wrapped teaser, entries
      ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Sticky sub-header */}
        <header
          className="flex-shrink-0 flex items-center justify-between"
          style={{
            padding: "16px 32px",
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
            backdropFilter: "blur(20px)",
            zIndex: 10,
          }}
        >
          {/* Date */}
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20, fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            <em style={{ fontStyle: "italic", color: "#a78bfa" }}>
              {todayDayName.charAt(0).toUpperCase() + todayDayName.slice(1)}
            </em>{" "}
            <span style={{ color: "var(--foreground)" }}>{todayLabel}</span>
          </div>

          {/* Filters + search */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  border: "1px solid",
                  borderColor: filter === f.key ? "#8b5cf6" : "var(--border)",
                  background:  filter === f.key ? "#8b5cf6" : "transparent",
                  color:       filter === f.key ? "#fff"    : "var(--muted-foreground)",
                  cursor: "pointer",
                  transition: "all .2s",
                  fontFamily: "inherit",
                  lineHeight: 1.4,
                }}
              >
                {f.label}
              </button>
            ))}

            {/* Search */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--secondary)",
                border: "1px solid var(--border)",
                borderRadius: 8, padding: "5px 12px",
              }}
            >
              <span style={{ color: "var(--muted-foreground)", fontSize: 13, opacity: 0.6 }}>⌕</span>
              <input
                type="text"
                placeholder="Buscar en tu diario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "none", border: "none", outline: "none",
                  fontSize: 12, color: "var(--foreground)",
                  fontFamily: "inherit", width: 140,
                }}
              />
            </div>
          </div>
        </header>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto">

          {/* Wrapped teaser */}
          <div style={{ padding: "24px 32px 0" }}>
            <div
              style={{
                background: "linear-gradient(135deg,rgba(139,92,246,.12),rgba(236,72,153,.08))",
                border: "1px solid rgba(139,92,246,.2)",
                borderRadius: 14, padding: "20px 24px",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 16, fontWeight: 500,
                    color: "var(--foreground)", marginBottom: 4,
                  }}
                >
                  Tu Aura Wrapped está por llegar
                </div>
                <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                  Llevas {totalEntries} entradas este mes. Tu aura predomina en violeta y esmeralda.
                </div>
              </div>
              <button
                style={{
                  background: "#8b5cf6", color: "#fff",
                  padding: "8px 18px", borderRadius: 8,
                  fontSize: 12, fontWeight: 500,
                  whiteSpace: "nowrap", border: "none",
                  cursor: "pointer", flexShrink: 0,
                  fontFamily: "inherit",
                  transition: "opacity .2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
              >
                Ver avance →
              </button>
            </div>
          </div>

          {/* Entry feed */}
          <div style={{ padding: "24px 32px 48px", maxWidth: 752 }}>
            {grouped.length === 0 ? (
              <div
                style={{
                  padding: 32, textAlign: "center",
                  border: "1px dashed var(--border)", borderRadius: 12,
                  color: "var(--muted-foreground)", fontSize: 13,
                  fontStyle: "italic", fontFamily: "var(--font-serif)",
                }}
              >
                Sin entradas para este filtro.
              </div>
            ) : (
              grouped.map(([date, entries]) => (
                <div key={date} style={{ marginBottom: 48 }}>
                  {/* Day label */}
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10, letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                      marginBottom: 20, opacity: 0.45,
                      display: "flex", alignItems: "center", gap: 12,
                    }}
                  >
                    {formatDayLabel(date, today)}
                    <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  </div>

                  {entries.map((entry) => (
                    <AuraEntryCard key={`${entry.id}-${entry.time}`} entry={entry} />
                  ))}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

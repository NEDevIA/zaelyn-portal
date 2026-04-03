"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AuraCalendar  from "@/components/aura/AuraCalendar";
import AuraMoodBars  from "@/components/aura/AuraMoodBars";
import AuraStats     from "@/components/aura/AuraStats";
import AuraEntryCard from "@/components/aura/AuraEntryCard";
import { MOODS, type AuraEntry, type MoodKey } from "@/components/aura/auraData";

// ── Types ──────────────────────────────────────────────────────────────────

/** Shape returned by GET /api/modules/journal/entries */
interface RawEntry {
  id: string;
  entry_date: string;        // 'YYYY-MM-DD'
  entry_time: string | null;
  content: string;
  summary: string | null;
  mood_label: string | null; // 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible' | null
  mood_score: number | null;
  ai_feedback: string | null;
  ai_question: string | null;
  topics: string[] | null;
}

interface RawStats {
  entry_count: number;
  streak_current?: number;
  current_streak?: number;
}

interface RawStreak {
  current: number;
  longest: number;
}

// ── mood_label → MoodKey mapping ───────────────────────────────────────────

const MOOD_LABEL_MAP: Record<string, MoodKey> = {
  excellent:  "resonante",
  great:      "celebrando",
  good:       "presente",
  focused:    "enfocada",
  neutral:    "presente",
  okay:       "presente",
  anxious:    "atenta",
  stressed:   "atenta",
  bad:        "atenta",
  sad:        "acompanando",
  terrible:   "acompanando",
  curious:    "curiosa",
  creative:   "curiosa",
  silent:     "silenciosa",
};

function mapMoodLabel(label: string | null): MoodKey {
  if (!label) return "presente";
  return MOOD_LABEL_MAP[label.toLowerCase()] ?? "presente";
}

function formatTime(entry_time: string | null, created_at?: string): string {
  if (entry_time) return entry_time.substring(0, 5); // 'HH:MM'
  if (created_at) {
    const d = new Date(created_at);
    return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return "00:00";
}

function rawToAura(raw: RawEntry & { created_at?: string }): AuraEntry {
  const mood = mapMoodLabel(raw.mood_label);
  const zaelyResponse = raw.ai_feedback
    ? [raw.ai_feedback, raw.ai_question ? `_${raw.ai_question}_` : ""].filter(Boolean).join("\n\n")
    : null;

  return {
    id: 0, // string ids from API — used for keying, not needed as number
    date: raw.entry_date,
    time: formatTime(raw.entry_time, raw.created_at),
    mood,
    content: raw.summary ?? raw.content,
    zaelyResponse,
    connections: [],
  };
}

// ── Date helpers ───────────────────────────────────────────────────────────

const DAYS_ES   = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const MONTHS_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

const FILTERS: { key: "all" | MoodKey; label: string }[] = [
  { key: "all",       label: "Todo"           },
  { key: "resonante", label: "◉ Aura violeta" },
  { key: "atenta",    label: "◉ Aura naranja" },
];

function formatDayLabel(dateStr: string, today: Date): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date     = new Date(y, m - 1, d);
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yestMid  = new Date(todayMid);
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

  const [entries,  setEntries]  = useState<AuraEntry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [streak,   setStreak]   = useState(0);
  const [filter,   setFilter]   = useState<"all" | MoodKey>("all");
  const [search,   setSearch]   = useState("");

  // ── Fetch entries + streak in parallel ────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [entriesRes, streakRes] = await Promise.all([
        fetch("/api/modules/journal/entries?limit=50", { cache: "no-store" }),
        fetch("/api/modules/journal/streak",            { cache: "no-store" }),
      ]);

      if (!entriesRes.ok) throw new Error(`entries: ${entriesRes.status}`);
      const { entries: raw }: { entries: (RawEntry & { created_at?: string })[] } =
        await entriesRes.json();

      setEntries(raw.map(rawToAura));

      if (streakRes.ok) {
        const s: RawStreak = await streakRes.json();
        setStreak(s.current ?? 0);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el diario");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Derived data ──────────────────────────────────────────────────────

  const filtered = useMemo(
    () =>
      entries.filter((e) => {
        if (filter !== "all" && e.mood !== filter) return false;
        if (search && !e.content.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [entries, filter, search],
  );

  const grouped = useMemo(() => {
    const map: Record<string, AuraEntry[]> = {};
    filtered.forEach((e) => { (map[e.date] ??= []).push(e); });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const todayDayName = DAYS_ES[today.getDay()];
  const todayLabel   = `${today.getDate()} de ${MONTHS_ES[today.getMonth()]}`;

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full overflow-hidden">

      {/* ══ LEFT PANEL ══ */}
      <aside
        className="flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ width: 248, borderRight: "1px solid var(--border)", background: "var(--card)" }}
      >
        {/* Panel title */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--foreground)", marginBottom: 3 }}>
            Aura
          </div>
          <div style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase", opacity: 0.45 }}>
            Tu diario · Zaelyn
          </div>
        </div>

        <AuraCalendar entries={entries} today={today} />
        <AuraMoodBars entries={entries} />
        <AuraStats entryCount={entries.length} streak={streak} />
        <div style={{ height: 24 }} />
      </aside>

      {/* ══ RIGHT CONTENT ══ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Sticky sub-header */}
        <header
          className="flex-shrink-0 flex items-center justify-between"
          style={{ padding: "16px 32px", borderBottom: "1px solid var(--border)", background: "var(--background)", backdropFilter: "blur(20px)", zIndex: 10 }}
        >
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em" }}>
            <em style={{ fontStyle: "italic", color: "#a78bfa" }}>
              {todayDayName.charAt(0).toUpperCase() + todayDayName.slice(1)}
            </em>{" "}
            <span style={{ color: "var(--foreground)" }}>{todayLabel}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: "5px 14px", borderRadius: 20, fontSize: 12,
                  border: "1px solid", cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4, transition: "all .2s",
                  borderColor: filter === f.key ? "#8b5cf6" : "var(--border)",
                  background:  filter === f.key ? "#8b5cf6" : "transparent",
                  color:       filter === f.key ? "#fff"    : "var(--muted-foreground)",
                }}
              >
                {f.label}
              </button>
            ))}

            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 12px" }}>
              <span style={{ color: "var(--muted-foreground)", fontSize: 13, opacity: 0.6 }}>⌕</span>
              <input
                type="text"
                placeholder="Buscar en tu diario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--foreground)", fontFamily: "inherit", width: 140 }}
              />
            </div>
          </div>
        </header>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto">

          {/* Wrapped teaser */}
          <div style={{ padding: "24px 32px 0" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,.12),rgba(236,72,153,.08))", border: "1px solid rgba(139,92,246,.2)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 500, color: "var(--foreground)", marginBottom: 4 }}>
                  Tu Aura Wrapped está por llegar
                </div>
                <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                  {loading
                    ? "Cargando tu aura…"
                    : `Llevas ${entries.length} entrada${entries.length !== 1 ? "s" : ""} este mes. Tu aura predomina en ${dominantAuraLabel(entries)}.`}
                </div>
              </div>
              <button
                style={{ background: "#8b5cf6", color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", border: "none", cursor: "pointer", flexShrink: 0, fontFamily: "inherit" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
              >
                Ver avance →
              </button>
            </div>
          </div>

          {/* Feed */}
          <div style={{ padding: "24px 32px 48px", maxWidth: 752 }}>

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: "center", padding: 48, color: "var(--muted-foreground)", opacity: 0.5, fontSize: 13 }}>
                Cargando tu diario…
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div style={{ padding: 24, borderRadius: 12, border: "1px solid rgba(239,68,68,.2)", background: "rgba(239,68,68,.05)", color: "#ef4444", fontSize: 13 }}>
                {error}{" "}
                <button onClick={load} style={{ textDecoration: "underline", cursor: "pointer", background: "none", border: "none", color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}>
                  Reintentar
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && grouped.length === 0 && (
              <div style={{ padding: 32, textAlign: "center", border: "1px dashed var(--border)", borderRadius: 12, color: "var(--muted-foreground)", fontSize: 13, fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                {entries.length === 0
                  ? "Aún no tienes entradas en tu diario. Comparte algo con Zaelyn para empezar."
                  : "Sin entradas para este filtro."}
              </div>
            )}

            {/* Entries */}
            {!loading && !error && grouped.map(([date, dayEntries]) => (
              <div key={date} style={{ marginBottom: 48 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 20, opacity: 0.45, display: "flex", alignItems: "center", gap: 12 }}>
                  {formatDayLabel(date, today)}
                  <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
                </div>
                {dayEntries.map((entry, i) => (
                  <AuraEntryCard key={`${date}-${i}`} entry={entry} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function dominantAuraLabel(entries: AuraEntry[]): string {
  if (!entries.length) return "violeta";
  const counts: Partial<Record<MoodKey, number>> = {};
  entries.forEach((e) => { counts[e.mood] = (counts[e.mood] ?? 0) + 1; });
  const top = (Object.entries(counts) as [MoodKey, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  return top ? (MOODS[top]?.aura.toLowerCase() ?? "violeta") : "violeta";
}

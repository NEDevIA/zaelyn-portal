"use client";

import { useEffect, useState } from "react";
import { MOODS, MOOD_ORDER, AURA_LEGEND, type AuraEntry } from "./auraData";

interface Props {
  entries: AuraEntry[];
}

export default function AuraMoodBars({ entries }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Count per mood
  const counts: Partial<Record<string, number>> = {};
  entries.forEach((e) => {
    counts[e.mood] = (counts[e.mood] ?? 0) + 1;
  });
  const max = Math.max(...(Object.values(counts).filter(Boolean) as number[]), 1);

  return (
    <>
      {/* ── Mood frequency bars ── */}
      <div
        style={{
          padding: 16,
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase",
            color: "var(--muted-foreground)", fontFamily: "var(--font-mono)",
            marginBottom: 12, opacity: 0.55,
          }}
        >
          Tu aura este mes
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {MOOD_ORDER.filter((m) => counts[m]).map((mood, i) => {
            const meta = MOODS[mood];
            const pct  = ((counts[mood] ?? 0) / max) * 100;
            return (
              <div key={mood} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    fontSize: 11, color: "var(--muted-foreground)",
                    width: 80, flexShrink: 0, opacity: 0.8,
                  }}
                >
                  {meta.aura}
                </div>
                <div
                  style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: "var(--border)", overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 2,
                      background: meta.color,
                      width: animated ? `${pct}%` : "0%",
                      transition: `width ${0.8 + i * 0.1}s cubic-bezier(0.16,1,0.3,1)`,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 10, color: "var(--muted-foreground)",
                    fontFamily: "var(--font-mono)", width: 16,
                    textAlign: "right", flexShrink: 0, opacity: 0.5,
                  }}
                >
                  {counts[mood]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Aura colour legend ── */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase",
            color: "var(--muted-foreground)", fontFamily: "var(--font-mono)",
            marginBottom: 10, opacity: 0.55,
          }}
        >
          Colores de tu aura
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          {AURA_LEGEND.map(({ color, label }) => (
            <div
              key={label}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 10, color: "var(--muted-foreground)", opacity: 0.65,
              }}
            >
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: color, flexShrink: 0, display: "inline-block",
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

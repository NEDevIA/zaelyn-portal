"use client";

import { useState } from "react";
import { MOODS, CHIP_STYLES, MOOD_LABEL_STYLES, type AuraEntry } from "./auraData";

interface Props {
  entry: AuraEntry;
}

export default function AuraEntryCard({ entry }: Props) {
  const [expanded, setExpanded] = useState(false);

  const meta       = MOODS[entry.mood] ?? MOODS.presente;
  const labelStyle = MOOD_LABEL_STYLES[entry.mood];

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (entry.zaelyResponse) setExpanded((v) => !v);
  }

  return (
    <article
      style={{
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--card)",
        marginBottom: 14,
        overflow: "hidden",
        cursor: entry.zaelyResponse ? "pointer" : "default",
        transition: "border-color .2s, transform .2s cubic-bezier(0.16,1,0.3,1)",
      }}
      onClick={toggle}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(255,255,255,0.13)";
        el.style.transform   = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--border)";
        el.style.transform   = "";
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "flex-start", gap: 14 }}>
        {/* Mood dot */}
        <div
          style={{
            width: 10, height: 10, borderRadius: "50%",
            background: meta.color, flexShrink: 0, marginTop: 5,
          }}
        />

        <div style={{ flex: 1 }}>
          {/* Time + mood label */}
          <div
            style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              color: "var(--muted-foreground)", letterSpacing: ".06em",
              marginBottom: 6, display: "flex", alignItems: "center", gap: 8,
              opacity: 0.7,
            }}
          >
            {entry.time}
            {entry.isBriefing && " · briefing matutino"}
            {labelStyle && (
              <span
                style={{
                  display: "inline-flex", alignItems: "center",
                  fontSize: 9, padding: "1px 7px", borderRadius: 4,
                  fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase",
                  background: labelStyle.bg,
                  color: labelStyle.color,
                  border: `1px solid ${labelStyle.border}`,
                }}
              >
                {meta.aura}
              </span>
            )}
          </div>

          {/* Entry text */}
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 15, lineHeight: 1.7,
              color: "var(--foreground)",
            }}
          >
            {entry.content}
          </div>

          {/* Zaelyn toggle */}
          {entry.zaelyResponse && (
            <div
              style={{
                marginTop: 12, display: "flex", alignItems: "center", gap: 6,
                fontSize: 11, color: "var(--muted-foreground)",
                cursor: "pointer", width: "fit-content", opacity: 0.65,
                transition: "opacity .2s",
              }}
              onClick={toggle}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "0.65"; }}
            >
              <span
                style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "#a78bfa", flexShrink: 0,
                }}
              />
              {expanded ? "Ocultar respuesta" : "Ver respuesta de Zaelyn"}
            </div>
          )}
        </div>
      </div>

      {/* ── Zaelyn response ── */}
      {entry.zaelyResponse && expanded && (
        <div
          className="fade-in-up"
          style={{
            borderTop: "1px solid var(--border)",
            padding: "14px 22px 14px 46px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)", fontSize: 9, color: "#a78bfa",
              letterSpacing: ".1em", textTransform: "uppercase",
              marginBottom: 8, display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ◈ Zaelyn dice
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 14, lineHeight: 1.75,
              color: "var(--muted-foreground)",
              fontStyle: "italic",
            }}
          >
            {entry.zaelyResponse}
          </div>
        </div>
      )}

      {/* ── Connection chips ── */}
      {entry.connections.length > 0 && (
        <div
          style={{ padding: "10px 22px 14px 46px", display: "flex", gap: 6, flexWrap: "wrap" }}
          onClick={(e) => e.stopPropagation()}
        >
          {entry.connections.map((c, i) => {
            const cs = CHIP_STYLES[c.type];
            return (
              <span
                key={i}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 10, fontFamily: "var(--font-mono)",
                  padding: "3px 8px", borderRadius: 5,
                  background: cs.bg, color: cs.color,
                  border: `1px solid ${cs.border}`,
                }}
              >
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
                {c.label}
              </span>
            );
          })}
        </div>
      )}
    </article>
  );
}

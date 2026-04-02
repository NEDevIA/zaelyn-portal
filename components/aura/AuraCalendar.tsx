"use client";

import { useState } from "react";
import { MOODS, type AuraEntry } from "./auraData";

const DAY_HEADERS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface Props {
  entries: AuraEntry[];
  today: Date;
}

export default function AuraCalendar({ entries, today }: Props) {
  const [activeDay, setActiveDay] = useState(today.getDate());

  const year  = today.getFullYear();
  const month = today.getMonth();
  const monthLabel = `${MONTHS_ES[month]} ${year}`;

  // dominant mood per calendar day (first entry of that day)
  const dayMoods: Record<number, string> = {};
  entries.forEach((e) => {
    const [, m, d] = e.date.split("-").map(Number);
    if (m - 1 === month) {
      if (!dayMoods[d]) dayMoods[d] = e.mood;
    }
  });

  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const offset   = firstDow === 0 ? 6 : firstDow - 1; // Monday-first grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div style={{ padding: "0 16px 16px" }}>
      {/* Month label */}
      <div
        style={{
          fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: ".1em",
          textTransform: "uppercase", color: "var(--muted-foreground)",
          padding: "0 4px", marginBottom: 10, opacity: 0.55,
        }}
      >
        {monthLabel}
      </div>

      {/* Week-day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 5 }}>
        {DAY_HEADERS.map((d) => (
          <span
            key={d}
            style={{
              textAlign: "center", fontSize: 9,
              color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", opacity: 0.45,
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;

          const isToday  = day === today.getDate();
          const isActive = day === activeDay;
          const mood     = dayMoods[day];
          const moodColor = mood ? MOODS[mood as keyof typeof MOODS]?.color : undefined;
          const auraLabel = mood ? MOODS[mood as keyof typeof MOODS]?.aura : undefined;

          return (
            <button
              key={day}
              title={auraLabel}
              onClick={() => setActiveDay(day)}
              style={{
                aspectRatio: "1",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                position: "relative",
                border: "none",
                cursor: "pointer",
                background: isActive ? "#8b5cf6" : "transparent",
                color: isActive
                  ? "#fff"
                  : isToday
                  ? "#a78bfa"
                  : "var(--muted-foreground)",
                fontWeight: isToday && !isActive ? 600 : 400,
                opacity: !mood && !isToday && !isActive ? 0.35 : 1,
                transition: "all .15s",
              }}
            >
              {day}

              {/* Mood-coloured dot */}
              {moodColor && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 3,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isActive ? "#fff" : moodColor,
                    opacity: 0.75,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 138.23

interface Props {
  score: number;        // 0–100
  label: string;        // e.g. "Muy confiable"
  description: string;  // e.g. "12 de 15 compromisos..."
}

export default function OrionScoreRing({ score, label, description }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const targetOffset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div style={{ padding: "14px 20px" }}>
      <div
        style={{
          fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase",
          color: "var(--muted-foreground)", fontFamily: "var(--font-mono)",
          marginBottom: 10, opacity: 0.55,
        }}
      >
        Score de confiabilidad
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* SVG Ring */}
        <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Track */}
            <circle
              cx="28" cy="28" r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="4"
            />
            {/* Progress */}
            <circle
              cx="28" cy="28" r={RADIUS}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={animated ? targetOffset : CIRCUMFERENCE}
              style={{
                transition: animated
                  ? "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)"
                  : "none",
              }}
            />
          </svg>

          {/* Score number */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 400,
              color: "var(--foreground)",
            }}
          >
            {score}%
          </div>
        </div>

        {/* Label */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12, fontWeight: 500, color: "var(--foreground)", marginBottom: 3,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { ORION_AMBER, ORION_RED, ORION_GREEN, ORION_BLUE2, type ViewKey } from "./orionData";

interface SummaryRow {
  key: ViewKey;
  icon: string;
  label: string;
  count: number;
  iconBg: string;
  iconColor: string;
  countColor: string;
}

interface Props {
  activeView: ViewKey;
  overdueCount: number;
  todayCount: number;
  upcomingCount: number;
  doneCount: number;
  commitmentCount: number;
  onViewChange: (v: ViewKey) => void;
}

export default function OrionSummary({
  activeView,
  overdueCount,
  todayCount,
  upcomingCount,
  doneCount,
  commitmentCount,
  onViewChange,
}: Props) {
  const rows: SummaryRow[] = [
    {
      key: "today",
      icon: "⚡",
      label: "Hoy",
      count: todayCount,
      iconBg: "rgba(245,158,11,.12)",
      iconColor: ORION_AMBER,
      countColor: ORION_AMBER,
    },
    {
      key: "overdue",
      icon: "!",
      label: "Vencidas",
      count: overdueCount,
      iconBg: "rgba(239,68,68,.1)",
      iconColor: ORION_RED,
      countColor: ORION_RED,
    },
    {
      key: "commitments",
      icon: "⟳",
      label: "Compromisos",
      count: commitmentCount,
      iconBg: "rgba(139,92,246,.1)",
      iconColor: "#a78bfa",
      countColor: "#a78bfa",
    },
    {
      key: "upcoming",
      icon: "→",
      label: "Próximas",
      count: upcomingCount,
      iconBg: "rgba(59,130,246,.1)",
      iconColor: ORION_BLUE2,
      countColor: "var(--muted-foreground)",
    },
    {
      key: "done",
      icon: "✓",
      label: "Completadas hoy",
      count: doneCount,
      iconBg: "rgba(16,185,129,.1)",
      iconColor: ORION_GREEN,
      countColor: ORION_GREEN,
    },
  ];

  return (
    <div
      style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontSize: 9, fontWeight: 500, letterSpacing: ".12em",
          textTransform: "uppercase", color: "var(--muted-foreground)",
          fontFamily: "var(--font-mono)", marginBottom: 12, opacity: 0.55,
        }}
      >
        Resumen
      </div>

      {rows.map((row) => {
        const isActive = activeView === row.key;
        return (
          <div
            key={row.key}
            onClick={() => onViewChange(row.key)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 9,
              cursor: "pointer", marginBottom: 4,
              background: isActive ? "var(--secondary)" : "transparent",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLDivElement).style.background = "var(--muted)";
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 28, height: 28, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 12,
                background: row.iconBg, color: row.iconColor,
              }}
            >
              {row.icon}
            </div>

            <span
              style={{
                flex: 1, fontSize: 12, color: "var(--foreground)", fontWeight: 400,
              }}
            >
              {row.label}
            </span>

            <span
              style={{
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
                color: row.countColor,
              }}
            >
              {row.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

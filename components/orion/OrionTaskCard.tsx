"use client";

import { dueColor, dueIcon, ORION_GREEN, ORION_RED, type OrionTask } from "./orionData";

interface Props {
  task: OrionTask;
  isDone: boolean;
  onToggle: (id: number) => void;
}

export default function OrionTaskCard({ task, isDone, onToggle }: Props) {
  const barColor    = isDone ? ORION_GREEN : dueColor(task.dueType);
  const dueTextColor = isDone
    ? ORION_GREEN
    : task.dueType === "overdue"
    ? ORION_RED
    : task.dueType === "today"
    ? "#f59e0b"
    : "var(--muted-foreground)";

  return (
    <article
      style={{
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: "var(--card)",
        marginBottom: 6,
        display: "flex",
        alignItems: "flex-start",
        overflow: "hidden",
        cursor: "pointer",
        opacity: isDone ? 0.45 : 1,
        transition: "all .2s cubic-bezier(0.16,1,0.3,1)",
      }}
      onClick={() => onToggle(task.id)}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(255,255,255,0.13)";
        el.style.transform   = "translateX(2px)";
        const actions = el.querySelector<HTMLDivElement>(".orion-task-actions");
        if (actions) actions.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--border)";
        el.style.transform   = "";
        const actions = el.querySelector<HTMLDivElement>(".orion-task-actions");
        if (actions) actions.style.opacity = "0";
      }}
    >
      {/* Left colour bar */}
      <div
        style={{
          width: 3, flexShrink: 0, alignSelf: "stretch",
          background: barColor,
        }}
      />

      {/* Checkbox */}
      <div
        style={{ padding: "12px 10px 12px 14px", flexShrink: 0 }}
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
      >
        <div
          style={{
            width: 18, height: 18, borderRadius: 5,
            border: `1.5px solid ${isDone ? ORION_GREEN : "rgba(255,255,255,0.2)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: isDone ? ORION_GREEN : "transparent",
            flexShrink: 0,
            transition: "all .2s",
          }}
        >
          {isDone && (
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1 }}>
              ✓
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "11px 14px 11px 0" }}>
        <div
          style={{
            fontSize: 13, fontWeight: 400, color: "var(--foreground)",
            marginBottom: 4, lineHeight: 1.4,
            textDecoration: isDone ? "line-through" : "none",
          }}
        >
          {task.title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Due */}
          <span
            style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              color: dueTextColor, opacity: 0.9,
              display: "flex", alignItems: "center", gap: 2,
            }}
          >
            {dueIcon(isDone ? "done" : task.dueType)}
            {task.due}
          </span>

          {/* Task tag */}
          <span
            style={{
              fontSize: 10, padding: "1px 7px", borderRadius: 4, fontWeight: 500,
              background: "rgba(59,130,246,.08)",
              color: "#60a5fa",
              border: "1px solid rgba(59,130,246,.15)",
            }}
          >
            tarea
          </span>

          {/* Urgent tag */}
          {task.urgent && !isDone && (
            <span
              style={{
                fontSize: 10, padding: "1px 7px", borderRadius: 4, fontWeight: 500,
                background: "rgba(239,68,68,.08)",
                color: ORION_RED,
                border: "1px solid rgba(239,68,68,.15)",
              }}
            >
              urgente
            </span>
          )}
        </div>
      </div>

      {/* Hover actions */}
      <div
        className="orion-task-actions"
        style={{
          padding: "8px 12px 8px 0",
          display: "flex", alignItems: "center", gap: 6,
          opacity: 0, transition: "opacity .2s",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {[{ icon: "⏱", title: "Posponer" }, { icon: "✎", title: "Editar" }].map(
          ({ icon, title }) => (
            <button
              key={title}
              title={title}
              style={{
                width: 26, height: 26, borderRadius: 7,
                background: "var(--secondary)",
                border: "1px solid var(--border)",
                color: "var(--muted-foreground)", fontSize: 11,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.13)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
              }}
            >
              {icon}
            </button>
          ),
        )}
      </div>
    </article>
  );
}

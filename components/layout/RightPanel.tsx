"use client";

import { useRightPanelStore } from "@/store/useRightPanelStore";

const MODULE_ACTIONS: Record<string, string[]> = {
  mira:    ["Ver entrada", "Editar"],
  sirius:  ["Ver nodo", "+ Datos"],
  orion:   ["Ver tarea", "Posponer"],
  polaris: ["Ver meta", "Vincular tareas"],
};

export default function RightPanel() {
  const { cards } = useRightPanelStore();

  if (cards.length === 0) return null;

  return (
    <aside
      className="flex-shrink-0 overflow-y-auto"
      style={{
        width: "260px",
        borderLeft: "1px solid var(--border)",
        background: "var(--background)",
        animation: "slideInRight 200ms ease",
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(24px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes cardIn {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>

      <div className="p-4 flex flex-col gap-3">
        <p
          className="text-[10px] font-medium tracking-widest uppercase"
          style={{ color: "var(--muted-foreground)", opacity: 0.4 }}
        >
          Guardado ahora
        </p>

        {cards.map((card, i) => {
          const actions = MODULE_ACTIONS[card.module] ?? ["Ver"];
          return (
            <div
              key={card.id}
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{
                background: `${card.color}08`,
                border: `1px solid ${card.color}22`,
                animation: `cardIn 150ms ease ${i * 60}ms both`,
              }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: card.color }}
                />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: card.color }}
                >
                  {card.label}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {card.lines.map((line, j) => (
                  <p
                    key={j}
                    className="text-[12px] leading-snug"
                    style={{
                      color: "var(--foreground)",
                      opacity: j === 0 ? 0.85 : 0.45,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <div className="flex gap-2">
                {actions.map((action) => (
                  <button
                    key={action}
                    className="text-[11px] px-2.5 py-1 rounded-lg transition-colors duration-100"
                    style={{
                      background: `${card.color}10`,
                      border: `1px solid ${card.color}20`,
                      color: card.color,
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

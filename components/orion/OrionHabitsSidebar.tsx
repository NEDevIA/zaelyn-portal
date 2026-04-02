import { MOCK_HABITS, WEEK_DAYS_SHORT, ORION_GREEN } from "./orionData";

export default function OrionHabitsSidebar() {
  return (
    <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
      <div
        style={{
          fontSize: 9, fontWeight: 500, letterSpacing: ".12em",
          textTransform: "uppercase", color: "var(--muted-foreground)",
          fontFamily: "var(--font-mono)", marginBottom: 12, opacity: 0.55,
        }}
      >
        Hábitos — esta semana
      </div>

      {MOCK_HABITS.map((habit) => {
        const streak = habit.streak;
        return (
          <div key={habit.id} style={{ marginBottom: 12 }}>
            {/* Header */}
            <div
              style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 12, color: "var(--foreground)" }}>
                {habit.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  color: ORION_GREEN, display: "flex", alignItems: "center", gap: 3,
                }}
              >
                🔥 {streak}d
              </span>
            </div>

            {/* Dots */}
            <div style={{ display: "flex", gap: 3 }}>
              {habit.week.map((done, i) => {
                const isToday   = i === 4; // Friday = index 4 (Mon-based)
                const isDone    = done === true;
                const isFuture  = done === null;

                return (
                  <div
                    key={i}
                    title={WEEK_DAYS_SHORT[i]}
                    style={{
                      width: 10, height: 10, borderRadius: 3,
                      cursor: "pointer", transition: "all .2s",
                      background: isDone
                        ? ORION_GREEN
                        : isFuture
                        ? "transparent"
                        : "var(--secondary)",
                      border: isToday
                        ? `1.5px solid ${ORION_GREEN}`
                        : isDone
                        ? `1px solid ${ORION_GREEN}`
                        : "1px solid var(--border)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

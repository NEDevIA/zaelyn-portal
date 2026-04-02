import { MOCK_HABITS, WEEK_DAYS_FULL, ORION_GREEN } from "./orionData";

export default function OrionHabitsMain() {
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Section label */}
      <div
        style={{
          fontSize: 9, fontWeight: 500, letterSpacing: ".12em",
          textTransform: "uppercase", color: "var(--muted-foreground)",
          fontFamily: "var(--font-mono)", marginBottom: 12,
          display: "flex", alignItems: "center", gap: 10, opacity: 0.5,
        }}
      >
        Esta semana
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      {MOCK_HABITS.map((habit) => {
        const doneDays = habit.week.filter((d) => d === true).length;
        const workDays = habit.week.filter((d) => d !== null).length;
        const pct = workDays > 0 ? Math.round((doneDays / workDays) * 100) : 0;

        return (
          <div
            key={habit.id}
            style={{
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              marginBottom: 6,
              display: "flex",
              alignItems: "flex-start",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.13)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateX(2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLDivElement).style.transform = "";
            }}
          >
            {/* Left bar */}
            <div style={{ width: 3, flexShrink: 0, alignSelf: "stretch", background: ORION_GREEN }} />

            {/* Check */}
            <div style={{ padding: "12px 10px 12px 14px", flexShrink: 0 }}>
              <div
                style={{
                  width: 18, height: 18, borderRadius: 5,
                  background: ORION_GREEN, border: `1px solid ${ORION_GREEN}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: "11px 16px 14px 0" }}>
              <div
                style={{ fontSize: 13, fontWeight: 400, color: "var(--foreground)", marginBottom: 6 }}
              >
                {habit.name}
              </div>

              <div
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  flexWrap: "wrap", marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 10,
                    color: ORION_GREEN,
                  }}
                >
                  🔥 {habit.streak} días de racha
                </span>
                <span
                  style={{
                    fontSize: 10, padding: "1px 7px", borderRadius: 4, fontWeight: 500,
                    background: "rgba(16,185,129,.1)", color: "#34d399",
                    border: "1px solid rgba(16,185,129,.15)",
                  }}
                >
                  hábito
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 10,
                    color: "var(--muted-foreground)", opacity: 0.6,
                  }}
                >
                  {pct}% esta semana
                </span>
              </div>

              {/* Week grid */}
              <div style={{ display: "flex", gap: 4 }}>
                {habit.week.map((done, i) => {
                  const isDone   = done === true;
                  const isMissed = done === false;
                  const isFuture = done === null;

                  return (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: 28, height: 28, borderRadius: 6,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, marginBottom: 3,
                          background: isDone
                            ? ORION_GREEN
                            : isFuture
                            ? "transparent"
                            : "var(--secondary)",
                          border: isDone
                            ? `1px solid ${ORION_GREEN}`
                            : isFuture
                            ? "1px solid var(--border)"
                            : "1px solid var(--border)",
                          color: isDone
                            ? "#fff"
                            : isFuture
                            ? "var(--muted-foreground)"
                            : "var(--muted-foreground)",
                          opacity: isFuture ? 0.3 : 1,
                        }}
                      >
                        {isDone ? "✓" : isFuture ? "·" : "×"}
                      </div>
                      <div
                        style={{
                          fontSize: 9, color: "var(--muted-foreground)",
                          fontFamily: "var(--font-mono)", opacity: 0.5,
                        }}
                      >
                        {WEEK_DAYS_FULL[i]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

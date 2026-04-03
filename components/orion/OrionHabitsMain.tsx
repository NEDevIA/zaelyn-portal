import { WEEK_DAYS_FULL, ORION_GREEN, type OrionHabit } from "./orionData";

interface Props {
  habits:     OrionHabit[];
  checkinIds: Set<number>;
  onCheckin:  (id: number) => void;
}

export default function OrionHabitsMain({ habits, checkinIds, onCheckin }: Props) {
  // Which index in the Mon-Sun week array is today?
  const todayDay = new Date().getDay(); // 0=Sun
  const todayIdx = todayDay === 0 ? 6 : todayDay - 1; // 0=Mon … 6=Sun

  // ── Empty state ──────────────────────────────────────────────────────────
  if (habits.length === 0) {
    return (
      <div
        style={{
          padding: 32, textAlign: "center",
          border: "1px dashed var(--border)", borderRadius: 12,
          color: "var(--muted-foreground)", fontSize: 13,
          fontStyle: "italic", fontFamily: "var(--font-serif)",
        }}
      >
        Aún no tienes hábitos.{" "}
        <span style={{ opacity: 0.6 }}>
          Dile a Zaelyn &ldquo;quiero crear un hábito&rdquo; para empezar.
        </span>
      </div>
    );
  }

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

      {habits.map((habit) => {
        // Merge optimistic check-in into the week array
        const week = habit.week.map((v, i) =>
          i === todayIdx && checkinIds.has(habit.id) ? true : v,
        ) as (boolean | null)[];

        const doneDays   = week.filter((d) => d === true).length;
        const workDays   = week.filter((d) => d !== null).length;
        const pct        = workDays > 0 ? Math.round((doneDays / workDays) * 100) : 0;
        const doneToday  = week[todayIdx] === true;

        return (
          <div
            key={String(habit.id)}
            style={{
              borderRadius: 10, border: "1px solid var(--border)",
              background: "var(--card)", marginBottom: 6,
              display: "flex", alignItems: "flex-start",
              overflow: "hidden", transition: "all .2s",
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
            {/* Left accent bar */}
            <div style={{ width: 3, flexShrink: 0, alignSelf: "stretch", background: ORION_GREEN }} />

            {/* Today's check-in button */}
            <div style={{ padding: "12px 10px 12px 14px", flexShrink: 0 }}>
              <button
                onClick={() => !doneToday && onCheckin(habit.id)}
                title={doneToday ? "Completado hoy ✓" : "Marcar como hecho hoy"}
                style={{
                  width: 18, height: 18, borderRadius: 5, padding: 0,
                  background:   doneToday ? ORION_GREEN : "transparent",
                  border:       `1px solid ${doneToday ? ORION_GREEN : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: doneToday ? "default" : "pointer",
                  transition: "all .2s",
                }}
              >
                {doneToday && (
                  <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>
                )}
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: "11px 16px 14px 0" }}>
              <div style={{ fontSize: 13, fontWeight: 400, color: "var(--foreground)", marginBottom: 6 }}>
                {habit.name}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: ORION_GREEN }}>
                  🔥 {habit.streak} días de racha
                </span>
                <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, fontWeight: 500, background: "rgba(16,185,129,.1)", color: "#34d399", border: "1px solid rgba(16,185,129,.15)" }}>
                  hábito
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", opacity: 0.6 }}>
                  {pct}% esta semana
                </span>
              </div>

              {/* Mon–Sun week grid */}
              <div style={{ display: "flex", gap: 4 }}>
                {week.map((done, i) => {
                  const isDone   = done === true;
                  const isFuture = done === null;
                  const isToday  = i === todayIdx;
                  const clickable = isToday && !isDone;

                  return (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div
                        onClick={() => clickable && onCheckin(habit.id)}
                        title={isToday ? (isDone ? "Completado hoy ✓" : "Marcar hoy") : undefined}
                        style={{
                          width: 28, height: 28, borderRadius: 6,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, marginBottom: 3,
                          cursor: clickable ? "pointer" : "default",
                          background: isDone  ? ORION_GREEN : isFuture ? "transparent" : "var(--secondary)",
                          border: isDone
                            ? `1px solid ${ORION_GREEN}`
                            : isToday
                            ? "1px solid rgba(16,185,129,.4)"
                            : "1px solid var(--border)",
                          color: isDone ? "#fff" : "var(--muted-foreground)",
                          opacity: isFuture ? 0.3 : 1,
                          boxShadow: isToday && !isDone ? "0 0 0 2px rgba(16,185,129,.12)" : "none",
                          transition: "all .2s",
                        }}
                      >
                        {isDone ? "✓" : isFuture ? "·" : "×"}
                      </div>
                      <div
                        style={{
                          fontSize: 9, color: "var(--muted-foreground)",
                          fontFamily: "var(--font-mono)",
                          opacity:    isToday ? 0.9 : 0.5,
                          fontWeight: isToday ? 600  : 400,
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

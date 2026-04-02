import { ORION_AMBER, ORION_GREEN, type OrionCommitment } from "./orionData";

interface Props {
  commitment: OrionCommitment;
}

export default function OrionCommitmentCard({ commitment: c }: Props) {
  const isOwe = c.direction === "owe";

  return (
    <div
      style={{
        borderRadius: 10,
        border: "1px solid rgba(139,92,246,.2)",
        background: "rgba(139,92,246,.04)",
        padding: "14px 16px",
        marginBottom: 6,
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: "pointer",
        transition: "all .2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(139,92,246,.35)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateX(2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(139,92,246,.2)";
        (e.currentTarget as HTMLDivElement).style.transform = "";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: "rgba(139,92,246,.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontSize: 14, color: "#a78bfa",
        }}
      >
        {isOwe ? "→" : "←"}
      </div>

      {/* Body */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 13, color: "var(--foreground)", marginBottom: 4, lineHeight: 1.4,
          }}
        >
          {c.title}
        </div>

        <div
          style={{
            fontSize: 11, color: "var(--muted-foreground)",
            display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          }}
        >
          {/* Direction badge */}
          <span
            style={{
              fontSize: 9, padding: "1px 6px", borderRadius: 4,
              fontFamily: "var(--font-mono)", letterSpacing: ".04em",
              background: isOwe ? "rgba(245,158,11,.1)" : "rgba(16,185,129,.1)",
              color: isOwe ? ORION_AMBER : ORION_GREEN,
              fontWeight: 500,
            }}
          >
            {isOwe ? "YO DEBO" : "ME DEBEN"}
          </span>

          <span style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>
            @{c.contact}
          </span>
          <span style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>
            · vence {c.due}
          </span>

          {c.snoozes > 0 && (
            <span
              style={{
                fontSize: 10, color: "var(--muted-foreground)",
                fontFamily: "var(--font-mono)", opacity: 0.5,
              }}
            >
              snooze {c.snoozes}/3
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface Props {
  entryCount: number;
  streak: number;
}

export default function AuraStats({ entryCount, streak }: Props) {
  const stats = [
    { num: entryCount, label: "Entradas"   },
    { num: streak,     label: "Racha días" },
  ];

  return (
    <div style={{ padding: "16px 16px 0", display: "flex", gap: 8 }}>
      {stats.map(({ num, label }) => (
        <div
          key={label}
          style={{
            flex: 1,
            background: "var(--secondary)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 10,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 18, fontWeight: 600,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-serif)",
              lineHeight: 1.2,
            }}
          >
            {num}
          </div>
          <div
            style={{
              fontSize: 9, color: "var(--muted-foreground)",
              textTransform: "uppercase", letterSpacing: ".08em",
              fontFamily: "var(--font-mono)", opacity: 0.55,
              marginTop: 2,
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

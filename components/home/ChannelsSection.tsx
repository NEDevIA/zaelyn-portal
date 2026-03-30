const CHANNELS = [
  {
    name: "Portal web",
    url: "zaelyn.ai",
    status: "Activo",
    statusColor: "#10b981",
    privacy: ["Comfort", "Sovereign", "Phantom", "Full Sovereign"],
    desc: "La experiencia completa. Chat editorial, módulos, Phantom Mode.",
    available: true,
  },
  {
    name: "Telegram",
    status: "Activo",
    statusColor: "#10b981",
    privacy: ["Comfort", "Sovereign"],
    desc: "Captura rápida desde donde estés. Diario, recordatorios y contexto al instante.",
    available: true,
  },
  {
    name: "WhatsApp",
    status: "Fase II",
    statusColor: "#6b7280",
    privacy: ["Comfort"],
    desc: "Próximamente. La misma experiencia donde ya estás.",
    available: false,
  },
  {
    name: "App móvil",
    status: "Roadmap",
    statusColor: "#4b5563",
    privacy: ["Todos"],
    desc: "iOS y Android. Contexto offline, widgets y notificaciones inteligentes.",
    available: false,
  },
];

export default function ChannelsSection() {
  return (
    <section id="canales" className="py-24 px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-14 flex flex-col gap-3">
          <p className="text-[12px] font-medium tracking-widest uppercase" style={{ color: "var(--muted-foreground)" }}>
            Canales
          </p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}>
            Zaelyn donde lo necesitas.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHANNELS.map((ch) => (
            <div
              key={ch.name}
              className="p-5 rounded-xl flex flex-col gap-4 transition-all duration-300"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                opacity: ch.available ? 1 : 0.55,
              }}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-[15px] font-medium" style={{ color: "var(--foreground)" }}>{ch.name}</h3>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${ch.statusColor}15`, color: ch.statusColor }}
                >
                  {ch.status}
                </span>
              </div>

              <p className="text-[13px] leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
                {ch.desc}
              </p>

              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--muted-foreground)", opacity: 0.5 }}>Privacidad disponible</p>
                <div className="flex flex-wrap gap-1">
                  {ch.privacy.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

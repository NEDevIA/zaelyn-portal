const CHANNELS = [
  {
    name: "Portal web",
    url: "zaelyn.ai",
    status: "Activo",
    statusColor: "#10b981",
    privacy: ["Comfort", "Sovereign", "Phantom", "Full Sovereign"],
    desc: "La experiencia completa. Chat editorial, modulos, Phantom Mode.",
    available: true,
  },
  {
    name: "Telegram",
    status: "Activo",
    statusColor: "#10b981",
    privacy: ["Comfort", "Sovereign"],
    desc: "Captura rapida desde donde estes. Diario, recordatorios y contexto al instante.",
    available: true,
  },
  {
    name: "WhatsApp",
    status: "Fase II",
    statusColor: "#6b7280",
    privacy: ["Comfort"],
    desc: "Pronto. La misma experiencia donde ya estas.",
    available: false,
  },
  {
    name: "App movil",
    status: "Roadmap",
    statusColor: "#4b5563",
    privacy: ["Todos"],
    desc: "iOS y Android. Contexto offline, widgets y notificaciones inteligentes.",
    available: false,
  },
];

export default function ChannelsSection() {
  return (
    <section id="canales" className="py-24 px-6" style={{ background: "#080a0d" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-[11px] font-medium tracking-widest uppercase" style={{ color: "rgba(226,228,233,0.25)" }}>
            Canales
          </p>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight" style={{ color: "#e2e4e9", fontFamily: "var(--font-dm-sans)" }}>
            Zaelyn donde necesitas.
          </h2>
        </div>

        {/* Horizontal scroll en mobile, 4 columnas en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHANNELS.map((ch) => (
            <div
              key={ch.name}
              className="p-5 rounded-xl flex flex-col gap-4 transition-all duration-300"
              style={{
                background: "#0f1115",
                border: "1px solid rgba(255,255,255,0.05)",
                opacity: ch.available ? 1 : 0.55,
              }}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-[14px] font-medium" style={{ color: "#e2e4e9" }}>{ch.name}</h3>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: `${ch.statusColor}15`, color: ch.statusColor }}
                >
                  {ch.status}
                </span>
              </div>

              <p className="text-[12px] leading-relaxed flex-1" style={{ color: "rgba(226,228,233,0.4)" }}>
                {ch.desc}
              </p>

              {/* Privacy levels */}
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px]" style={{ color: "rgba(226,228,233,0.2)" }}>Privacidad disponible</p>
                <div className="flex flex-wrap gap-1">
                  {ch.privacy.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(255,255,255,0.04)", color: "rgba(226,228,233,0.35)" }}
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

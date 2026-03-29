"use client";

export default function PrivacySection() {
  const levels = [
    {
      level: 1,
      name: "Comfort",
      desc: "Zaelyn guarda conversaciones y datos de modulos. Maxima inteligencia contextual.",
      color: "#3b82f6",
      tag: "Nivel 1",
    },
    {
      level: 2,
      name: "Sovereign",
      desc: "Sin logs de conversacion. Modulos activos y cifrados. El balance recomendado.",
      color: "#10b981",
      tag: "Recomendado",
      recommended: true,
    },
    {
      level: 3,
      name: "Phantom Mode",
      desc: "Tu identidad se desacopla de la IA. Token anonimo temporal. Nada se escribe bajo tu nombre. Verificable.",
      color: "#8b5cf6",
      tag: "Privacidad maxima",
    },
    {
      level: 4,
      name: "Full Sovereign",
      desc: "Modelo local con Ollama. Solo portal web. Zero telemetria. Tu hardware, tus datos.",
      color: "#6b7280",
      tag: "Fase II",
      disabled: true,
    },
  ];

  return (
    <section id="privacidad" className="py-24 px-6" style={{ background: "#080a0d" }}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header — left aligned (DESIGN_VARIANCE=7, anti-center) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 mb-16">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium tracking-widest uppercase" style={{ color: "rgba(226,228,233,0.25)" }}>
              Privacidad
            </p>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight" style={{ color: "#e2e4e9", fontFamily: "var(--font-dm-sans)" }}>
              Tu decides cuanto sabe.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[14px] leading-relaxed max-w-[48ch]" style={{ color: "rgba(226,228,233,0.45)", fontFamily: "var(--font-dm-sans)" }}>
              Cuatro niveles de privacidad. Cada uno verificable. Sin promesas vacias — con mecanismos tecnicos que puedes auditar.
            </p>
          </div>
        </div>

        {/* Cards — 2x2 grid asimetrico, no 3 columnas (TASTE_SKILL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levels.map((l) => (
            <div
              key={l.level}
              className="relative p-6 rounded-xl transition-all duration-300"
              style={{
                background: l.recommended ? `${l.color}08` : "#0f1115",
                border: l.recommended
                  ? `1px solid ${l.color}25`
                  : "1px solid rgba(255,255,255,0.05)",
                opacity: l.disabled ? 0.5 : 1,
              }}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: `${l.color}15`, color: l.color }}
                >
                  {l.tag}
                </span>
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Nivel {l.level}
                </span>
              </div>

              <h3
                className="text-[16px] font-medium mb-2"
                style={{ color: "#e2e4e9", fontFamily: "var(--font-dm-sans)" }}
              >
                {l.name}
              </h3>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "rgba(226,228,233,0.45)" }}
              >
                {l.desc}
              </p>

              {/* Phantom mode extra detail */}
              {l.level === 3 && (
                <div
                  className="mt-4 pt-4 flex flex-col gap-1.5"
                  style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}
                >
                  {["Token anonimo — nunca almacenas tu user_id", "Sesion de 4h — desaparece al cerrar", "Sub-modos: Puro / Selectivo / Cifrado"].map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 rounded-full flex-shrink-0" style={{ background: "#8b5cf6" }} />
                      <span className="text-[12px]" style={{ color: "rgba(139,92,246,0.8)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lo que prometemos */}
        <div
          className="mt-12 p-6 rounded-xl"
          style={{ background: "#0f1115", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <h3 className="text-[13px] font-medium mb-4" style={{ color: "#e2e4e9" }}>
            Lo que prometemos — sin letra pequeña
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {[
              ["Garantizamos", ["Datos cifrados en reposo (AES-256)", "Sin entrenamiento de modelos con tus datos", "Exportacion completa de tus datos en CSV/JSON", "Borrado verificable de cuenta"]],
              ["No garantizamos", ["Anonimato total en Comfort Mode", "Privacidad fuera del portal web en Fase I", "Modelo local sin conexion (Fase II)"]],
            ].map(([title, items]) => (
              <div key={title as string}>
                <p className="text-[11px] font-medium mb-2" style={{ color: title === "Garantizamos" ? "#10b981" : "rgba(226,228,233,0.3)" }}>
                  {title as string}
                </p>
                <div className="flex flex-col gap-1.5">
                  {(items as string[]).map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="text-[11px] mt-0.5" style={{ color: title === "Garantizamos" ? "#10b981" : "rgba(226,228,233,0.25)" }}>
                        {title === "Garantizamos" ? "+" : "—"}
                      </span>
                      <span className="text-[12px]" style={{ color: "rgba(226,228,233,0.45)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

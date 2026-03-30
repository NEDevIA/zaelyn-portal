"use client";

export default function PrivacySection() {
  const levels = [
    {
      level: 1,
      name: "Comfort",
      desc: "Zaelyn guarda conversaciones y datos de módulos. Máxima inteligencia contextual.",
      color: "#3b82f6",
      tag: "Nivel 1",
    },
    {
      level: 2,
      name: "Sovereign",
      desc: "Sin logs de conversación. Módulos activos y cifrados. El balance recomendado.",
      color: "#10b981",
      tag: "Recomendado",
      recommended: true,
    },
    {
      level: 3,
      name: "Phantom Mode",
      desc: "Tu identidad se desacopla de la IA. Token anónimo temporal. Nada se escribe bajo tu nombre. Verificable.",
      color: "#8b5cf6",
      tag: "Privacidad máxima",
    },
    {
      level: 4,
      name: "Full Sovereign",
      desc: "Modelo local con Ollama. Solo portal web. Zero telemetría. Tu hardware, tus datos.",
      color: "#6b7280",
      tag: "Fase II",
      disabled: true,
    },
  ];

  return (
    <section id="privacidad" className="py-24 px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 mb-16">
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-medium tracking-widest uppercase" style={{ color: "var(--muted-foreground)" }}>
              Privacidad
            </p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}>
              Tú decides cuánto sabe.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[15px] leading-relaxed max-w-[48ch]" style={{ color: "var(--muted-foreground)" }}>
              Cuatro niveles de privacidad. Cada uno verificable. Sin promesas vacías — con mecanismos técnicos que puedes auditar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levels.map((l) => (
            <div
              key={l.level}
              className="relative p-6 rounded-xl transition-all duration-300"
              style={{
                background: l.recommended ? `${l.color}08` : "var(--card)",
                border: l.recommended ? `1px solid ${l.color}30` : "1px solid var(--border)",
                opacity: l.disabled ? 0.5 : 1,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                  style={{ background: `${l.color}15`, color: l.color }}
                >
                  {l.tag}
                </span>
                <span className="text-[12px]" style={{ color: "var(--muted-foreground)", opacity: 0.5 }}>
                  Nivel {l.level}
                </span>
              </div>

              <h3 className="text-[17px] font-medium mb-2" style={{ color: "var(--foreground)" }}>
                {l.name}
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {l.desc}
              </p>

              {l.level === 3 && (
                <div
                  className="mt-4 pt-4 flex flex-col gap-2"
                  style={{ borderTop: "1px solid rgba(139,92,246,0.12)" }}
                >
                  {[
                    "Token anónimo — nunca se almacena tu user_id",
                    "Sesión de 4h — desaparece al cerrar",
                    "Sub-modos: Puro / Selectivo / Cifrado",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0" style={{ background: "#8b5cf6" }} />
                      <span className="text-[13px]" style={{ color: "rgba(139,92,246,0.8)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-12 p-6 rounded-xl"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h3 className="text-[14px] font-medium mb-5" style={{ color: "var(--foreground)" }}>
            Lo que prometemos — sin letra pequeña
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              ["Garantizamos", [
                "Datos cifrados en reposo (AES-256)",
                "Sin entrenamiento de modelos con tus datos",
                "Exportación completa en CSV/JSON",
                "Borrado verificable de cuenta",
              ]],
              ["No garantizamos", [
                "Anonimato total en Comfort Mode",
                "Privacidad fuera del portal web en Fase I",
                "Modelo local sin conexión (Fase II)",
              ]],
            ].map(([title, items]) => (
              <div key={title as string}>
                <p
                  className="text-[12px] font-medium mb-3 uppercase tracking-wide"
                  style={{ color: title === "Garantizamos" ? "#10b981" : "var(--muted-foreground)" }}
                >
                  {title as string}
                </p>
                <div className="flex flex-col gap-2">
                  {(items as string[]).map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span
                        className="text-[12px] mt-0.5 flex-shrink-0"
                        style={{ color: title === "Garantizamos" ? "#10b981" : "var(--muted-foreground)" }}
                      >
                        {title === "Garantizamos" ? "+" : "—"}
                      </span>
                      <span className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>{item}</span>
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

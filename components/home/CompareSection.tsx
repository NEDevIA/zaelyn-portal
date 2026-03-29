type CellVal = boolean | "soon";

const ROWS: { feature: string; zaelyn: CellVal; chatgpt: CellVal; venice: CellVal }[] = [
  { feature: "Memoria persistente de conversaciones",    zaelyn: true,   chatgpt: true,  venice: false },
  { feature: "Sin entrenamiento con tus datos",          zaelyn: true,   chatgpt: false, venice: true  },
  { feature: "Phantom Mode / sesion anonima",            zaelyn: true,   chatgpt: false, venice: false },
  { feature: "Modulos especializados (diario, metas...)",zaelyn: true,   chatgpt: false, venice: false },
  { feature: "Captura por Telegram",                     zaelyn: true,   chatgpt: false, venice: false },
  { feature: "Exportacion completa de datos",            zaelyn: true,   chatgpt: true,  venice: true  },
  { feature: "Modelo local (Ollama / Fase II)",          zaelyn: "soon", chatgpt: false, venice: true  },
  { feature: "Contexto entre sesiones",                  zaelyn: true,   chatgpt: true,  venice: false },
];

function Cell({ val }: { val: boolean | "soon" }) {
  if (val === "soon")
    return <span className="text-[11px]" style={{ color: "#f59e0b" }}>pronto</span>;
  if (val)
    return <span className="text-[13px]" style={{ color: "#10b981" }}>+</span>;
  return <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.15)" }}>—</span>;
}

export default function CompareSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#080a0d" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-[11px] font-medium tracking-widest uppercase" style={{ color: "rgba(226,228,233,0.25)" }}>
            Diferenciacion
          </p>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight" style={{ color: "#e2e4e9", fontFamily: "var(--font-dm-sans)" }}>
            No es otro chatbot.
          </h2>
        </div>

        {/* Cards posicionamiento — ZigZag, no 3-columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {[
            { label: "Ellos guardan historial para entrenar.", counter: "Zaelyn no entrena con tus datos. Nunca." },
            { label: "Ellos no recuerdan el contexto entre apps.", counter: "Zaelyn conecta tu diario, tus metas y tus notas en un solo hilo." },
            { label: "Ellos no tienen modo privado real.", counter: "Phantom Mode: token anonimo, sesion efimera, verificable." },
            { label: "Ellos son una herramienta. Zaelyn es tu segunda mente.", counter: "El contexto eres tu — Zaelyn es el motor que lo conecta." },
          ].map((card) => (
            <div
              key={card.label}
              className="p-5 rounded-xl"
              style={{ background: "#0f1115", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[12px] line-through mb-2" style={{ color: "rgba(226,228,233,0.25)" }}>
                {card.label}
              </p>
              <p className="text-[14px] font-medium" style={{ color: "#e2e4e9" }}>
                {card.counter}
              </p>
            </div>
          ))}
        </div>

        {/* Tabla comparativa */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-[1fr_80px_80px_80px] px-5 py-3"
            style={{ background: "#111418", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-[11px]" style={{ color: "rgba(226,228,233,0.25)" }}>Caracteristica</span>
            {["Zaelyn", "ChatGPT", "Venice"].map((h) => (
              <span key={h} className="text-[11px] text-center font-medium" style={{ color: h === "Zaelyn" ? "#818cf8" : "rgba(226,228,233,0.3)" }}>
                {h}
              </span>
            ))}
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.feature}
              className="grid grid-cols-[1fr_80px_80px_80px] px-5 py-3 items-center"
              style={{
                background: i % 2 === 0 ? "transparent" : "#0f1115",
                borderBottom: i < ROWS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
              }}
            >
              <span className="text-[12px]" style={{ color: "rgba(226,228,233,0.55)" }}>{row.feature}</span>
              <div className="flex justify-center"><Cell val={row.zaelyn} /></div>
              <div className="flex justify-center"><Cell val={row.chatgpt} /></div>
              <div className="flex justify-center"><Cell val={row.venice} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

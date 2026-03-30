type CellVal = boolean | "soon";

const ROWS: { feature: string; zaelyn: CellVal; chatgpt: CellVal; venice: CellVal }[] = [
  { feature: "Memoria persistente de conversaciones",      zaelyn: true,   chatgpt: true,  venice: false },
  { feature: "Sin entrenamiento con tus datos",            zaelyn: true,   chatgpt: false, venice: true  },
  { feature: "Phantom Mode / sesión anónima",              zaelyn: true,   chatgpt: false, venice: false },
  { feature: "Módulos especializados (diario, metas...)",  zaelyn: true,   chatgpt: false, venice: false },
  { feature: "Captura por Telegram",                       zaelyn: true,   chatgpt: false, venice: false },
  { feature: "Exportación completa de datos",              zaelyn: true,   chatgpt: true,  venice: true  },
  { feature: "Modelo local (Ollama / Fase II)",            zaelyn: "soon", chatgpt: false, venice: true  },
  { feature: "Contexto entre sesiones",                    zaelyn: true,   chatgpt: true,  venice: false },
];

function Cell({ val }: { val: CellVal }) {
  if (val === "soon")
    return <span className="text-[11px] font-medium" style={{ color: "#f59e0b" }}>pronto</span>;
  if (val)
    return <span className="text-[14px] font-bold" style={{ color: "#10b981" }}>+</span>;
  return <span className="text-[14px]" style={{ color: "var(--muted-foreground)", opacity: 0.3 }}>—</span>;
}

export default function CompareSection() {
  return (
    <section id="diferenciacion" className="py-24 px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-14 flex flex-col gap-3">
          <p className="text-[12px] font-medium tracking-widest uppercase" style={{ color: "var(--muted-foreground)" }}>
            Diferenciación
          </p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}>
            No es otro chatbot.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {[
            { label: "Ellos guardan historial para entrenar.", counter: "Zaelyn no entrena con tus datos. Nunca." },
            { label: "Ellos no recuerdan el contexto entre apps.", counter: "Zaelyn conecta tu diario, tus metas y tus notas en un solo hilo." },
            { label: "Ellos no tienen modo privado real.", counter: "Phantom Mode: token anónimo, sesión efímera, verificable." },
            { label: "Ellos son una herramienta.", counter: "El contexto eres tú — Zaelyn es el motor que lo conecta." },
          ].map((card) => (
            <div
              key={card.label}
              className="p-5 rounded-xl"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <p className="text-[13px] line-through mb-2" style={{ color: "var(--muted-foreground)", opacity: 0.4 }}>
                {card.label}
              </p>
              <p className="text-[15px] font-medium" style={{ color: "var(--foreground)" }}>
                {card.counter}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="grid grid-cols-[1fr_80px_80px_80px] px-5 py-3.5"
            style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}
          >
            <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>Característica</span>
            {["Zaelyn", "ChatGPT", "Venice"].map((h) => (
              <span key={h} className="text-[12px] text-center font-medium" style={{ color: h === "Zaelyn" ? "#818cf8" : "var(--muted-foreground)" }}>
                {h}
              </span>
            ))}
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.feature}
              className="grid grid-cols-[1fr_80px_80px_80px] px-5 py-3.5 items-center"
              style={{
                background: i % 2 === 0 ? "transparent" : "var(--card)",
                borderBottom: i < ROWS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>{row.feature}</span>
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

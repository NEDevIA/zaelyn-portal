"use client";

import { useState, useEffect, useRef } from "react";

type Chip = { color: string; module: string; detail: string };
type Conversation = {
  id: number;
  user: string;
  ai: string;
  chips?: Chip[];
  phantom?: boolean;
};

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    user: "Anota en mi diario: hoy me peleé con mi pareja pero al final terminamos riendo. Fue un día raro pero bonito.",
    ai: "Guardado. Esos días raros que terminan bien son los que más valen. Ahí va en tu historia.",
    chips: [{ color: "#8b5cf6", module: "Mira", detail: "entrada guardada" }],
  },
  {
    id: 2,
    user: "Recuérdame comprar el pastel de cumpleaños de mi mamá el viernes a las 5pm.",
    ai: "Listo. El viernes a las 5pm te aviso para el pastel. Tu mamá se va a poner feliz.",
    chips: [{ color: "#3b82f6", module: "Orion", detail: "viernes · 5:00 pm" }],
  },
  {
    id: 3,
    user: "Conocí a Carlos Mendoza, médico en Guadalajara. Le interesa mucho la salud mental digital.",
    ai: "Carlos Mendoza guardado con contexto. Médico, Guadalajara, salud mental digital. Lo voy a conectar cuando sea relevante.",
    chips: [{ color: "#7c3aed", module: "Sirius", detail: "Carlos Mendoza" }],
  },
  {
    id: 4,
    user: "Quiero ahorrar 3,000 pesos al mes durante 6 meses. Empieza a registrar desde hoy.",
    ai: "Meta activa. 3,000 al mes por 6 meses: 18,000 en total. Cada semana te ayudo a ver cómo vas.",
    chips: [{ color: "#10b981", module: "Polaris", detail: "meta activa · 6 meses" }],
  },
  {
    id: 5,
    user: "Hoy fui al gym por primera vez en semanas. Conocí a un entrenador buenísimo que se llama Diego. Quiero ir mínimo 3 veces por semana.",
    ai: "Qué buen día para volver. Diego guardado. La meta de 3 veces por semana ya está activa, y tu diario de hoy marca el regreso.",
    chips: [
      { color: "#8b5cf6", module: "Mira", detail: "entrada guardada" },
      { color: "#7c3aed", module: "Sirius", detail: "Diego — entrenador" },
      { color: "#10b981", module: "Polaris", detail: "meta activa" },
    ],
  },
];

const CHAR_DELAY  = 20;
const PAUSE_AFTER = 5000;
const FADE_MS     = 280;

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export default function DemoWindow() {
  const [convIdx, setConvIdx]           = useState(0);
  const [typed, setTyped]               = useState("");
  const [showChips, setShowChips]       = useState(false);
  const [showAI, setShowAI]             = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const cancelRef = useRef(false);

  const conv = CONVERSATIONS[convIdx];

  /* ── Lanzar secuencia limpia por cada conversación ── */
  useEffect(() => {
    cancelRef.current = false;

    async function run() {
      // Reset
      setTyped("");
      setShowChips(false);
      setShowAI(false);
      setContentVisible(true);

      await delay(700);
      if (cancelRef.current) return;

      // Mostrar AI bubble
      setShowAI(true);

      // Typewriter
      const text = CONVERSATIONS[convIdx].ai;
      for (let i = 1; i <= text.length; i++) {
        if (cancelRef.current) return;
        setTyped(text.slice(0, i));
        await delay(CHAR_DELAY);
      }

      if (cancelRef.current) return;
      await delay(200);
      setShowChips(true);

      // Espera antes de rotar
      await delay(PAUSE_AFTER);
      if (cancelRef.current) return;

      // Fade out
      setContentVisible(false);
      await delay(FADE_MS);
      if (cancelRef.current) return;

      // Siguiente conversación
      setConvIdx(prev => (prev + 1) % CONVERSATIONS.length);
    }

    run();

    return () => { cancelRef.current = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convIdx]);

  function jumpTo(i: number) {
    cancelRef.current = true;
    setConvIdx(i);
  }

  return (
    <section
      id="demo"
      className="py-28 px-6"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-3 mb-14 text-center">
          <p
            className="text-[12px] font-medium tracking-widest uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            Cómo funciona
          </p>
          <h2
            className="text-3xl md:text-4xl font-medium tracking-tight"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
          >
            Una conversación cambia todo.
          </h2>
          <p
            className="text-[15px] max-w-[44ch] mx-auto leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Habla normal. Zaelyn entiende lo que quieres decir y lo organiza solo.
          </p>
        </div>

        {/* Ventana centrada */}
        <div className="max-w-[680px] mx-auto">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            }}
          >
            {/* Titlebar */}
            <div
              className="flex items-center gap-3 px-5 py-3.5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex gap-1.5">
                {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.75 }} />
                ))}
              </div>
              <span className="text-[12px] ml-1" style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>
                zaelyn.ai · chat
              </span>
              {conv.chips && (
                <span
                  className="ml-auto text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                  style={{
                    background: `${conv.chips[0].color}15`,
                    color: conv.chips[0].color,
                    border: `1px solid ${conv.chips[0].color}30`,
                  }}
                >
                  {conv.chips.map(c => c.module).join(" + ")}
                </span>
              )}
            </div>

            {/* Content */}
            <div
              className="px-6 py-6 flex flex-col gap-5"
              style={{
                minHeight: "260px",
                opacity: contentVisible ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease`,
              }}
            >
              {/* User message */}
              <div className="flex justify-end">
                <div
                  className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.18)",
                  }}
                >
                  <p
                    className="text-[15px] leading-relaxed text-right"
                    style={{ color: "var(--foreground)", opacity: 0.75, fontFamily: "var(--font-dm-sans)" }}
                  >
                    {conv.user}
                  </p>
                </div>
              </div>

              {/* Zaelyn response */}
              {showAI && (
                <div className="flex gap-3 items-start">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-medium"
                    style={{
                      background: "rgba(139,92,246,0.12)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      color: "#a78bfa",
                    }}
                  >
                    Z
                  </div>

                  <div className="flex flex-col gap-3 flex-1">
                    <p
                      className="text-[17px] leading-relaxed"
                      style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-serif)" }}
                    >
                      {typed}
                      {typed.length < conv.ai.length && (
                        <span className="cursor-blink" />
                      )}
                    </p>

                    {showChips && conv.chips && (
                      <div className="flex flex-wrap gap-2 fade-in-up">
                        {conv.chips.map((chip, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium"
                            style={{
                              background: `${chip.color}15`,
                              border: `1px solid ${chip.color}30`,
                              color: chip.color,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: chip.color }} />
                            {chip.module}
                            <span style={{ opacity: 0.65 }}>— {chip.detail}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Progress dots */}
            <div
              className="flex justify-center gap-2 py-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {CONVERSATIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => jumpTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === convIdx ? "20px" : "6px",
                    height: "6px",
                    background: i === convIdx ? "#6366f1" : "var(--border)",
                  }}
                  aria-label={`Ejemplo ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <p
            className="text-center text-[12px] mt-4"
            style={{ color: "var(--muted-foreground)", opacity: 0.5 }}
          >
            Diario · Recordatorios · Memoria · Metas — todo en una sola conversación
          </p>
        </div>
      </div>
    </section>
  );
}

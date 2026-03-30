"use client";

import { useState, useEffect, useRef } from "react";

type Chip = { color: string; label: string; detail: string };
type RightCard = { module: string; color: string; lines: string[] };
type Conversation = {
  id: number;
  persona: string;
  user: string;
  ai: string;
  chips?: Chip[];
  rightCards?: RightCard[];
  phantom?: boolean;
};

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    persona: "Sabia",
    user: "hoy resolví los últimos bugs de integración. fue un día intenso. también conocí a Roberto Sánchez, inversionista en Monterrey.",
    ai: "Un día que merece estar en tu historia — los bugs que resolviste hoy son lo que hace que todo lo demás funcione. Roberto Sánchez quedó guardado con el contexto de Monterrey.",
    chips: [
      { color: "#8b5cf6", label: "Tu diario", detail: "entrada guardada" },
      { color: "#7c3aed", label: "Tu memoria", detail: "Roberto Sánchez" },
    ],
    rightCards: [
      {
        module: "Tu diario",
        color: "#8b5cf6",
        lines: ["hoy resolví los últimos bugs...", "30 mar · intenso · logro"],
      },
      {
        module: "Tu memoria",
        color: "#7c3aed",
        lines: ["Roberto Sánchez", "Inversionista · Monterrey"],
      },
    ],
  },
  {
    id: 2,
    persona: "Viva",
    user: "quiero lanzar el portal con 50 usuarios beta este trimestre",
    ai: "Meta registrada. Voy a ir conectando lo que hagas en tus tareas con este objetivo para que puedas ver qué porcentaje de tu semana va realmente hacia esto. El 25 de junio es tu fecha.",
    chips: [{ color: "#10b981", label: "Tus metas", detail: "meta activa · 25 jun" }],
    rightCards: [
      {
        module: "Tus metas",
        color: "#10b981",
        lines: ["Portal con 50 usuarios beta", "25 jun · Salud: 100"],
      },
    ],
  },
  {
    id: 3,
    persona: "Lúcida",
    user: "cuáles son mis opciones para la arquitectura de privacidad sin que quede guardado?",
    ai: "En este modo no guardo nada de esta conversación. Al cerrar el tab, desaparece. Para la arquitectura: tienes tres capas — política contractual, token anónimo verificable, y modelo local si quieres la capa criptográfica completa.",
    phantom: true,
  },
];

const CHAR_DELAY  = 22;
const PAUSE_AFTER = 5800;
const FADE_MS     = 300;

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export default function DemoWindow() {
  const [convIdx, setConvIdx]               = useState(0);
  const [typed, setTyped]                   = useState("");
  const [showChips, setShowChips]           = useState(false);
  const [showAI, setShowAI]                 = useState(false);
  const [showPanel, setShowPanel]           = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const cancelRef = useRef(false);

  const conv = CONVERSATIONS[convIdx];

  useEffect(() => {
    cancelRef.current = false;

    async function run() {
      setTyped("");
      setShowChips(false);
      setShowAI(false);
      setShowPanel(false);
      setContentVisible(true);

      await delay(600);
      if (cancelRef.current) return;

      setShowAI(true);

      const text = CONVERSATIONS[convIdx].ai;
      for (let i = 1; i <= text.length; i++) {
        if (cancelRef.current) return;
        setTyped(text.slice(0, i));
        await delay(CHAR_DELAY);
      }

      if (cancelRef.current) return;
      await delay(200);

      if (CONVERSATIONS[convIdx].chips) {
        setShowChips(true);
        await delay(300);
        if (CONVERSATIONS[convIdx].rightCards) setShowPanel(true);
      }

      await delay(PAUSE_AFTER);
      if (cancelRef.current) return;

      setContentVisible(false);
      await delay(FADE_MS);
      if (cancelRef.current) return;

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

  const isPhantom = conv.phantom === true;

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

        {/* Ventana del portal */}
        <div className="max-w-[900px] mx-auto">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--card)",
              border: isPhantom
                ? "1px solid rgba(139,92,246,0.35)"
                : "1px solid var(--border)",
              boxShadow: isPhantom
                ? "0 8px 40px rgba(139,92,246,0.08)"
                : "0 8px 40px rgba(0,0,0,0.10)",
              transition: "border-color 400ms ease, box-shadow 400ms ease",
            }}
          >
            {/* Titlebar */}
            <div
              className="flex items-center gap-3 px-5 py-3.5"
              style={{
                borderBottom: isPhantom
                  ? "1px solid rgba(139,92,246,0.2)"
                  : "1px solid var(--border)",
                background: isPhantom ? "rgba(139,92,246,0.04)" : "transparent",
                transition: "background 400ms ease, border-color 400ms ease",
              }}
            >
              <div className="flex gap-1.5">
                {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
              </div>
              <span className="text-[12px] ml-1" style={{ color: "var(--muted-foreground)", opacity: 0.5 }}>
                zaelyn.ai · chat
              </span>

              <div className="ml-auto flex items-center gap-2">
                {/* PERSONA label */}
                <span
                  className="text-[11px]"
                  style={{ color: "var(--muted-foreground)", opacity: 0.4 }}
                >
                  PERSONA: {conv.persona}
                </span>

                {/* Privacy badge */}
                {isPhantom ? (
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(139,92,246,0.12)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      color: "#a78bfa",
                    }}
                  >
                    <span style={{ fontSize: "9px" }}>◈</span>
                    Phantom
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      color: "#10b981",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
                    Sovereign
                  </span>
                )}
              </div>
            </div>

            {/* Body — chat + panel derecho */}
            <div
              className="flex"
              style={{
                opacity: contentVisible ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease`,
              }}
            >
              {/* Chat principal */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="px-6 py-6 flex flex-col gap-5" style={{ minHeight: "240px" }}>
                  {/* User message */}
                  <div className="flex justify-end">
                    <p
                      className="text-[13px] leading-relaxed text-right max-w-[85%]"
                      style={{
                        color: "var(--muted-foreground)",
                        fontFamily: "var(--font-dm-sans)",
                        fontStyle: "italic",
                        fontWeight: 300,
                      }}
                    >
                      {conv.user}
                    </p>
                  </div>

                  {/* Zaelyn response */}
                  {showAI && (
                    <div className="flex flex-col gap-3">
                      <p
                        className="text-[16px] leading-relaxed"
                        style={{
                          color: "var(--foreground)",
                          fontFamily: "var(--font-dm-serif)",
                        }}
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
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
                              style={{
                                background: `${chip.color}12`,
                                border: `1px solid ${chip.color}28`,
                                color: chip.color,
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: chip.color }} />
                              {chip.label}
                              <span style={{ opacity: 0.6 }}>— {chip.detail}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Composer */}
                <div
                  className="mx-6 mb-5 rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{
                    background: "var(--background)",
                    border: isPhantom
                      ? "1px solid rgba(139,92,246,0.3)"
                      : "1px solid var(--border)",
                    transition: "border-color 400ms ease",
                  }}
                >
                  <span
                    className="text-[13px] flex-1"
                    style={{ color: "var(--muted-foreground)", opacity: 0.45, fontStyle: isPhantom ? "italic" : "normal" }}
                  >
                    {isPhantom
                      ? "Modo Phantom activo ◈ — esta sesión no se guarda..."
                      : "Escribe, pregunta, o piensa en voz alta..."}
                  </span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(99,102,241,0.1)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1l5 5-5 5M1 6h10" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Footer de privacidad */}
                <div
                  className="px-6 pb-4 text-center"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <p
                    className="text-[11px] pt-3"
                    style={{
                      color: isPhantom ? "#a78bfa" : "var(--muted-foreground)",
                      opacity: isPhantom ? 0.7 : 0.35,
                      transition: "color 400ms ease",
                    }}
                  >
                    {isPhantom
                      ? "Phantom activo ◈ — esta sesión no existe en ningún servidor"
                      : "Sovereign — sin logs · zaelyn.ai"}
                  </p>
                </div>
              </div>

              {/* Panel derecho — tarjetas de contexto */}
              {!isPhantom && (
                <div
                  className="hidden md:flex flex-col gap-3 overflow-hidden"
                  style={{
                    width: showPanel ? "240px" : "0px",
                    minWidth: showPanel ? "240px" : "0px",
                    opacity: showPanel ? 1 : 0,
                    transition: "width 250ms ease, min-width 250ms ease, opacity 200ms ease",
                    borderLeft: "1px solid var(--border)",
                    padding: showPanel ? "20px 16px" : "0",
                  }}
                >
                  <p
                    className="text-[10px] font-medium tracking-widest uppercase"
                    style={{ color: "var(--muted-foreground)", opacity: 0.5 }}
                  >
                    Guardado ahora
                  </p>
                  {conv.rightCards?.map((card, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3.5 fade-in-up"
                      style={{
                        background: `${card.color}08`,
                        border: `1px solid ${card.color}20`,
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: card.color }} />
                        <span className="text-[11px] font-medium" style={{ color: card.color }}>
                          {card.module}
                        </span>
                      </div>
                      {card.lines.map((line, j) => (
                        <p
                          key={j}
                          className="text-[12px] leading-snug"
                          style={{
                            color: j === 0 ? "var(--foreground)" : "var(--muted-foreground)",
                            opacity: j === 0 ? 0.8 : 0.5,
                          }}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
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
                    background: i === convIdx
                      ? (CONVERSATIONS[i].phantom ? "#a78bfa" : "#6366f1")
                      : "var(--border)",
                  }}
                  aria-label={`Ejemplo ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <p
            className="text-center text-[12px] mt-4"
            style={{ color: "var(--muted-foreground)", opacity: 0.45 }}
          >
            Diario · Memoria · Metas · Phantom Mode — todo en una sola conversación
          </p>
        </div>
      </div>
    </section>
  );
}

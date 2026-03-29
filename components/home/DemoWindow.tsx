"use client";

import { useState, useEffect, useRef } from "react";

type Chip = { color: string; module: string; detail: string };
type Turn = { role: "user" | "zaelyn"; text: string; chips?: Chip[]; phantomBadge?: boolean };
type Conversation = { id: number; turns: Turn[] };

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    turns: [
      {
        role: "user",
        text: "anota en mi diario: hoy resolvi los bugs de Zaelyn. Y conoce a Roberto Sanchez, inversionista en Monterrey, le intereso mucho el proyecto.",
      },
      {
        role: "zaelyn",
        text: "Hecho. Un dia que merece estar en tu historia — los bugs que resolviste hoy son lo que hace que todo lo demas funcione. Roberto Sanchez quedo guardado con el contexto de Zaelyn y Monterrey.",
        chips: [
          { color: "#8b5cf6", module: "Mira", detail: "entrada guardada" },
          { color: "#7c3aed", module: "Sirius", detail: "Roberto Sanchez" },
        ],
      },
    ],
  },
  {
    id: 2,
    turns: [
      {
        role: "user",
        text: "quiero lanzar Zaelyn con 50 usuarios beta este trimestre",
      },
      {
        role: "zaelyn",
        text: "Meta registrada. Voy a ir conectando lo que hagas en Orion con este objetivo para que puedas ver que porcentaje de tu semana va realmente hacia esto. El 25 de junio es tu fecha.",
        chips: [
          { color: "#10b981", module: "Polaris", detail: "meta activa · 25 jun" },
        ],
      },
    ],
  },
  {
    id: 3,
    turns: [
      {
        role: "user",
        text: "cuales son mis opciones para la arquitectura de privacidad sin que quede guardado?",
        phantomBadge: true,
      },
      {
        role: "zaelyn",
        text: "En este modo no guardo nada de esta conversacion. Al cerrar el tab, desaparece. Para la arquitectura: tienes tres capas — politica contractual, token anonimo verificable, y modelo local con Ollama si quieres la capa criptografica completa.",
      },
    ],
  },
];

const CHAR_DELAY = 28; // ms por caracter
const PAUSE_AFTER = 5800; // ms antes de rotar

export default function DemoWindow() {
  const [convIndex, setConvIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [showChips, setShowChips] = useState(false);
  const [phase, setPhase] = useState<"user" | "typing" | "done" | "fading">("user");
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const conv = CONVERSATIONS[convIndex];
  const userTurn = conv.turns[0];
  const aiTurn = conv.turns[1];

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  useEffect(() => {
    setVisible(true);
    setPhase("user");
    setDisplayedText("");
    setShowChips(false);

    // Mostrar mensaje del usuario → luego typewriter Zaelyn
    clearTimer();
    timerRef.current = setTimeout(() => {
      setPhase("typing");
    }, 900);

    return () => clearTimer();
  }, [convIndex]);

  useEffect(() => {
    if (phase !== "typing") return;
    const fullText = aiTurn.text;
    let i = 0;
    setDisplayedText("");

    function typeNext() {
      i++;
      setDisplayedText(fullText.slice(0, i));
      if (i < fullText.length) {
        timerRef.current = setTimeout(typeNext, CHAR_DELAY);
      } else {
        // Typing done — show chips then wait
        timerRef.current = setTimeout(() => {
          setShowChips(true);
          setPhase("done");
        }, 200);
      }
    }
    timerRef.current = setTimeout(typeNext, CHAR_DELAY);
    return () => clearTimer();
  }, [phase, aiTurn.text]);

  useEffect(() => {
    if (phase !== "done") return;
    timerRef.current = setTimeout(() => {
      setPhase("fading");
      setVisible(false);
      timerRef.current = setTimeout(() => {
        setConvIndex((prev) => (prev + 1) % CONVERSATIONS.length);
      }, 400);
    }, PAUSE_AFTER);
    return () => clearTimer();
  }, [phase]);

  return (
    <section id="demo" className="py-24 px-6" style={{ background: "#080a0d" }}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header de sección */}
        <div className="flex flex-col gap-2 mb-12">
          <p className="text-[11px] font-medium tracking-widest uppercase" style={{ color: "rgba(226,228,233,0.25)" }}>
            Como funciona
          </p>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight" style={{ color: "#e2e4e9", fontFamily: "var(--font-dm-sans)" }}>
            Una conversacion cambia todo.
          </h2>
        </div>

        {/* Ventana de demo */}
        <div className="max-w-[640px]">
          <div
            className="rounded-2xl overflow-hidden transition-opacity duration-400"
            style={{
              background: "#0f1115",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            {/* Titlebar */}
            <div
              className="flex items-center gap-2.5 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
                ))}
              </div>
              <span className="text-[11px] ml-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                zaelyn.ai · chat
              </span>
              {conv.id === 3 && (
                <span
                  className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    color: "#a78bfa",
                  }}
                >
                  Phantom activo
                </span>
              )}
            </div>

            {/* Chat content */}
            <div className="px-5 py-5 min-h-[220px] flex flex-col gap-4">
              {/* User message */}
              <div className="flex justify-end">
                <p
                  className="text-[12px] italic font-light max-w-[85%] text-right leading-relaxed"
                  style={{
                    color: "rgba(226,228,233,0.35)",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {userTurn.text}
                </p>
              </div>

              {/* Zaelyn response */}
              {(phase === "typing" || phase === "done" || phase === "fading") && (
                <div className="flex flex-col gap-3">
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{
                      color: "#e2e4e9",
                      fontFamily: "var(--font-dm-serif)",
                    }}
                  >
                    {displayedText}
                    {phase === "typing" && (
                      <span className="cursor-blink" />
                    )}
                  </p>

                  {/* Chips */}
                  {showChips && aiTurn.chips && aiTurn.chips.length > 0 && (
                    <div
                      className="flex flex-wrap gap-1.5 fade-in-up"
                    >
                      {aiTurn.chips.map((chip, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{
                            background: `${chip.color}14`,
                            border: `1px solid ${chip.color}28`,
                            color: chip.color,
                          }}
                        >
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: chip.color }} />
                          {chip.module}
                          <span style={{ color: `${chip.color}80` }}> — {chip.detail}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Phantom footer note */}
              {conv.id === 3 && phase === "done" && (
                <p
                  className="text-[10px] text-center mt-2 fade-in-up"
                  style={{ color: "rgba(255,255,255,0.15)" }}
                >
                  Phantom Mode activo — esta sesion no existe en ningun servidor
                </p>
              )}
            </div>

            {/* Dots de progreso */}
            <div
              className="flex justify-center gap-1.5 pb-4"
            >
              {CONVERSATIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { clearTimer(); setConvIndex(i); }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === convIndex ? "16px" : "6px",
                    height: "6px",
                    background: i === convIndex ? "#6366f1" : "rgba(255,255,255,0.12)",
                  }}
                  aria-label={`Conversacion ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

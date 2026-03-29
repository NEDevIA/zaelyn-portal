"use client";

import { useState, useEffect, useRef } from "react";

type Chip = { color: string; module: string; detail: string };
type Turn = { role: "user" | "zaelyn"; text: string; chips?: Chip[]; phantom?: boolean };
type Conversation = { id: number; turns: Turn[] };

/* ── 5 ejemplos cotidianos — uno por módulo + uno combinado ── */
const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    turns: [
      {
        role: "user",
        text: "Anota en mi diario: hoy me peleé con mi pareja pero al final terminamos riendo. Fue un día raro pero bonito.",
      },
      {
        role: "zaelyn",
        text: "Guardado. Esos días raros que terminan bien son los que más valen. Ahí va en tu historia.",
        chips: [{ color: "#8b5cf6", module: "Mira", detail: "entrada guardada" }],
      },
    ],
  },
  {
    id: 2,
    turns: [
      {
        role: "user",
        text: "Recuérdame comprar el pastel de cumpleaños de mi mamá el viernes a las 5pm.",
      },
      {
        role: "zaelyn",
        text: "Anotado. El viernes a las 5pm te aviso para el pastel. Tu mamá se va a poner feliz.",
        chips: [{ color: "#3b82f6", module: "Orion", detail: "viernes · 5:00 pm" }],
      },
    ],
  },
  {
    id: 3,
    turns: [
      {
        role: "user",
        text: "Conocí a Carlos Mendoza, médico en Guadalajara. Le interesa mucho la salud mental digital.",
      },
      {
        role: "zaelyn",
        text: "Carlos Mendoza guardado con contexto completo. La próxima vez que hables de salud mental, lo voy a conectar.",
        chips: [{ color: "#7c3aed", module: "Sirius", detail: "Carlos Mendoza" }],
      },
    ],
  },
  {
    id: 4,
    turns: [
      {
        role: "user",
        text: "Quiero ahorrar 3,000 pesos al mes durante 6 meses. Empieza a registrar desde hoy.",
      },
      {
        role: "zaelyn",
        text: "Meta activa. 3,000 al mes por 6 meses: 18,000 en total. Te voy ayudando a ver cómo vas cada semana.",
        chips: [{ color: "#10b981", module: "Polaris", detail: "meta activa · 6 meses" }],
      },
    ],
  },
  {
    id: 5,
    turns: [
      {
        role: "user",
        text: "Hoy fui al gym por primera vez en semanas. Conocí a un entrenador buenísimo que se llama Diego. Quiero ir mínimo 3 veces por semana.",
      },
      {
        role: "zaelyn",
        text: "Qué buen día para volver. Diego guardado como contacto. La meta de 3 veces por semana ya está activa, y tu diario de hoy marca el regreso.",
        chips: [
          { color: "#8b5cf6", module: "Mira", detail: "entrada guardada" },
          { color: "#7c3aed", module: "Sirius", detail: "Diego — entrenador" },
          { color: "#10b981", module: "Polaris", detail: "meta activa" },
        ],
      },
    ],
  },
];

const CHAR_DELAY  = 22;   // ms por caracter
const PAUSE_AFTER = 5500; // ms de pausa al terminar
const FADE_MS     = 320;  // ms de fade entre conversaciones

export default function DemoWindow() {
  const [convIdx, setConvIdx]         = useState(0);
  const [typed, setTyped]             = useState("");
  const [showChips, setShowChips]     = useState(false);
  const [phase, setPhase]             = useState<"user" | "typing" | "done">("user");
  const [contentVisible, setContentVisible] = useState(true);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const conv    = CONVERSATIONS[convIdx];
  const userMsg = conv.turns[0];
  const aiMsg   = conv.turns[1];

  /* ── Resetear al cambiar conversación ── */
  useEffect(() => {
    setPhase("user");
    setTyped("");
    setShowChips(false);
    clear();
    timerRef.current = setTimeout(() => setPhase("typing"), 900);
    return clear;
  }, [convIdx]);

  /* ── Typewriter ── */
  useEffect(() => {
    if (phase !== "typing") return;
    const full = aiMsg.text;
    let i = 0;
    setTyped("");

    function next() {
      i++;
      setTyped(full.slice(0, i));
      if (i < full.length) {
        timerRef.current = setTimeout(next, CHAR_DELAY);
      } else {
        timerRef.current = setTimeout(() => {
          setShowChips(true);
          setPhase("done");
        }, 180);
      }
    }
    timerRef.current = setTimeout(next, CHAR_DELAY);
    return clear;
  }, [phase, aiMsg.text]);

  /* ── Auto-loop: fade content → next conv → fade in ── */
  useEffect(() => {
    if (phase !== "done") return;
    timerRef.current = setTimeout(() => {
      // Fade out content
      setContentVisible(false);
      timerRef.current = setTimeout(() => {
        // Advance to next conversation
        setConvIdx(prev => (prev + 1) % CONVERSATIONS.length);
        // Fade back in immediately after state reset
        timerRef.current = setTimeout(() => setContentVisible(true), 50);
      }, FADE_MS);
    }, PAUSE_AFTER);
    return clear;
  }, [phase]);

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
            className="text-base max-w-[48ch] mx-auto"
            style={{ color: "var(--muted-foreground)" }}
          >
            Habla normal. Zaelyn entiende lo que quieres decir y lo organiza solo.
          </p>
        </div>

        {/* Ventana de demo — centrada */}
        <div className="max-w-[680px] mx-auto">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 32px rgba(0,0,0,0.12)",
            }}
          >
            {/* Titlebar */}
            <div
              className="flex items-center gap-2.5 px-5 py-3.5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex gap-1.5">
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
              </div>
              <span className="text-[11px] ml-2" style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>
                zaelyn.ai · chat
              </span>
              {/* Módulo badge */}
              <span
                className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  color: "#818cf8",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                {conv.turns[1].chips?.[0]?.module ?? "Zaelyn"}
              </span>
            </div>

            {/* Content — fade in/out */}
            <div
              className="px-6 py-6 flex flex-col gap-5"
              style={{
                minHeight: "240px",
                opacity: contentVisible ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease`,
              }}
            >
              {/* User message */}
              <div className="flex justify-end">
                <div
                  className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-right"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.18)",
                  }}
                >
                  <p
                    className="text-[14px] leading-relaxed"
                    style={{
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-dm-sans)",
                    }}
                  >
                    {userMsg.text}
                  </p>
                </div>
              </div>

              {/* Zaelyn response */}
              {(phase === "typing" || phase === "done") && (
                <div className="flex gap-3 items-start">
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-medium"
                    style={{
                      background: "rgba(139,92,246,0.15)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      color: "#a78bfa",
                    }}
                  >
                    Z
                  </div>

                  <div className="flex flex-col gap-3 flex-1">
                    <p
                      className="text-[16px] leading-relaxed"
                      style={{
                        color: "var(--foreground)",
                        fontFamily: "var(--font-dm-serif)",
                      }}
                    >
                      {typed}
                      {phase === "typing" && <span className="cursor-blink" />}
                    </p>

                    {/* Module chips */}
                    {showChips && aiMsg.chips && aiMsg.chips.length > 0 && (
                      <div className="flex flex-wrap gap-2 fade-in-up">
                        {aiMsg.chips.map((chip, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                            style={{
                              background: `${chip.color}18`,
                              border: `1px solid ${chip.color}35`,
                              color: chip.color,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: chip.color }}
                            />
                            {chip.module}
                            <span style={{ color: `${chip.color}90` }}>— {chip.detail}</span>
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
              className="flex justify-center gap-2 pb-5"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div className="flex gap-2 pt-4">
                {CONVERSATIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { clear(); setContentVisible(false); setTimeout(() => { setConvIdx(i); setContentVisible(true); }, FADE_MS); }}
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
          </div>

          {/* Caption debajo */}
          <p
            className="text-center text-[12px] mt-4"
            style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
          >
            Diario · Recordatorios · Memoria · Metas — todo en una sola conversación
          </p>
        </div>
      </div>
    </section>
  );
}

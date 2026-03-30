"use client";

import { useState } from "react";

const PERSONAS = [
  {
    id: "serena",
    name: "Serena",
    tagline: "Presencia tranquila, palabras precisas.",
    description:
      "Directa sin frialdad. Escucha antes de responder. Nunca apresura, nunca dramatiza.",
    example: "¿Por dónde empezamos?",
    accent: "#6366f1",
  },
  {
    id: "viva",
    name: "Viva",
    tagline: "Energía limpia. Momentum.",
    description:
      "Le importa el progreso real. Celebra los avances con la emoción justa — ni más ni menos.",
    example: "Tienes algo importante para hoy. ¿Arrancamos?",
    accent: "#e879f9",
  },
  {
    id: "lucida",
    name: "Lúcida",
    tagline: "Claridad antes que consuelo.",
    description:
      "Analítica, eficiente. Prefiere la verdad útil a la respuesta agradable.",
    example: "Tres cosas pendientes. ¿Cuál primero?",
    accent: "#3b82f6",
  },
  {
    id: "calida",
    name: "Cálida",
    tagline: "Primero la persona, luego la tarea.",
    description:
      "Empática y atenta. Nota cuando algo pesa. No finge que todo es productividad.",
    example: "Bienvenido. ¿Cómo llegas hoy?",
    accent: "#f472b6",
  },
  {
    id: "sabia",
    name: "Sabia",
    tagline: "Ve el patrón completo.",
    description:
      "Conecta lo que dices hoy con lo que dijiste hace meses. Siempre con perspectiva.",
    example: "Aquí estamos de nuevo. ¿Qué mueves hoy?",
    accent: "#10b981",
  },
];

export default function PersonaSection() {
  const [active, setActive] = useState(0);
  const current = PERSONAS[active];

  return (
    <section
      id="personalidad"
      className="py-28 px-6"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Divider */}
        <div className="w-full h-px mb-20" style={{ background: "var(--border)" }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — texto explicativo */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <p
              className="text-[12px] font-medium tracking-widest uppercase"
              style={{ color: "var(--muted-foreground)" }}
            >
              Personalidad adaptativa
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium tracking-tight leading-snug"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
            >
              No es un chatbot.
              <br />
              <span style={{ color: "var(--muted-foreground)" }}>
                Tiene voz propia.
              </span>
            </h2>
            <p
              className="text-[15px] leading-relaxed max-w-[42ch]"
              style={{ color: "var(--muted-foreground)" }}
            >
              Zaelyn adapta su forma de comunicarse a cómo eres tú. Puedes elegir
              la PERSONA que más resuena — y cambiarla cuando quieras.
            </p>

            {/* Preview del ejemplo activo */}
            <div
              className="rounded-xl p-5 mt-2"
              style={{
                background: `${current.accent}08`,
                border: `1px solid ${current.accent}20`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-medium tracking-widest uppercase"
                  style={{ color: current.accent }}
                >
                  {current.name}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--muted-foreground)", opacity: 0.4 }}
                >
                  · primer mensaje del día
                </span>
              </div>
              <p
                className="text-[17px] leading-relaxed"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-dm-serif)",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{current.example}&rdquo;
              </p>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
            >
              La identidad de Zaelyn es la misma en todos los canales. Lo que cambia
              es el tono — como alguien que te conoce bien y sabe cuándo darte espacio
              y cuándo empujarte.
            </p>
          </div>

          {/* Right — cards de personas */}
          <div className="flex flex-col gap-3">
            {PERSONAS.map((persona, i) => (
              <button
                key={persona.id}
                onClick={() => setActive(i)}
                className="w-full text-left rounded-xl p-5 transition-all duration-200"
                style={{
                  background: active === i ? `${persona.accent}08` : "var(--card)",
                  border: active === i
                    ? `1px solid ${persona.accent}30`
                    : "1px solid var(--border)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: persona.accent }}
                      />
                      <span
                        className="text-[14px] font-medium"
                        style={{
                          color: active === i ? persona.accent : "var(--foreground)",
                          transition: "color 200ms ease",
                        }}
                      >
                        {persona.name}
                      </span>
                      <span
                        className="text-[12px]"
                        style={{ color: "var(--muted-foreground)", opacity: 0.55 }}
                      >
                        {persona.tagline}
                      </span>
                    </div>
                    {active === i && (
                      <p
                        className="text-[13px] leading-relaxed pl-[18px] fade-in-up"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {persona.description}
                      </p>
                    )}
                  </div>
                  <span
                    className="text-[11px] mt-0.5 transition-opacity duration-200"
                    style={{
                      color: "var(--muted-foreground)",
                      opacity: active === i ? 0 : 0.3,
                    }}
                  >
                    →
                  </span>
                </div>
              </button>
            ))}

            <p
              className="text-[12px] mt-2 pl-1"
              style={{ color: "var(--muted-foreground)", opacity: 0.4 }}
            >
              Se configura en tu perfil · Se puede cambiar en cualquier momento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

// Shown once per day on first portal session.
// Brief, persona-voiced. Max 2 lines. No chips.

interface DailyGreetingProps {
  persona?: string;
  hasUrgent?: boolean;
}

const GREETING_BY_PERSONA: Record<string, (hasUrgent: boolean) => string> = {
  serena: () => "¿Por dónde empezamos?",
  viva:   (u) => u ? "Tienes algo importante para hoy. ¿Arrancamos?" : "¿Qué construimos hoy?",
  lucida: (u) => u ? "Tres cosas pendientes. ¿Cuál primero?" : "Listo cuando quieras.",
  calida: () => "Bienvenido. ¿Cómo llegas hoy?",
  sabia:  () => "Aquí estamos de nuevo. ¿Qué mueves hoy?",
};

export default function DailyGreeting({ persona = "sabia", hasUrgent = false }: DailyGreetingProps) {
  const key = persona.toLowerCase();
  const fn = GREETING_BY_PERSONA[key] ?? GREETING_BY_PERSONA.sabia;
  const text = fn(hasUrgent);

  return (
    <div
      className="px-6 py-4 max-w-[640px]"
      style={{ opacity: 0, animation: "fadeInUp 0.4s ease 0.05s forwards" }}
    >
      <p
        style={{
          fontFamily: "var(--font-dm-serif)",
          fontSize: "16px",
          lineHeight: "1.75",
          color: "var(--foreground)",
        }}
      >
        {text}
      </p>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

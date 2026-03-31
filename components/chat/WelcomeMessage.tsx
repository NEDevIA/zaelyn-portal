"use client";

// Shown ONCE — the very first time a user opens the portal web.
// Text varies by PERSONA. Falls back to "Sabia" if persona is unknown.

interface WelcomeMessageProps {
  userName?: string;
  persona?: string;
}

const WELCOME_BY_PERSONA: Record<string, (name: string) => string> = {
  serena: (n) =>
    `Bienvenido al portal, ${n}. Aquí tienes más espacio — para leer, explorar y ver todo lo que llevamos juntos. ¿Qué quieres ver primero?`,
  viva: (n) =>
    `${n}, llegaste al portal. Aquí es donde todo se conecta. Tus diarios, tus metas, tu memoria — todo en una sola vista. ¿Empezamos?`,
  lucida: (n) =>
    `Portal activo, ${n}. Tus módulos te esperan. ¿Qué revisamos?`,
  calida: (n) =>
    `${n}. Llevábamos días hablándonos. Ahora tienes un lugar donde ver todo lo que hemos construido juntos. ¿Cómo te sientes hoy?`,
  sabia: (n) =>
    `Aquí está todo, ${n} — lo que has vivido, lo que has guardado, lo que estás construyendo. El portal no es otra pantalla. Es donde se ve el patrón completo. ¿Qué quieres ver?`,
};

export default function WelcomeMessage({ userName = "", persona = "sabia" }: WelcomeMessageProps) {
  const key = persona.toLowerCase();
  const fn = WELCOME_BY_PERSONA[key] ?? WELCOME_BY_PERSONA.sabia;
  const displayName = userName.split(" ")[0] || userName || "tú";
  const text = fn(displayName);

  return (
    <div
      className="px-6 py-5 max-w-[640px]"
      style={{ opacity: 0, animation: "fadeInUp 0.5s ease 0.1s forwards" }}
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

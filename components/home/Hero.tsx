"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Ambient glow — sin neon, sutil */}
      <div
        className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          transform: "translate(-50%, -30%)",
          filter: "blur(40px)",
        }}
      />

      {/* Grid de layout: 55/45, left-aligned (DESIGN_VARIANCE=7) */}
      <div className="max-w-[1400px] mx-auto px-6 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 items-center">

          {/* Columna izquierda — contenido */}
          <div className="flex flex-col gap-8">
            {/* Proof badge */}
            <div className="inline-flex items-center gap-2 w-fit">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#10b981" }}
              />
              <span
                className="text-[11px] font-medium tracking-wide uppercase"
                style={{ color: "#10b981", letterSpacing: "0.08em" }}
              >
                Sin logs · Sin vigilancia · Tu contexto, tu dispositivo
              </span>
            </div>

            {/* Headline — weight + size, no gradient text (TASTE_SKILL) */}
            <div className="flex flex-col gap-3">
              <h1
                className="text-4xl md:text-6xl font-medium tracking-tight leading-none"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
              >
                La IA con la que hablas
                <br />
                <span style={{ color: "var(--muted-foreground)" }}>
                  te conoce de verdad.
                </span>
              </h1>
              <p
                className="text-base leading-relaxed max-w-[52ch]"
                style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-dm-sans)" }}
              >
                Zaelyn recuerda lo que importa, conecta tus ideas
                y crece contigo.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 h-10 px-5 rounded-md text-[14px] font-medium transition-all duration-300"
                style={{
                  background: "#6366f1",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#4f46e5";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#6366f1";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                Empieza a hablar
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center gap-1.5 h-10 px-5 text-[14px] transition-colors duration-200"
                style={{ color: "rgba(226,228,233,0.4)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(226,228,233,0.7)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(226,228,233,0.4)"; }}
              >
                Ver como funciona
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Columna derecha — demo preview (placeholder para DemoWindow) */}
          <div className="hidden lg:block relative">
            {/* Marco del chat — glassmorphism sutil */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 32px rgba(0,0,0,0.08)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Header del chat */}
              <div
                className="flex items-center gap-2.5 px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex gap-1.5">
                  {["#3a3a3a", "#3a3a3a", "#3a3a3a"].map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-[11px] ml-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                  zaelyn.ai · chat
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#10b981" }} />
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>Sovereign</span>
                </div>
              </div>
              {/* Demo content placeholder — se llena desde Hero wrapper */}
              <div id="demo-hero-slot" className="px-4 py-5 min-h-[260px]">
                <HeroMiniDemo />
              </div>
            </div>
            {/* Offset badge — detalles de offset para DESIGN_VARIANCE=7 */}
            <div
              className="absolute -bottom-4 -right-4 px-3 py-1.5 rounded-lg text-[11px]"
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#a78bfa",
              }}
            >
              Phantom Mode disponible
            </div>
          </div>
        </div>
      </div>

      {/* Divider sutil al fondo */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)" }}
      />
    </section>
  );
}

/* Mini demo estático para el hero — typewriter simplificado */
function HeroMiniDemo() {
  return (
    <div className="flex flex-col gap-4">
      {/* User msg */}
      <div className="flex justify-end">
        <p
          className="text-[11px] italic font-light"
          style={{ color: "rgba(226,228,233,0.35)", fontFamily: "var(--font-dm-sans)" }}
        >
          anota en mi diario: hoy resolvi los bugs de Zaelyn
        </p>
      </div>

      {/* Zaelyn response */}
      <div className="flex flex-col gap-3">
        <p
          className="text-[14px] leading-relaxed"
          style={{ color: "#e2e4e9", fontFamily: "var(--font-dm-serif)" }}
        >
          Hecho. Un dia que merece estar en tu historia — los bugs que resolviste hoy son lo que hace que todo lo demas funcione.
        </p>
        {/* Chips */}
        <div className="flex flex-wrap gap-1.5">
          <ModChip color="#8b5cf6" label="Mira" detail="entrada guardada" />
          <ModChip color="#7c3aed" label="Sirius" detail="contexto actualizado" />
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.04)" }} />

      {/* Composer preview */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-[11px] flex-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          Escribe, pregunta, o piensa en voz alta...
        </span>
        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "rgba(99,102,241,0.3)" }}>
          <ArrowRight size={10} color="#818cf8" />
        </div>
      </div>
    </div>
  );
}

function ModChip({ color, label, detail }: { color: string; label: string; detail: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ background: `${color}14`, border: `1px solid ${color}25`, color }}
    >
      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
      {label}
      <span style={{ color: `${color}99` }}> — {detail}</span>
    </span>
  );
}

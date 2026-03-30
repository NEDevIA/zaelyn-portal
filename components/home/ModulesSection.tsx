"use client";

import { MODULES } from "@/lib/modules";

export default function ModulesSection() {
  return (
    <section id="modulos" className="py-24 px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-3">
          <p
            className="text-[12px] font-medium tracking-widest uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            Sistema estelar
          </p>
          <h2
            className="text-3xl md:text-4xl font-medium tracking-tight"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
          >
            Una constelación de módulos inteligentes.
          </h2>
          <p
            className="text-[15px] leading-relaxed max-w-[56ch]"
            style={{ color: "var(--muted-foreground)" }}
          >
            Cada módulo es un portal especializado. Todos conectados entre sí.
            Todos alimentando a Zaelyn con el contexto de tu vida real.
          </p>
        </div>

        {/* Grid de tarjetas — 3 columnas desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod) => (
            <div
              key={mod.id}
              className="relative flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300"
              style={{
                background: mod.disabled ? "var(--card)" : `${mod.color}08`,
                border: `1px solid ${mod.color}${mod.disabled ? "18" : "28"}`,
                opacity: mod.disabled ? 0.65 : 1,
              }}
            >
              {/* Fase II badge */}
              {mod.disabled && (
                <span
                  className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Fase II
                </span>
              )}

              {/* Categoría */}
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: mod.color }}
                />
                <span
                  className="text-[10px] font-medium tracking-widest uppercase"
                  style={{ color: mod.color, opacity: 0.9 }}
                >
                  {mod.category}
                </span>
              </div>

              {/* Nombre */}
              <div className="flex flex-col gap-1">
                <h3
                  className="text-[22px] font-medium leading-none"
                  style={{ color: mod.color, fontFamily: "var(--font-dm-sans)" }}
                >
                  {mod.name}
                </h3>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-dm-mono)", opacity: 0.7 }}
                >
                  {mod.fullName} · zaelyn.ai{mod.route}
                </p>
              </div>

              {/* Descripción */}
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.75 }}
              >
                {mod.description}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-1.5 mt-auto">
                {mod.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span
                      className="mt-[5px] w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: mod.color, opacity: 0.7 }}
                    />
                    <span
                      className="text-[12px] leading-snug"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p
          className="text-center text-[12px] mt-10"
          style={{ color: "var(--muted-foreground)", opacity: 0.5 }}
        >
          Fase I incluye Mira, Sirius, Orion, Polaris, Pulsar y Pléyades · Fase II en desarrollo
        </p>
      </div>
    </section>
  );
}

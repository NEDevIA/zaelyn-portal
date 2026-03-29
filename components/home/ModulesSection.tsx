"use client";

import { MODULES } from "@/lib/modules";

export default function ModulesSection() {
  return (
    <section id="modulos" className="py-24 px-6" style={{ background: "#080a0d" }}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-[11px] font-medium tracking-widest uppercase" style={{ color: "rgba(226,228,233,0.25)" }}>
            Sistema estelar
          </p>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight" style={{ color: "#e2e4e9", fontFamily: "var(--font-dm-sans)" }}>
            Cada modulo, una dimension de ti.
          </h2>
        </div>

        {/* Zig-zag layout — no 3-column cards (TASTE_SKILL Anti-Card Overuse) */}
        <div className="flex flex-col gap-3">
          {MODULES.map((mod, i) => (
            <div
              key={mod.id}
              className="group relative flex flex-col sm:flex-row items-start gap-5 p-5 rounded-xl transition-all duration-300"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = `${mod.color}06`;
                (e.currentTarget as HTMLDivElement).style.borderColor = `${mod.color}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.04)";
              }}
            >
              {/* Index + color dot */}
              <div className="flex items-center gap-3 w-[180px] flex-shrink-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
                  style={{ background: mod.disabled ? "#4b5563" : mod.color }}
                />
                <div>
                  <p className="text-[14px] font-medium" style={{ color: "#e2e4e9" }}>
                    {mod.name}
                  </p>
                  <p className="text-[11px]" style={{ color: "rgba(226,228,233,0.3)" }}>
                    {mod.fullName}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p
                className="flex-1 text-[13px] leading-relaxed"
                style={{ color: "rgba(226,228,233,0.5)" }}
              >
                {mod.description}
              </p>

              {/* Features — visible on hover via Tailwind */}
              <div className="hidden sm:flex flex-wrap gap-1.5 w-[300px] flex-shrink-0">
                {mod.features.map((f) => (
                  <span
                    key={f}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: `${mod.color}10`,
                      color: `${mod.color}cc`,
                      border: `1px solid ${mod.color}1a`,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Phase badge for future modules */}
              {mod.disabled && (
                <span
                  className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)" }}
                >
                  Fase II
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

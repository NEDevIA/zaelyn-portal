"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export default function FooterCTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
  }

  return (
    <section id="beta" className="py-28 px-6" style={{ background: "#080a0d" }}>
      {/* Divider top */}
      <div className="max-w-[1400px] mx-auto">
        <div className="w-full h-px mb-20" style={{ background: "rgba(255,255,255,0.04)" }} />

        {/* Content — left aligned (DESIGN_VARIANCE=7) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          <div className="flex flex-col gap-5">
            <p className="text-[11px] font-medium tracking-widest uppercase" style={{ color: "rgba(226,228,233,0.25)" }}>
              Beta por invitacion
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium tracking-tight leading-tight"
              style={{ color: "#e2e4e9", fontFamily: "var(--font-dm-sans)" }}
            >
              Los primeros usuarios
              <br />
              <span style={{ color: "rgba(226,228,233,0.4)" }}>definen el producto.</span>
            </h2>
            <p className="text-[14px] leading-relaxed max-w-[44ch]" style={{ color: "rgba(226,228,233,0.4)" }}>
              La beta es cerrada. Zaelyn crece contigo — cada decision del producto es informada por usuarios reales, no metricas de vanidad.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {sent ? (
              <div
                className="p-5 rounded-xl"
                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}
              >
                <p className="text-[14px] font-medium mb-1" style={{ color: "#10b981" }}>Listo</p>
                <p className="text-[13px]" style={{ color: "rgba(226,228,233,0.45)" }}>
                  Te avisamos cuando haya cupo.
                </p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <label className="text-[11px]" style={{ color: "rgba(226,228,233,0.35)" }}>
                    Correo para la lista de espera
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="h-10 px-4 rounded-md text-[13px] outline-none transition-all duration-200"
                    style={{
                      background: "#0f1115",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#e2e4e9",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-[13px] font-medium transition-all duration-200"
                    style={{ background: "#6366f1", color: "#ffffff" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#6366f1"; }}
                  >
                    Pedir invitacion beta
                    <ArrowRight size={13} />
                  </button>
                </form>

                <p className="text-[11px] text-center" style={{ color: "rgba(226,228,233,0.2)" }}>
                  o
                </p>

                <Link
                  href="/join"
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md text-[13px] transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(226,228,233,0.5)",
                  }}
                >
                  Tengo un codigo de invitacion
                  <ArrowRight size={13} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

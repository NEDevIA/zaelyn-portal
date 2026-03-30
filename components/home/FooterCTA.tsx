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
    <section id="beta" className="py-28 px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="w-full h-px mb-20" style={{ background: "var(--border)" }} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          <div className="flex flex-col gap-5">
            <p className="text-[12px] font-medium tracking-widest uppercase" style={{ color: "var(--muted-foreground)" }}>
              Beta por invitación
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium tracking-tight leading-tight"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
            >
              Los primeros usuarios
              <br />
              <span style={{ color: "var(--muted-foreground)" }}>definen el producto.</span>
            </h2>
            <p className="text-[15px] leading-relaxed max-w-[44ch]" style={{ color: "var(--muted-foreground)" }}>
              La beta es cerrada. Zaelyn crece contigo — cada decisión del producto es informada por usuarios reales, no métricas de vanidad.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {sent ? (
              <div
                className="p-5 rounded-xl"
                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                <p className="text-[15px] font-medium mb-1" style={{ color: "#10b981" }}>Listo</p>
                <p className="text-[14px]" style={{ color: "var(--muted-foreground)" }}>
                  Te avisamos cuando haya cupo.
                </p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <label className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                    Correo para la lista de espera
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="h-11 px-4 rounded-md text-[14px] outline-none transition-all duration-200"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md text-[14px] font-medium transition-all duration-200"
                    style={{ background: "#6366f1", color: "#ffffff" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#6366f1"; }}
                  >
                    Pedir invitación beta
                    <ArrowRight size={14} />
                  </button>
                </form>

                <p className="text-[12px] text-center" style={{ color: "var(--muted-foreground)", opacity: 0.4 }}>o</p>

                <Link
                  href="/join"
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-md text-[14px] transition-all duration-200"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Tengo un código de invitación
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

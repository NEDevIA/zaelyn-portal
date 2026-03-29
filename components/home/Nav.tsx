"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, List } from "@phosphor-icons/react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080a0d]/90 backdrop-blur-md border-b border-white/[0.04]"
          : "bg-transparent"
      }`}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="text-[15px] font-medium tracking-tight text-white/90">
            <span style={{ color: "#8b5cf6" }}>Zae</span>lyn
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Privacidad", href: "#privacidad" },
            { label: "Modulos", href: "#modulos" },
            { label: "Canales", href: "#canales" },
            { label: "Beta", href: "#beta" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] text-white/40 hover:text-white/80 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:inline-flex h-8 px-4 rounded-md text-[13px] font-medium items-center transition-all duration-200"
            style={{
              background: "rgba(99,102,241,0.12)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.12)";
            }}
          >
            Entrar
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white/50 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0f1115]/95 backdrop-blur-md border-b border-white/[0.04] px-6 py-4 flex flex-col gap-4">
          {[
            { label: "Privacidad", href: "#privacidad" },
            { label: "Modulos", href: "#modulos" },
            { label: "Canales", href: "#canales" },
            { label: "Beta", href: "#beta" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-[14px] text-white/50 hover:text-white/80 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/login"
            className="inline-flex h-9 px-4 rounded-md text-[13px] font-medium items-center justify-center w-full"
            style={{
              background: "rgba(99,102,241,0.12)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            Entrar
          </Link>
        </div>
      )}
    </header>
  );
}

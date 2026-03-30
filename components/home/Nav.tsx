"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, List, Sun, Moon } from "@phosphor-icons/react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Sync with actual HTML class after hydration
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("zaelyn-theme", next ? "dark" : "light"); } catch {}
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "dark:bg-[#080a0d]/90 bg-white/90 backdrop-blur-md dark:border-b dark:border-white/[0.04] border-b border-black/[0.06]"
          : "bg-transparent"
      }`}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo — solo "ae" resaltado */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="text-[22px] font-medium tracking-tight dark:text-white/90 text-gray-900">
            Z<span style={{ color: "#8b5cf6" }}>ae</span>lyn
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Privacidad", href: "#privacidad" },
            { label: "Módulos", href: "#modulos" },
            { label: "Canales", href: "#canales" },
            { label: "Beta", href: "#beta" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] dark:text-white/40 text-gray-500 dark:hover:text-white/80 hover:text-gray-900 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA + Theme toggle */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-200 dark:text-white/40 dark:hover:text-white/80 text-gray-400 hover:text-gray-700"
            aria-label={isDark ? "Modo día" : "Modo noche"}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

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
            className="md:hidden dark:text-white/50 dark:hover:text-white text-gray-500 hover:text-gray-900 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden dark:bg-[#0f1115]/95 bg-white/95 backdrop-blur-md dark:border-b dark:border-white/[0.04] border-b border-black/[0.06] px-6 py-4 flex flex-col gap-4">
          {[
            { label: "Privacidad", href: "#privacidad" },
            { label: "Módulos", href: "#modulos" },
            { label: "Canales", href: "#canales" },
            { label: "Beta", href: "#beta" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-[14px] dark:text-white/50 dark:hover:text-white/80 text-gray-500 hover:text-gray-900 transition-colors"
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

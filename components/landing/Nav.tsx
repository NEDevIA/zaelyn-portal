"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LandingLang } from "@/lib/landing-i18n";
import { useLandingT } from "@/lib/landing-i18n";

interface NavProps {
  lang: LandingLang;
  onLangChange: (l: LandingLang) => void;
}

export default function Nav({ lang, onLangChange }: NavProps) {
  const t = useLandingT(lang);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("zae-theme") as "dark" | "light" | null;
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(saved ?? (sys ? "dark" : "light"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("zae-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, height: "64px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 48px",
    background: scrolled ? "var(--l-nav-bg)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled ? "1px solid var(--l-border)" : "none",
    zIndex: 100,
    transition: "background 0.3s, border-color 0.3s",
    fontFamily: "var(--font-dm-sans)",
  };

  return (
    <nav style={navStyle}>
      <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        {theme === "dark" ? (
          <Image src="/logo-dark.jpeg" alt="Zaelyn" height={32} width={120} style={{ height: "32px", width: "auto", objectFit: "contain" }} />
        ) : (
          <Image src="/logo-light.jpeg" alt="Zaelyn" height={32} width={120} style={{ height: "32px", width: "auto", objectFit: "contain", filter: "brightness(0.85)" }} />
        )}
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {(["como-funciona", "modulos", "privacidad", "planes"] as const).map((id, i) => {
          const keys = ["nav.how", "nav.modules", "nav.privacy", "nav.pricing"];
          return (
            <a key={id} href={`#${id}`} style={{
              padding: "7px 13px", borderRadius: "8px", fontSize: "14px",
              color: "var(--l-text2)", textDecoration: "none", cursor: "pointer",
              transition: "all .15s", border: "none", background: "none",
              fontFamily: "var(--font-dm-sans)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--l-text)"; (e.currentTarget as HTMLAnchorElement).style.background = "var(--l-surface)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--l-text2)"; (e.currentTarget as HTMLAnchorElement).style.background = "none"; }}
            >
              {t(keys[i]!)}
            </a>
          );
        })}

        <div style={{ width: "1px", height: "20px", background: "var(--l-border)", margin: "0 4px" }} />

        {(["es", "en", "pt"] as LandingLang[]).map((l) => (
          <button key={l} onClick={() => onLangChange(l)} style={{
            padding: "5px 10px", borderRadius: "7px", fontSize: "12px",
            fontFamily: "var(--font-jetbrains)", border: `1px solid ${lang === l ? "var(--l-border2)" : "var(--l-border)"}`,
            background: lang === l ? "var(--l-surface)" : "none",
            color: lang === l ? "var(--l-text)" : "var(--l-text2)",
            cursor: "pointer", transition: "all .15s",
          }}>
            {l.toUpperCase()}
          </button>
        ))}

        <button onClick={toggleTheme} style={{
          width: "34px", height: "34px", borderRadius: "9px",
          border: "1px solid var(--l-border)", background: "var(--l-surface)",
          color: "var(--l-text2)", fontSize: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all .2s",
        }}>
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        <Link href="/join" style={{
          padding: "9px 20px", borderRadius: "9px",
          background: "linear-gradient(135deg, var(--z-violet), var(--z-cyan))",
          color: "#fff", fontSize: "14px", fontWeight: 600,
          textDecoration: "none", fontFamily: "var(--font-syne)",
          transition: "all .2s", boxShadow: "0 0 24px rgba(155,127,232,.3)",
        }}>
          {t("nav.cta")}
        </Link>
      </div>
    </nav>
  );
}

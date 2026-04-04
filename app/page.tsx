"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Modules from "@/components/landing/Modules";
import Privacy from "@/components/landing/Privacy";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import type { LandingLang } from "@/lib/landing-i18n";

export default function LandingPage() {
  const [lang, setLang] = useState<LandingLang>("es");
  const containerRef = useRef<HTMLDivElement>(null);

  // Init lang from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("zae-lang") as LandingLang | null;
    if (saved && ["es","en","pt"].includes(saved)) setLang(saved);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const targets = el.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), (i % 4) * 70);
          }
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  function handleLangChange(l: LandingLang) {
    setLang(l);
    localStorage.setItem("zae-lang", l);
  }

  return (
    <div ref={containerRef} style={{ background: "var(--l-bg)", color: "var(--l-text)", minHeight: "100vh" }}>
      <Nav lang={lang} onLangChange={handleLangChange} />
      <Hero lang={lang} />
      <HowItWorks lang={lang} />
      <Modules lang={lang} />
      <Privacy lang={lang} />
      <Pricing lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}

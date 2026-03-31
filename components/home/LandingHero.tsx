"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";

export default function LandingHero() {
  const { lang } = useLanguageStore();
  const t = T[lang];

  return (
    <div className="hero">
      <div className="stars" />
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="hero-eyebrow fade-up">
          <span className="eyebrow-dot" />
          <span>{t.hero_eyebrow}</span>
        </div>
        <h1
          className="fade-up-2"
          dangerouslySetInnerHTML={{ __html: t.hero_h1 }}
        />
        <p className="hero-sub fade-up-3">{t.hero_sub}</p>
        <div className="hero-ctas fade-up-4">
          <Link href="/login" className="btn-primary">
            {t.hero_cta1}
          </Link>
          <a
            href="#demo"
            className="btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {t.hero_cta2}
          </a>
        </div>
        <div className="hero-proof fade-up-4">
          <span className="proof-dot" />
          <span>{t.hero_proof}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export default function LandingNav() {
  const { lang, setLang } = useLanguageStore();
  const t = T[lang];

  return (
    <nav>
      <Link href="/" className="nav-logo">
        Z<span>ae</span>lyn
      </Link>
      <div className="nav-links">
        <a href="#idiomas">{t.nav_lang}</a>
        <a href="#privacidad">{t.nav_privacy}</a>
        <a href="#modulos">{t.nav_modules}</a>
        <a href="#canales">{t.nav_channels}</a>
      </div>
      <div className="nav-right">
        <div className="lang-toggle">
          {(["es", "en", "pt"] as Lang[]).map((l) => (
            <button
              key={l}
              className={`lang-btn${lang === l ? " active" : ""}`}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <Link href="/login" className="nav-cta">
          {t.nav_cta}
        </Link>
      </div>
    </nav>
  );
}

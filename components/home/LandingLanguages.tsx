"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";

export default function LandingLanguages() {
  const { lang } = useLanguageStore();
  const t = T[lang];

  return (
    <div className="lang-section" id="idiomas">
      <div>
        <div className="section-eyebrow">{t.lang_eyebrow}</div>
        <h2 dangerouslySetInnerHTML={{ __html: t.lang_h2 }} />
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          {t.lang_sub}
        </p>
        <div className="lang-pills">
          <div className="lang-pill">
            <span className="lang-pill-icon">🇺🇸</span>
            <span className="lang-pill-label">English</span>
            <span className="lang-pill-sub">· Native</span>
          </div>
          <div className="lang-pill">
            <span className="lang-pill-icon">🇲🇽</span>
            <span className="lang-pill-label">Español</span>
            <span className="lang-pill-sub">· Nativo</span>
          </div>
          <div className="lang-pill">
            <span className="lang-pill-icon">🇧🇷</span>
            <span className="lang-pill-label">Português</span>
            <span className="lang-pill-sub">· Nativo</span>
          </div>
        </div>
      </div>
      <div className="lang-quote">
        <span dangerouslySetInnerHTML={{ __html: t.lang_quote }} />
        <span className="lang-quote-attr">{t.lang_quote_attr}</span>
      </div>
    </div>
  );
}

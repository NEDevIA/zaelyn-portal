"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";

export default function LandingFooter() {
  const { lang } = useLanguageStore();
  const t = T[lang];

  return (
    <>
      <div className="footer-cta">
        <div className="section-eyebrow" style={{ display: "flex", justifyContent: "center" }}>
          {t.ftcta_eyebrow}
        </div>
        <h2
          style={{ marginBottom: 16 }}
          dangerouslySetInnerHTML={{ __html: t.ftcta_h2 }}
        />
        <p style={{ color: "var(--text2)", maxWidth: 420, margin: "0 auto 36px", textAlign: "center", fontSize: 15, lineHeight: 1.7 }}>
          {t.ftcta_sub}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" className="btn-primary">{t.ftcta_btn1}</Link>
          <button className="btn-secondary">{t.ftcta_btn2}</button>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-brand">
          <div className="footer-brand-main">{t.footer_brand_main}</div>
          <div className="footer-brand-sub">
            NE America · Houston, TX &amp; NE México · Monterrey / Chihuahua · 2026
          </div>
        </div>
        <div className="footer-links">
          <a href="#privacidad">{t.footer_priv}</a>
          <a href="#">{t.footer_terms}</a>
          <a href="#" style={{ color: "var(--text3)" }}>zaera.ai</a>
        </div>
      </div>
    </>
  );
}

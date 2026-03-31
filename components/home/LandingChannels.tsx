"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";

export default function LandingChannels() {
  const { lang } = useLanguageStore();
  const t = T[lang];

  return (
    <section id="canales">
      <div className="section-eyebrow">{t.ch_eyebrow}</div>
      <h2 dangerouslySetInnerHTML={{ __html: t.ch_h2 }} />
      <p className="section-sub">{t.ch_sub}</p>
      <div className="channels-grid">
        {/* Portal Web */}
        <div className="ch-card">
          <div className="ch-icon" style={{ background: "rgba(99,102,241,0.12)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <div className="ch-name">{t.ch1_name}</div>
          <div className="ch-status" style={{ color: "var(--green)" }}>● <span>{t.ch1_status}</span></div>
          <div className="ch-items">
            <div className="ch-item"><span className="cy">✓</span><span>{t.ch1_f1}</span></div>
            <div className="ch-item"><span className="cy">✓</span><span>{t.ch1_f2}</span></div>
            <div className="ch-item"><span className="cy">✓</span><span>{t.ch1_f3}</span></div>
          </div>
        </div>
        {/* Telegram */}
        <div className="ch-card">
          <div className="ch-icon" style={{ background: "rgba(42,171,238,0.12)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2AABEE" strokeWidth="1.5">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22 11 13 2 9l20-7z" />
            </svg>
          </div>
          <div className="ch-name">Telegram</div>
          <div className="ch-status" style={{ color: "var(--green)" }}>● <span>{t.ch2_status}</span></div>
          <div className="ch-items">
            <div className="ch-item"><span className="cy">✓</span><span>{t.ch2_f1}</span></div>
            <div className="ch-item"><span className="cy">✓</span><span>{t.ch2_f2}</span></div>
            <div className="ch-item"><span className="cy">✓</span><span>{t.ch2_f3}</span></div>
          </div>
        </div>
        {/* WhatsApp */}
        <div className="ch-card">
          <div className="ch-icon" style={{ background: "rgba(37,211,102,0.1)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="ch-name">WhatsApp</div>
          <div className="ch-status" style={{ color: "var(--amber)" }}>● <span>{t.ch3_status}</span></div>
          <div className="ch-items">
            <div className="ch-item"><span className="cy">✓</span><span>{t.ch3_f1}</span></div>
            <div className="ch-item"><span className="cp">~</span><span>{t.ch3_f2}</span></div>
          </div>
        </div>
        {/* App móvil */}
        <div className="ch-card">
          <div className="ch-icon" style={{ background: "rgba(217,119,6,0.1)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <div className="ch-name">{t.ch4_name}</div>
          <div className="ch-status" style={{ color: "var(--text3)" }}>● <span>{t.ch4_status}</span></div>
          <div className="ch-items">
            <div className="ch-item"><span className="cy">✓</span><span>{t.ch4_f1}</span></div>
            <div className="ch-item"><span className="cy">✓</span><span>{t.ch4_f2}</span></div>
          </div>
        </div>
      </div>
      <div style={{ padding: "18px 22px", borderRadius: 12, border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.04)" }}>
        <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, marginBottom: 5 }}>{t.ch_unify_title}</p>
        <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{t.ch_unify_desc}</p>
      </div>
    </section>
  );
}

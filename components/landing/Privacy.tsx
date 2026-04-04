"use client";
import type { LandingLang } from "@/lib/landing-i18n";
import { useLandingT } from "@/lib/landing-i18n";

const MODES = [
  { icon: "☁️", name: "Comfort", badgeKey: "priv.c.badge", descKey: "priv.c.desc", bullets: ["priv.c.b1","priv.c.b2","priv.c.b3"], bg: "rgba(52,211,153,.1)", badgeBg: "rgba(52,211,153,.1)", badgeColor: "#34D399", badgeBorder: "rgba(52,211,153,.2)" },
  { icon: "🌊", name: "Sovereign", badgeKey: "priv.s.badge", descKey: "priv.s.desc", bullets: ["priv.s.b1","priv.s.b2","priv.s.b3"], bg: "rgba(96,165,250,.08)", badgeBg: "rgba(96,165,250,.1)", badgeColor: "var(--orion)", badgeBorder: "rgba(96,165,250,.2)" },
  { icon: "👻", name: "Phantom", badgeKey: "priv.p.badge", descKey: "priv.p.desc", bullets: ["priv.p.b1","priv.p.b2","priv.p.b3"], bg: "rgba(155,127,232,.08)", badgeBg: "rgba(155,127,232,.1)", badgeColor: "var(--z-violet)", badgeBorder: "rgba(155,127,232,.2)" },
  { icon: "🔒", name: "Full Sovereign", badgeKey: "priv.f.badge", descKey: "priv.f.desc", bullets: ["priv.f.b1","priv.f.b2","priv.f.b3"], bg: "rgba(232,121,249,.07)", badgeBg: "rgba(232,121,249,.1)", badgeColor: "var(--z-magenta)", badgeBorder: "rgba(232,121,249,.2)" },
];

export default function Privacy({ lang }: { lang: LandingLang }) {
  const t = useLandingT(lang);

  return (
    <section id="privacidad" style={{ background: "var(--l-bg)", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: "11px", color: "var(--z-violet)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>{t("priv.label")}</p>
        <h2 className="reveal" style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, color: "var(--l-text)", textAlign: "center", marginBottom: "16px" }}>{t("priv.title")}</h2>
        <p className="reveal" style={{ textAlign: "center", color: "var(--l-text2)", fontSize: "17px", maxWidth: "600px", margin: "0 auto 32px", fontFamily: "var(--font-dm-sans)" }}>{t("priv.sub")}</p>

        {/* Beta notice */}
        <div className="reveal" style={{
          margin: "0 auto 40px", maxWidth: "760px",
          background: "rgba(155,127,232,.08)", border: "1px solid rgba(155,127,232,.25)",
          borderRadius: "12px", padding: "16px 22px",
          display: "flex", alignItems: "flex-start", gap: "12px",
        }}>
          <span style={{ fontSize: "20px", flexShrink: 0 }}>👻</span>
          <div>
            <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "14px", color: "var(--z-violet)", marginBottom: "6px" }}>{t("priv.beta.title")}</div>
            <div style={{ fontSize: "13px", color: "var(--l-text2)", lineHeight: 1.6, fontFamily: "var(--font-dm-sans)" }}>{t("priv.beta.desc")}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {MODES.map((mode) => (
            <div key={mode.name} className="reveal" style={{
              padding: "24px", borderRadius: "16px",
              background: mode.bg, border: "1px solid var(--l-border)",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{mode.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "17px", color: "var(--l-text)" }}>{mode.name}</span>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: mode.badgeBg, color: mode.badgeColor, border: `1px solid ${mode.badgeBorder}`, fontFamily: "var(--font-jetbrains)" }}>{t(mode.badgeKey)}</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--l-text2)", lineHeight: 1.7, marginBottom: "16px", fontFamily: "var(--font-dm-sans)" }}>{t(mode.descKey)}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {mode.bullets.map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--l-text2)", fontFamily: "var(--font-dm-sans)" }}>
                    <span style={{ color: mode.badgeColor, flexShrink: 0 }}>✓</span>
                    {t(b)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import type { LandingLang } from "@/lib/landing-i18n";
import { useLandingT } from "@/lib/landing-i18n";

const MODULES = [
  { id: "aura", icon: "🌸", color: "var(--aura)", bgA: "rgba(244,114,182,.08)", bgB: "rgba(244,114,182,.3)", live: true, subKey: "aura.sub", descKey: "aura.desc", feats: ["aura.f1","aura.f2","aura.f3","aura.f4"], tags: ["diario","emociones","reflexión","patrones"] },
  { id: "orion", icon: "⚡", color: "var(--orion)", bgA: "rgba(96,165,250,.08)", bgB: "rgba(96,165,250,.3)", live: true, subKey: "orion.sub", descKey: "orion.desc", feats: ["orion.f1","orion.f2","orion.f3","orion.f4"], tags: ["recordatorios","hábitos","compromisos","Telegram"] },
  { id: "sirius", icon: "✦", color: "var(--sirius)", bgA: "rgba(167,139,250,.08)", bgB: "rgba(167,139,250,.3)", live: true, subKey: "sirius.sub", descKey: "sirius.desc", feats: ["sirius.f1","sirius.f2","sirius.f3","sirius.f4"], tags: ["notas","zettelkasten","memoria","búsqueda IA"] },
  { id: "polaris", icon: "★", color: "var(--polaris)", bgA: "rgba(252,211,77,.06)", bgB: "rgba(252,211,77,.25)", live: true, subKey: "polaris.sub", descKey: "polaris.desc", feats: ["polaris.f1","polaris.f2","polaris.f3","polaris.f4"], tags: ["metas","health score","OKR","seguimiento"] },
  { id: "luna", icon: "🌙", color: "var(--luna)", bgA: "rgba(192,132,252,.08)", bgB: "rgba(192,132,252,.3)", live: false, subKey: "luna.sub", descKey: "luna.desc", feats: ["luna.f1","luna.f2","luna.f3","luna.f4"], tags: ["bienestar","CBT","TDAH","hormonal"] },
  { id: "vega", icon: "💊", color: "var(--vega)", bgA: "rgba(52,211,153,.07)", bgB: "rgba(52,211,153,.25)", live: false, subKey: "vega.sub", descKey: "vega.desc", feats: ["vega.f1","vega.f2","vega.f3","vega.f4"], tags: ["salud","médico","medicamentos","historial"] },
];

export default function Modules({ lang }: { lang: LandingLang }) {
  const t = useLandingT(lang);

  return (
    <section id="modulos" style={{ background: "var(--l-bg2)", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: "11px", color: "var(--z-violet)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>{t("mod.label")}</p>
        <h2 className="reveal" style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, color: "var(--l-text)", textAlign: "center", marginBottom: "16px" }}>{t("mod.title")}</h2>
        <p className="reveal" style={{ textAlign: "center", color: "var(--l-text2)", fontSize: "17px", maxWidth: "600px", margin: "0 auto 60px", fontFamily: "var(--font-dm-sans)" }}>{t("mod.sub")}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {MODULES.map((mod) => (
            <div key={mod.id} className="reveal" style={{
              padding: "28px", borderRadius: "20px",
              background: mod.bgA, border: `1px solid ${mod.bgB}`,
              position: "relative",
            }}>
              <span style={{
                position: "absolute", top: "16px", right: "16px",
                fontSize: "11px", padding: "3px 10px", borderRadius: "999px",
                background: mod.live ? "rgba(52,211,153,.12)" : "rgba(155,127,232,.12)",
                color: mod.live ? "#34D399" : mod.color,
                border: `1px solid ${mod.live ? "rgba(52,211,153,.3)" : mod.bgB}`,
                fontFamily: "var(--font-jetbrains)",
              }}>
                {mod.live ? t("status.live") : t("status.soon")}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "28px" }}>{mod.icon}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "20px", color: mod.color }}>{mod.id}</div>
                  <div style={{ fontSize: "12px", color: "var(--l-text3)", fontFamily: "var(--font-dm-sans)" }}>{t(mod.subKey)}</div>
                </div>
              </div>

              <p style={{ fontSize: "14px", color: "var(--l-text2)", lineHeight: 1.7, marginBottom: "16px", fontFamily: "var(--font-dm-sans)" }}>{t(mod.descKey)}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {mod.feats.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--l-text2)", fontFamily: "var(--font-dm-sans)" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: mod.color, marginTop: "6px", flexShrink: 0 }} />
                    {t(f)}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {mod.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: "11px", padding: "3px 10px", borderRadius: "999px",
                    background: "var(--l-surface2)", color: "var(--l-text3)",
                    fontFamily: "var(--font-jetbrains)",
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

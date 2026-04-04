"use client";
import Link from "next/link";
import type { LandingLang } from "@/lib/landing-i18n";
import { useLandingT } from "@/lib/landing-i18n";

const PLANS = [
  { price: "$0", features: ["plan.free.f1","plan.free.f2","plan.free.f3"], missing: ["plan.free.f4","plan.free.f5","plan.free.f6"], nameKey: "plan.free.name", tagKey: "plan.free.tag", ctaKey: "plan.free.cta", featured: false },
  { price: "$9.99", features: ["plan.ess.f1","plan.ess.f2","plan.ess.f3","plan.ess.f4","plan.ess.f5","plan.ess.f6"], missing: [], nameKey: "plan.ess.name", tagKey: "plan.ess.tag", ctaKey: "plan.ess.cta", badgeKey: "plan.ess.badge", featured: true },
  { price: "$19.99", features: ["plan.pro.f1","plan.pro.f2","plan.pro.f3","plan.pro.f4","plan.pro.f5"], missing: [], nameKey: "plan.pro.name", tagKey: "plan.pro.tag", ctaKey: "plan.pro.cta", featured: false },
  { price: "$29.99", features: ["plan.fam.f1","plan.fam.f2","plan.fam.f3","plan.fam.f4","plan.fam.f5"], missing: [], nameKey: "plan.fam.name", tagKey: "plan.fam.tag", ctaKey: "plan.fam.cta", featured: false },
];

export default function Pricing({ lang }: { lang: LandingLang }) {
  const t = useLandingT(lang);

  return (
    <section id="planes" style={{ background: "var(--l-bg2)", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: "11px", color: "var(--z-violet)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>{t("price.label")}</p>
        <h2 className="reveal" style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, color: "var(--l-text)", textAlign: "center", marginBottom: "16px" }}>{t("price.title")}</h2>
        <p className="reveal" style={{ textAlign: "center", color: "var(--l-text2)", fontSize: "17px", maxWidth: "500px", margin: "0 auto 32px", fontFamily: "var(--font-dm-sans)" }}>{t("price.sub")}</p>

        {/* Beta notice */}
        <div className="reveal" style={{
          margin: "0 auto 40px", maxWidth: "700px",
          background: "rgba(252,211,77,.06)", border: "1px solid rgba(252,211,77,.2)",
          borderRadius: "12px", padding: "16px 22px",
          display: "flex", alignItems: "flex-start", gap: "12px",
        }}>
          <span style={{ fontSize: "20px", flexShrink: 0 }}>🎉</span>
          <div style={{ fontSize: "14px", color: "var(--l-text2)", lineHeight: 1.6, fontFamily: "var(--font-dm-sans)" }}
            dangerouslySetInnerHTML={{ __html: t("beta.notice").replace("Fase Beta:", "<strong style='color:var(--polaris)'>Fase Beta:</strong>").replace("Beta Phase:", "<strong style='color:var(--polaris)'>Beta Phase:</strong>").replace("Fase Beta:", "<strong style='color:var(--polaris)'>Fase Beta:</strong>") }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {PLANS.map((plan) => (
            <div key={plan.nameKey} className="reveal" style={{
              padding: "28px", borderRadius: "20px", position: "relative",
              background: plan.featured ? "rgba(155,127,232,.08)" : "var(--l-surface)",
              border: plan.featured ? "1px solid rgba(155,127,232,.35)" : "1px solid var(--l-border)",
              boxShadow: plan.featured ? "0 0 40px rgba(155,127,232,.12)" : "none",
            }}>
              {plan.featured && plan.badgeKey && (
                <div style={{
                  position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, var(--z-violet), var(--z-cyan))",
                  color: "#fff", fontSize: "12px", fontWeight: 700,
                  padding: "4px 16px", borderRadius: "999px", whiteSpace: "nowrap",
                  fontFamily: "var(--font-syne)",
                }}>
                  {t(plan.badgeKey)}
                </div>
              )}
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "var(--l-text)", marginBottom: "6px" }}>{t(plan.nameKey)}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "6px" }}>
                <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "36px", color: "var(--l-text)" }}>{plan.price}</span>
                <span style={{ fontSize: "13px", color: "var(--l-text3)", fontFamily: "var(--font-dm-sans)" }}>USD{plan.price !== "$0" ? ` ${t("plan.period")}` : ""}</span>
              </div>
              <div style={{ fontSize: "13px", color: "var(--l-text2)", marginBottom: "20px", fontFamily: "var(--font-dm-sans)" }}>{t(plan.tagKey)}</div>
              <div style={{ height: "1px", background: "var(--l-border)", marginBottom: "20px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--l-text2)", fontFamily: "var(--font-dm-sans)" }}>
                    <span style={{ color: plan.featured ? "var(--z-violet)" : "#34D399", flexShrink: 0 }}>✓</span>
                    {t(f)}
                  </div>
                ))}
                {plan.missing.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--l-text3)", fontFamily: "var(--font-dm-sans)" }}>
                    <span style={{ flexShrink: 0 }}>–</span>
                    {t(f)}
                  </div>
                ))}
              </div>
              <Link href="/login" style={{
                display: "block", textAlign: "center",
                padding: "12px", borderRadius: "10px",
                background: plan.featured ? "linear-gradient(135deg, var(--z-violet), var(--z-cyan))" : "var(--l-surface2)",
                border: plan.featured ? "none" : "1px solid var(--l-border2)",
                color: plan.featured ? "#fff" : "var(--l-text)",
                fontSize: "14px", fontWeight: 600, textDecoration: "none",
                fontFamily: "var(--font-syne)",
              }}>
                {t(plan.ctaKey)}
              </Link>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <div className="reveal" style={{ padding: "20px 24px", borderRadius: "14px", background: "var(--l-surface)", border: "1px solid rgba(192,132,252,.2)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "var(--luna)", fontFamily: "var(--font-jetbrains)", marginBottom: "4px" }}>{t("addon.label")}</div>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "18px", color: "var(--luna)", marginBottom: "4px" }}>luna · Essential+</div>
              <div style={{ fontSize: "13px", color: "var(--l-text2)", fontFamily: "var(--font-dm-sans)" }}>{t("addon.luna.desc")}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "var(--luna)" }}>+$9.99</div>
              <div style={{ fontSize: "11px", color: "var(--l-text3)", fontFamily: "var(--font-jetbrains)" }}>USD / mes</div>
            </div>
          </div>
          <div className="reveal" style={{ padding: "20px 24px", borderRadius: "14px", background: "var(--l-surface)", border: "1px solid rgba(52,211,153,.2)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "var(--vega)", fontFamily: "var(--font-jetbrains)", marginBottom: "4px" }}>{t("addon.label2")}</div>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "18px", color: "var(--vega)", marginBottom: "4px" }}>vega · Essential+</div>
              <div style={{ fontSize: "13px", color: "var(--l-text2)", fontFamily: "var(--font-dm-sans)" }}>{t("addon.vega.desc")}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "var(--vega)" }}>+$4.99</div>
              <div style={{ fontSize: "11px", color: "var(--l-text3)", fontFamily: "var(--font-jetbrains)" }}>USD / mes</div>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--l-text3)", fontFamily: "var(--font-jetbrains)", marginTop: "24px" }}>{t("price.note")}</p>
      </div>
    </section>
  );
}

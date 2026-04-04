"use client";
import { useState } from "react";
import type { LandingLang } from "@/lib/landing-i18n";
import { useLandingT } from "@/lib/landing-i18n";

type ScenarioKey = "diary" | "reminder" | "briefing" | "goal";

interface ScenarioMsg { role: "u" | "z"; text: string; mod?: string; }

const SCENARIOS: Record<ScenarioKey, { ctx: string; msgs: ScenarioMsg[] }> = {
  diary: { ctx: "aura · diario", msgs: [
    { role: "u", text: "Hoy fue un día muy lindo, llevé a los niños al parque y reímos mucho" },
    { role: "z", text: "Qué bonito momento 🌸 ¿Qué fue lo que más disfrutaron en el parque?", mod: "aura" },
    { role: "u", text: "Los columpios! Ana no quería bajarse jaja" },
    { role: "z", text: "Guardé este recuerdo en tu diario: \"Tarde en el parque — Ana en los columpios, risas con los niños\". Tu aura de hoy: dorada ✨", mod: "aura" },
  ]},
  reminder: { ctx: "orion · recordatorios", msgs: [
    { role: "u", text: "Recuérdame el sábado a las 3pm que Luis tiene juego de béisbol" },
    { role: "z", text: "Listo ⚡ Recordatorio para el sábado a las 3pm: ⚾ Juego de béisbol de Luis. ¿También 1 hora antes?", mod: "orion" },
    { role: "u", text: "Sí por favor, y también me recuerda comprar sus botanas" },
    { role: "z", text: "Perfecto. Dos recordatorios: 2pm botanas para Luis, 3pm juego de béisbol. ¡Que lo disfruten! 🎉", mod: "orion" },
  ]},
  briefing: { ctx: "morning briefing · 7:00am", msgs: [
    { role: "z", text: "Buenos días María! ☀️ Lunes de inicio. Llevas 12 días con tu hábito de agua — racha activa 🔥", mod: "orion" },
    { role: "z", text: "Hoy: dentista de Sofía a las 4pm, práctica de fútbol de Carlos a las 6pm. Tu aura de la semana pasada fue esmeralda 🌿", mod: "aura" },
    { role: "u", text: "Gracias! ¿Qué tengo pendiente en mis metas?" },
    { role: "z", text: "Tu meta de ejercicio está en 🌿 health 72. Llevas 3 semanas — promedio: 3.2 sesiones/semana.", mod: "polaris" },
  ]},
  goal: { ctx: "polaris · metas", msgs: [
    { role: "u", text: "Quiero ponerme una meta de hacer ejercicio 4 veces a la semana este año" },
    { role: "z", text: "Meta creada ★ \"Ejercicio 4x por semana · 2026\". La conecto con tu hábito en Orion para medir el avance.", mod: "polaris" },
    { role: "u", text: "¿Cómo va la meta hasta ahora?" },
    { role: "z", text: "Llevas 6 semanas. Promedio: 3.2 sesiones/semana. Health score: 🌿 68. El mejor mes fue febrero — 4.5 sesiones 💪", mod: "polaris" },
  ]},
};

const MOD_COLORS: Record<string, string> = {
  aura: "var(--aura)", orion: "var(--orion)", polaris: "var(--polaris)", sirius: "var(--sirius)"
};

export default function HowItWorks({ lang }: { lang: LandingLang }) {
  const t = useLandingT(lang);
  const [active, setActive] = useState<ScenarioKey>("diary");
  const sc = SCENARIOS[active];

  const FEATS = [
    { icon: "🌅", titleKey: "feat1.title", descKey: "feat1.desc", tagColor: "rgba(252,211,77,.1)", tagTextColor: "var(--polaris)", tagBorder: "rgba(252,211,77,.2)", tag: "Daily briefing" },
    { icon: "✨", titleKey: "feat2.title", descKey: "feat2.desc", tagColor: "rgba(155,127,232,.1)", tagTextColor: "var(--z-violet)", tagBorder: "rgba(155,127,232,.2)", tag: "Personalidades" },
    { icon: "🔔", titleKey: "feat3.title", descKey: "feat3.desc", tagColor: "rgba(96,165,250,.1)", tagTextColor: "var(--orion)", tagBorder: "rgba(96,165,250,.2)", tag: "Notificaciones" },
  ];

  const SCENARIOS_LIST: { key: ScenarioKey; icon: string; labelKey: string; subKey: string }[] = [
    { key: "diary", icon: "🌸", labelKey: "sc1.label", subKey: "sc1.sub" },
    { key: "reminder", icon: "⚡", labelKey: "sc2.label", subKey: "sc2.sub" },
    { key: "briefing", icon: "🌅", labelKey: "sc3.label", subKey: "sc3.sub" },
    { key: "goal", icon: "★", labelKey: "sc4.label", subKey: "sc4.sub" },
  ];

  return (
    <section id="como-funciona" style={{ background: "var(--l-bg)", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: "11px", color: "var(--z-violet)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>{t("how.label")}</p>
        <h2 className="reveal" style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, color: "var(--l-text)", textAlign: "center", marginBottom: "16px" }}>{t("how.title")}</h2>
        <p className="reveal" style={{ textAlign: "center", color: "var(--l-text2)", fontSize: "17px", marginBottom: "60px", maxWidth: "600px", margin: "0 auto 60px", fontFamily: "var(--font-dm-sans)" }}>{t("how.sub")}</p>

        {/* Features strip */}
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "60px" }}>
          {FEATS.map((f) => (
            <div key={f.titleKey} style={{
              padding: "28px", background: "var(--l-surface)", border: "1px solid var(--l-border)",
              borderRadius: "16px",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "16px", color: "var(--l-text)", marginBottom: "10px" }}>{t(f.titleKey)}</div>
              <p style={{ fontSize: "14px", color: "var(--l-text2)", lineHeight: 1.7, marginBottom: "16px", fontFamily: "var(--font-dm-sans)" }}>{t(f.descKey)}</p>
              <span style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "999px", background: f.tagColor, color: f.tagTextColor, border: `1px solid ${f.tagBorder}`, fontFamily: "var(--font-jetbrains)" }}>{f.tag}</span>
            </div>
          ))}
        </div>

        {/* Interactive demo */}
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px" }}>
          {/* Scenario buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {SCENARIOS_LIST.map((s) => (
              <button key={s.key} onClick={() => setActive(s.key)} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
                border: active === s.key ? "1px solid rgba(155,127,232,.4)" : "1px solid var(--l-border)",
                background: active === s.key ? "rgba(155,127,232,.08)" : "var(--l-surface)",
                transition: "all .2s", textAlign: "left",
              }}>
                <span style={{ fontSize: "20px" }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: "13px", color: "var(--l-text)" }}>{t(s.labelKey)}</div>
                  <div style={{ fontSize: "11px", color: "var(--l-text3)", fontFamily: "var(--font-dm-sans)" }}>{t(s.subKey)}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div style={{ background: "var(--l-bg2)", border: "1px solid var(--l-border)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--l-border)", fontSize: "12px", fontFamily: "var(--font-jetbrains)", color: "var(--l-text3)", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "var(--z-violet)" }}>●</span> zaelyn · {sc.ctx}
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", minHeight: "260px" }}>
              {sc.msgs.map((msg, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "u" ? "flex-end" : "flex-start" }}>
                  {msg.role === "z" && msg.mod && (
                    <span style={{ fontSize: "10px", color: MOD_COLORS[msg.mod] ?? "var(--z-violet)", fontFamily: "var(--font-jetbrains)", marginBottom: "4px" }}>
                      zaelyn · {msg.mod}
                    </span>
                  )}
                  <div style={{
                    maxWidth: "85%", padding: "10px 14px",
                    borderRadius: msg.role === "u" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    fontSize: "13px", lineHeight: 1.6, fontFamily: "var(--font-dm-sans)",
                    background: msg.role === "u" ? "rgba(99,102,241,0.1)" : "var(--l-surface2)",
                    border: msg.role === "u" ? "1px solid rgba(99,102,241,0.2)" : "1px solid var(--l-border)",
                    color: "var(--l-text)",
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

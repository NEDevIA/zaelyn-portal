"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";

export default function LandingModules() {
  const { lang } = useLanguageStore();
  const t = T[lang];

  return (
    <section id="modulos">
      <div className="section-eyebrow">{t.mod_eyebrow}</div>
      <h2 dangerouslySetInnerHTML={{ __html: t.mod_h2 }} />
      <p className="section-sub">{t.mod_sub}</p>
      <div className="modules-grid">
        {/* Mira */}
        <div className="mod-card" style={{ borderTop: "2px solid var(--mira)" }}>
          <div className="mod-star" style={{ color: "var(--mira)" }}>
            <span className="mod-star-dot" style={{ background: "var(--mira)" }} />
            <span>{t.mod_mem}</span>
          </div>
          <div className="mod-name" style={{ color: "var(--mira)" }}>Mira</div>
          <div className="mod-desc">{t.mira_desc}</div>
          <div className="mod-features">
            <div className="mod-feature">{t.mira_f1}</div>
            <div className="mod-feature">{t.mira_f2}</div>
            <div className="mod-feature">{t.mira_f3}</div>
          </div>
        </div>
        {/* Sirius */}
        <div className="mod-card" style={{ borderTop: "2px solid var(--sirius)" }}>
          <div className="mod-star" style={{ color: "var(--sirius)" }}>
            <span className="mod-star-dot" style={{ background: "var(--sirius)" }} />
            <span>{t.mod_mem}</span>
          </div>
          <div className="mod-name" style={{ color: "var(--sirius)" }}>Sirius</div>
          <div className="mod-desc">{t.sirius_desc}</div>
          <div className="mod-features">
            <div className="mod-feature">{t.sirius_f1}</div>
            <div className="mod-feature">{t.sirius_f2}</div>
            <div className="mod-feature">{t.sirius_f3}</div>
          </div>
        </div>
        {/* Orion */}
        <div className="mod-card" style={{ borderTop: "2px solid var(--orion)" }}>
          <div className="mod-star" style={{ color: "var(--orion)" }}>
            <span className="mod-star-dot" style={{ background: "var(--orion)" }} />
            <span>{t.mod_action}</span>
          </div>
          <div className="mod-name" style={{ color: "var(--orion)" }}>Orion</div>
          <div className="mod-desc">{t.orion_desc}</div>
          <div className="mod-features">
            <div className="mod-feature">{t.orion_f1}</div>
            <div className="mod-feature">{t.orion_f2}</div>
            <div className="mod-feature">{t.orion_f3}</div>
          </div>
        </div>
        {/* Polaris */}
        <div className="mod-card" style={{ borderTop: "2px solid var(--polaris)" }}>
          <div className="mod-star" style={{ color: "var(--polaris)" }}>
            <span className="mod-star-dot" style={{ background: "var(--polaris)" }} />
            <span>{t.mod_action}</span>
          </div>
          <div className="mod-name" style={{ color: "var(--polaris)" }}>Polaris</div>
          <div className="mod-desc">{t.polaris_desc}</div>
          <div className="mod-features">
            <div className="mod-feature">{t.polaris_f1}</div>
            <div className="mod-feature">{t.polaris_f2}</div>
            <div className="mod-feature">{t.polaris_f3}</div>
          </div>
        </div>
        {/* Pulsar — Phase II */}
        <div className="mod-card" style={{ borderTop: "2px solid var(--pulsar)", opacity: 0.75 }}>
          <div className="mod-phase">{t.phase2}</div>
          <div className="mod-star" style={{ color: "var(--pulsar)" }}>
            <span className="mod-star-dot" style={{ background: "var(--pulsar)" }} />
            <span>{t.mod_social}</span>
          </div>
          <div className="mod-name" style={{ color: "var(--pulsar)" }}>Pulsar</div>
          <div className="mod-desc">{t.pulsar_desc}</div>
          <div className="mod-features">
            <div className="mod-feature">{t.pulsar_f1}</div>
            <div className="mod-feature">{t.pulsar_f2}</div>
          </div>
        </div>
        {/* Pléyades — Phase II */}
        <div className="mod-card" style={{ borderTop: "2px solid #ec4899", opacity: 0.65 }}>
          <div className="mod-phase">{t.phase2}</div>
          <div className="mod-star" style={{ color: "#ec4899" }}>
            <span className="mod-star-dot" style={{ background: "#ec4899" }} />
            <span>{t.mod_family}</span>
          </div>
          <div className="mod-name" style={{ color: "#ec4899" }}>Pléyades</div>
          <div className="mod-desc">{t.pleyades_desc}</div>
          <div className="mod-features">
            <div className="mod-feature">{t.pleyades_f1}</div>
            <div className="mod-feature">{t.pleyades_f2}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

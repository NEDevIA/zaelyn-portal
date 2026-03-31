"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";

export default function LandingPrivacy() {
  const { lang } = useLanguageStore();
  const t = T[lang];

  return (
    <section id="privacidad">
      <div className="section-eyebrow">{t.priv_eyebrow}</div>
      <h2 dangerouslySetInnerHTML={{ __html: t.priv_h2 }} />
      <p className="section-sub">{t.priv_sub}</p>
      <div className="privacy-grid">
        {/* Comfort */}
        <div className="priv-card">
          <div className="priv-head" style={{ background: "rgba(107,114,128,0.04)" }}>
            <div className="priv-num" style={{ background: "rgba(107,114,128,0.12)", color: "#9ca3af" }}>1</div>
            <div className="priv-title-group">
              <div className="priv-name">{t.pl1_name}</div>
              <div className="priv-subtitle">{t.pl1_sub}</div>
            </div>
            <span className="priv-badge" style={{ background: "rgba(107,114,128,0.1)", color: "#9ca3af" }}>{t.badge_default}</span>
          </div>
          <div className="priv-points">
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>✕</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl1_p1 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>✕</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl1_p2 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl1_p3 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl1_p4 }} />
            </div>
          </div>
          <div className="priv-footer">{t.pl1_footer}</div>
        </div>

        {/* Sovereign */}
        <div className="priv-card" style={{ borderColor: "rgba(59,130,246,0.15)" }}>
          <div className="priv-head" style={{ background: "rgba(59,130,246,0.04)" }}>
            <div className="priv-num" style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>2</div>
            <div className="priv-title-group">
              <div className="priv-name" style={{ color: "#60a5fa" }}>{t.pl2_name}</div>
              <div className="priv-subtitle">{t.pl2_sub}</div>
            </div>
            <span className="priv-badge" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa" }}>{t.badge_rec}</span>
          </div>
          <div className="priv-points">
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl2_p1 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl2_p2 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl2_p3 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>~</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl2_p4 }} />
            </div>
          </div>
          <div className="priv-footer">{t.pl2_footer}</div>
        </div>

        {/* Phantom */}
        <div className="priv-card" style={{ borderColor: "rgba(139,92,246,0.2)" }}>
          <div className="priv-head" style={{ background: "rgba(139,92,246,0.05)" }}>
            <div className="priv-num" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>3</div>
            <div className="priv-title-group">
              <div className="priv-name" style={{ color: "#a78bfa" }}>{t.pl3_name}</div>
              <div className="priv-subtitle">{t.pl3_sub}</div>
            </div>
            <span className="priv-badge" style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa" }}>{t.badge_new}</span>
          </div>
          <div className="priv-points">
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl3_p1 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl3_p2 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl3_p3 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa" }}>◈</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl3_p4 }} />
            </div>
          </div>
          <div className="priv-footer">{t.pl3_footer}</div>
        </div>

        {/* Full Sovereign */}
        <div className="priv-card" style={{ borderColor: "rgba(16,185,129,0.15)" }}>
          <div className="priv-head" style={{ background: "rgba(16,185,129,0.04)" }}>
            <div className="priv-num" style={{ background: "rgba(16,185,129,0.12)", color: "#34d399" }}>4</div>
            <div className="priv-title-group">
              <div className="priv-name" style={{ color: "#34d399" }}>{t.pl4_name}</div>
              <div className="priv-subtitle">{t.pl4_sub}</div>
            </div>
            <span className="priv-badge" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>{t.badge_p2}</span>
          </div>
          <div className="priv-points">
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl4_p1 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl4_p2 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✓</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl4_p3 }} />
            </div>
            <div className="priv-point">
              <div className="priv-point-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>~</div>
              <span dangerouslySetInnerHTML={{ __html: t.pl4_p4 }} />
            </div>
          </div>
          <div className="priv-footer">{t.pl4_footer}</div>
        </div>
      </div>
    </section>
  );
}

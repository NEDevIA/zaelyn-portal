"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";

export default function LandingCompare() {
  const { lang } = useLanguageStore();
  const t = T[lang];

  return (
    <section id="diferenciacion">
      <div className="section-eyebrow">{t.diff_eyebrow}</div>
      <h2 dangerouslySetInnerHTML={{ __html: t.diff_h2 }} />
      <p className="section-sub">{t.diff_sub}</p>
      <div className="compare-table">
        <div className="compare-header">
          <div className="compare-cell dim">{t.diff_dim}</div>
          <div className="compare-cell" style={{ color: "#60a5fa" }}>ChatGPT / Claude</div>
          <div className="compare-cell" style={{ color: "#a78bfa" }}>Venice.AI</div>
          <div className="compare-cell" style={{ color: "var(--accent2)" }}>Zaelyn.AI</div>
        </div>
        {/* Privacy section */}
        <div className="compare-row section-row">
          <div className="compare-cell section-label">{t.diff_sec1}</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell dim">{t.diff_r1}</div>
          <div className="compare-cell"><span className="lose">{t.diff_r1_a}</span></div>
          <div className="compare-cell"><span className="win">{t.diff_r1_b}</span></div>
          <div className="compare-cell"><span className="win">{t.diff_r1_c}</span><span className="tag-new">4 niveles</span></div>
        </div>
        <div className="compare-row">
          <div className="compare-cell dim">{t.diff_r2}</div>
          <div className="compare-cell"><span className="lose">{t.diff_r2_a}</span></div>
          <div className="compare-cell"><span className="win">{t.diff_r2_b}</span></div>
          <div className="compare-cell"><span className="win">{t.diff_r2_c}</span><span className="tag-new">nuevo</span></div>
        </div>
        {/* Intelligence section */}
        <div className="compare-row section-row">
          <div className="compare-cell section-label">{t.diff_sec2}</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell dim">{t.diff_r3}</div>
          <div className="compare-cell"><span style={{ color: "var(--amber)" }}>{t.diff_r3_a}</span></div>
          <div className="compare-cell"><span className="lose">{t.diff_r3_b}</span></div>
          <div className="compare-cell"><span className="win">{t.diff_r3_c}</span><span className="tag-win">único</span></div>
        </div>
        <div className="compare-row">
          <div className="compare-cell dim">{t.diff_r4}</div>
          <div className="compare-cell"><span style={{ color: "var(--amber)" }}>{t.diff_r4_a}</span></div>
          <div className="compare-cell"><span className="lose">{t.diff_r4_b}</span></div>
          <div className="compare-cell"><span className="win">{t.diff_r4_c}</span><span className="tag-win">único</span></div>
        </div>
        {/* Access section */}
        <div className="compare-row section-row">
          <div className="compare-cell section-label">{t.diff_sec3}</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell dim">{t.diff_r5}</div>
          <div className="compare-cell">{t.diff_r5_a}</div>
          <div className="compare-cell">{t.diff_r5_b}</div>
          <div className="compare-cell"><span className="win">{t.diff_r5_c}</span><span className="tag-win">ventaja</span></div>
        </div>
        <div className="compare-row">
          <div className="compare-cell dim">{t.diff_r6}</div>
          <div className="compare-cell">{t.diff_r6_a}</div>
          <div className="compare-cell">{t.diff_r6_b}</div>
          <div className="compare-cell"><span className="win">{t.diff_r6_c}</span><span className="tag-win">Las Américas</span></div>
        </div>
      </div>
    </section>
  );
}

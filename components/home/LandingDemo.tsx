"use client";

import { useEffect, useState } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";

const CONV_COUNT = 3;
const INTERVAL_MS = 7000;

export default function LandingDemo() {
  const { lang } = useLanguageStore();
  const t = T[lang];
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCur((c) => (c + 1) % CONV_COUNT);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  function showConv(i: number) {
    setCur(i);
  }

  return (
    <div className="demo-section" id="demo">
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div className="section-eyebrow">{t.demo_eyebrow}</div>
        <h2 dangerouslySetInnerHTML={{ __html: t.demo_h2 }} />
        <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 8 }}>{t.demo_sub}</p>
      </div>
      <div className="demo-window">
        <div className="demo-topbar">
          <div className="demo-logo">Z<span>ae</span>lyn</div>
          <div className="demo-tabs">
            {[t.demo_tab1, t.demo_tab2, t.demo_tab3].map((label, i) => (
              <button
                key={i}
                className={`demo-tab${cur === i ? " active" : ""}`}
                onClick={() => showConv(i)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="demo-badge">{t.demo_badge}</div>
        </div>
        <div className="demo-body">
          {/* Conv 0 — Mamá & familia */}
          <div className={`conv${cur === 0 ? " active" : ""}`} id="conv0">
            <div className="turn-q">
              <span className="turn-q-text">{t.c0_q1}</span>
            </div>
            <div className="turn-a">
              <div className="turn-a-text">{t.c0_a1}</div>
              <div className="chips">
                <span className="chip chip-orion">
                  <span className="chip-dot" style={{ background: "#3b82f6" }} />
                  {t.chip_task} · mañana 9:15 AM
                </span>
              </div>
            </div>
            <div className="turn-q">
              <span className="turn-q-text">{t.c0_q2}</span>
            </div>
            <div className="turn-a">
              <div
                className="turn-a-text"
                dangerouslySetInnerHTML={{ __html: t.c0_a2 }}
              />
              <div className="chips">
                <span className="chip chip-orion">
                  <span className="chip-dot" style={{ background: "#3b82f6" }} />
                  {t.chip_task} · jueves 4:00 PM
                </span>
              </div>
            </div>
            <div className="turn-q">
              <span className="turn-q-text">{t.c0_q3}</span>
            </div>
            <div className="turn-a">
              <div className="turn-a-text">{t.c0_a3}</div>
              <div className="chips">
                <span className="chip chip-mira">
                  <span className="chip-dot" style={{ background: "#8b5cf6" }} />
                  {t.chip_diary} · guardado
                </span>
              </div>
            </div>
          </div>

          {/* Conv 1 — Freelancer */}
          <div className={`conv${cur === 1 ? " active" : ""}`} id="conv1">
            <div className="turn-q">
              <span className="turn-q-text">{t.c1_q1}</span>
            </div>
            <div className="turn-a">
              <div className="turn-a-text">{t.c1_a1}</div>
              <div className="chips">
                <span className="chip chip-mira">
                  <span className="chip-dot" style={{ background: "#8b5cf6" }} />
                  {t.chip_diary} · guardado
                </span>
              </div>
            </div>
            <div className="turn-q">
              <span className="turn-q-text">{t.c1_q2}</span>
            </div>
            <div className="turn-a">
              <div className="turn-a-text">{t.c1_a2}</div>
              <div className="chips">
                <span className="chip chip-orion">
                  <span className="chip-dot" style={{ background: "#3b82f6" }} />
                  {t.chip_task} · viernes
                </span>
                <span className="chip chip-sirius">
                  <span className="chip-dot" style={{ background: "#7c3aed" }} />
                  {t.chip_memory} · Carlos Mendoza
                </span>
              </div>
            </div>
            <div className="turn-q">
              <span className="turn-q-text">{t.c1_q3}</span>
            </div>
            <div className="turn-a">
              <div
                className="turn-a-text"
                dangerouslySetInnerHTML={{ __html: t.c1_a3 }}
              />
              <div className="chips">
                <span className="chip chip-orion">
                  <span className="chip-dot" style={{ background: "#3b82f6" }} />
                  {t.chip_task} · mañana 10 AM
                </span>
                <span className="chip chip-polaris">
                  <span className="chip-dot" style={{ background: "#10b981" }} />
                  {t.chip_goals} · 3 clientes
                </span>
              </div>
            </div>
          </div>

          {/* Conv 2 — Vida personal */}
          <div className={`conv${cur === 2 ? " active" : ""}`} id="conv2">
            <div className="turn-q">
              <span className="turn-q-text">{t.c2_q1}</span>
            </div>
            <div className="turn-a">
              <div className="turn-a-text">{t.c2_a1}</div>
            </div>
            <div className="turn-q">
              <span className="turn-q-text">{t.c2_q2}</span>
            </div>
            <div className="turn-a">
              <div className="turn-a-text">{t.c2_a2}</div>
              <div className="chips">
                <span className="chip chip-mira">
                  <span className="chip-dot" style={{ background: "#8b5cf6" }} />
                  {t.chip_diary} · reflexión guardada
                </span>
              </div>
            </div>
            <div className="turn-q">
              <span className="turn-q-text">{t.c2_q3}</span>
            </div>
            <div className="turn-a">
              <div
                className="turn-a-text"
                dangerouslySetInnerHTML={{ __html: t.c2_a3 }}
              />
              <div className="chips">
                <span className="chip chip-orion">
                  <span className="chip-dot" style={{ background: "#3b82f6" }} />
                  {t.chip_task} · mañana 6:30 AM
                </span>
                <span className="chip chip-polaris">
                  <span className="chip-dot" style={{ background: "#10b981" }} />
                  {t.chip_goals} · 8kg · diciembre
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="demo-footer">
          <span>{t.demo_footer}</span>
          <div className="progress-dots">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`pdot${cur === i ? " active" : ""}`}
                onClick={() => showConv(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

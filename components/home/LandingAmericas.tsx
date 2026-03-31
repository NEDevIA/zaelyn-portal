"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { T } from "@/lib/i18n";

export default function LandingAmericas() {
  const { lang } = useLanguageStore();
  const t = T[lang];

  return (
    <div className="americas-section" id="americas">
      <div style={{ marginBottom: 40 }}>
        <div className="section-eyebrow">{t.am_eyebrow}</div>
        <h2 dangerouslySetInnerHTML={{ __html: t.am_h2 }} />
        <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.7, maxWidth: 580 }}>
          {t.am_sub}
        </p>
      </div>
      <div className="americas-inner">
        <div className="americas-map">
          <svg className="map-svg" viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: "#6366f1", stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: "#6366f1", stopOpacity: 0 }} />
              </radialGradient>
              <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 0 }} />
              </radialGradient>
            </defs>
            {/* Canada */}
            <path className="map-country active-phase1" d="M40,20 L260,20 L260,100 L220,110 L200,95 L180,105 L160,95 L140,100 L120,90 L100,95 L80,85 L60,90 L40,80 Z" />
            {/* USA */}
            <path className="map-country active-phase1" d="M45,80 L255,80 L255,165 L230,170 L215,160 L210,165 L195,158 L170,162 L160,155 L150,160 L140,155 L120,158 L100,152 L80,155 L65,148 L50,155 L45,160 Z" />
            {/* Mexico */}
            <path className="map-country active-phase1" d="M65,163 L195,163 L195,175 L185,188 L175,185 L165,195 L155,192 L145,202 L135,198 L125,205 L115,200 L105,205 L95,200 L88,208 L80,205 L72,215 L65,210 L60,200 L55,195 L58,185 L62,178 Z" />
            {/* Central America */}
            <path className="map-country" d="M72,215 L130,215 L128,240 L118,245 L108,240 L98,245 L88,240 L80,245 L74,238 Z" />
            {/* Colombia */}
            <path className="map-country active-phase2" d="M88,250 L148,250 L152,268 L148,280 L138,278 L128,282 L118,278 L108,280 L98,275 L90,278 L86,268 Z" />
            {/* Venezuela */}
            <path className="map-country active-phase2" d="M152,252 L200,252 L205,260 L198,272 L188,275 L178,270 L168,274 L158,270 L152,265 Z" />
            {/* Ecuador */}
            <path className="map-country active-phase2" d="M82,282 L118,282 L120,300 L115,308 L100,308 L88,305 L82,295 Z" />
            {/* Peru */}
            <path className="map-country active-phase2" d="M82,305 L140,305 L145,330 L140,348 L130,358 L115,355 L100,358 L88,352 L82,340 L80,325 Z" />
            {/* Bolivia */}
            <path className="map-country active-phase2" d="M145,310 L188,310 L190,335 L185,348 L170,352 L155,348 L148,335 Z" />
            {/* Chile */}
            <path className="map-country active-phase2" d="M108,355 L138,355 L140,380 L138,405 L132,428 L122,450 L115,465 L108,468 L105,450 L104,425 L106,400 L107,378 Z" />
            {/* Argentina */}
            <path className="map-country active-phase2" d="M138,355 L195,355 L198,380 L195,408 L188,430 L178,448 L165,460 L152,465 L140,460 L132,448 L130,428 L132,405 L134,380 Z" />
            {/* Brazil */}
            <path className="map-country active-phase2" d="M152,252 L250,260 L258,285 L255,312 L248,335 L240,350 L228,358 L215,355 L202,358 L192,350 L188,335 L190,310 L188,285 L180,272 L168,275 L158,270 L152,265 Z" />
            {/* Uruguay/Paraguay */}
            <path className="map-country" d="M190,352 L218,352 L220,368 L215,378 L205,375 L195,378 L190,368 Z" />

            {/* Houston — Phase 1 */}
            <circle cx="148" cy="148" r="4" fill="#6366f1" opacity="0.9" />
            <circle cx="148" cy="148" r="8" fill="#6366f1" opacity="0.15" />
            <text x="148" y="143" className="map-label" fill="#818cf8">Houston</text>
            {/* Chihuahua */}
            <circle cx="108" cy="176" r="3.5" fill="#6366f1" opacity="0.8" />
            <circle cx="108" cy="176" r="7" fill="#6366f1" opacity="0.12" />
            <text x="108" y="171" className="map-label" fill="#818cf8">Chihuahua</text>
            {/* NYC */}
            <circle cx="212" cy="118" r="2.5" fill="#6366f1" opacity="0.6" />
            <text x="212" y="113" className="map-label" fill="#6366f1" style={{ fontSize: "5.5px" }}>New York</text>
            {/* LA */}
            <circle cx="68" cy="138" r="2.5" fill="#6366f1" opacity="0.6" />
            <text x="68" y="133" className="map-label" fill="#6366f1" style={{ fontSize: "5.5px" }}>Los Angeles</text>
            {/* Toronto */}
            <circle cx="198" cy="86" r="2.5" fill="#6366f1" opacity="0.5" />
            <text x="198" y="81" className="map-label" fill="#6366f1" style={{ fontSize: "5.5px" }}>Toronto</text>
            {/* CDMX */}
            <circle cx="130" cy="192" r="3" fill="#6366f1" opacity="0.7" />
            <text x="130" y="187" className="map-label" fill="#818cf8" style={{ fontSize: "5.5px" }}>CDMX</text>
            {/* Monterrey */}
            <circle cx="118" cy="175" r="2.5" fill="#6366f1" opacity="0.6" />

            {/* Phase 2 cities */}
            <circle cx="112" cy="262" r="2.5" fill="#10b981" opacity="0.6" />
            <text x="112" y="258" className="map-label" fill="#10b981" style={{ fontSize: "5px" }}>Bogotá</text>
            <circle cx="96" cy="325" r="2.5" fill="#10b981" opacity="0.6" />
            <text x="96" y="321" className="map-label" fill="#10b981" style={{ fontSize: "5px" }}>Lima</text>
            <circle cx="126" cy="400" r="2.5" fill="#10b981" opacity="0.6" />
            <text x="126" y="396" className="map-label" fill="#10b981" style={{ fontSize: "5px" }}>Santiago</text>
            <circle cx="178" cy="410" r="2.5" fill="#10b981" opacity="0.6" />
            <text x="178" y="406" className="map-label" fill="#10b981" style={{ fontSize: "5px" }}>Bs. Aires</text>
            <circle cx="218" cy="340" r="3" fill="#10b981" opacity="0.7" />
            <text x="218" y="336" className="map-label" fill="#10b981" style={{ fontSize: "5px" }}>São Paulo</text>

            {/* Legend */}
            <circle cx="18" cy="490" r="4" fill="#6366f1" opacity="0.8" />
            <text x="26" y="493" className="map-label" fill="#6366f1" style={{ textAnchor: "start" }}>Fase I — Lanzamiento</text>
            <circle cx="18" cy="505" r="4" fill="#10b981" opacity="0.7" />
            <text x="26" y="508" className="map-label" fill="#10b981" style={{ textAnchor: "start" }}>Fase II — Expansión</text>
          </svg>
        </div>
        <div className="americas-list">
          <div className="al-phase">
            <div className="al-phase-label">{t.al_phase1}</div>
            <div className="al-country phase1">
              <span className="al-dot" style={{ background: "#6366f1" }} />
              <div>
                <div className="al-name">United States</div>
                <div className="al-detail">{t.al_us}</div>
              </div>
              <span className="al-badge" style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8" }}>
                Spearhead
              </span>
            </div>
            <div className="al-country phase1">
              <span className="al-dot" style={{ background: "#6366f1" }} />
              <div>
                <div className="al-name">Canada</div>
                <div className="al-detail">{t.al_ca}</div>
              </div>
              <span className="al-badge" style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8" }}>
                Fase I
              </span>
            </div>
            <div className="al-country phase1">
              <span className="al-dot" style={{ background: "#6366f1" }} />
              <div>
                <div className="al-name">México</div>
                <div className="al-detail">{t.al_mx}</div>
              </div>
              <span className="al-badge" style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8" }}>
                Origen
              </span>
            </div>
          </div>
          <div className="al-phase">
            <div className="al-phase-label">{t.al_phase2}</div>
            <div className="al-country phase2">
              <span className="al-dot" style={{ background: "#10b981" }} />
              <div>
                <div className="al-name">Brasil</div>
                <div className="al-detail">{t.al_br}</div>
              </div>
              <span className="al-badge" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                Prioridad
              </span>
            </div>
            <div className="al-country phase2">
              <span className="al-dot" style={{ background: "#10b981" }} />
              <div>
                <div className="al-name">Colombia · Argentina · Chile</div>
                <div className="al-detail">{t.al_latam1}</div>
              </div>
              <span className="al-badge" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                Fase II
              </span>
            </div>
            <div className="al-country phase2">
              <span className="al-dot" style={{ background: "#10b981" }} />
              <div>
                <div className="al-name">Perú · Venezuela · Ecuador</div>
                <div className="al-detail">{t.al_latam2}</div>
              </div>
              <span className="al-badge" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                Fase II
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

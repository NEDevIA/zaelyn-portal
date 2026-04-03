"use client";

import { useEffect, useRef } from "react";
import type { SiriusNode, SiriusLink, ParaBucket } from "./siriusData";

// ── PARA colours ────────────────────────────────────────────────────────────

const PARA_C: Record<string, string> = {
  projects: "#818CF8", areas: "#34D399", resources: "#60A5FA", archive: "#6B7280",
};
const PARA_C_LIGHT: Record<string, string> = {
  projects: "#6366f1", areas: "#059669", resources: "#2563eb", archive: "#4b5563",
};
const NODE_ICONS: Record<string, string> = {
  idea: "✦", note: "◌", person: "◉", resource: "◫", project: "◆", insight: "★",
};

// ── Physics node type ───────────────────────────────────────────────────────

interface PhysNode extends SiriusNode {
  x: number; y: number;
  vx: number; vy: number;
  r: number; ph: number; z: number;
}

interface BgStar {
  x: number; y: number; r: number; o: number; layer: number; ph: number; sp: number;
}

interface Nebula {
  x: number; y: number; rx: number; ry: number; color: string; angle: number;
}

interface Particle {
  source: string; target: string; t: number; reversed: boolean;
}

// ── StarMapEngine class (pure TS, no React) ─────────────────────────────────

class StarMapEngine {
  private cv: HTMLCanvasElement;
  private cx: CanvasRenderingContext2D;
  private nodes: PhysNode[] = [];
  private links: SiriusLink[] = [];
  private sel:  PhysNode | null = null;
  private hov:  PhysNode | null = null;
  private drag: PhysNode | null = null;
  private particles: Particle[] = [];
  private bgStars:  BgStar[] = [];
  private bgNebulae: Nebula[] = [];
  private tick = 0;
  private frame: number | null = null;
  private paraFilter: string | null = null;
  private textFilter: string | null = null;
  private lightMode = false;
  private W = 0;
  private H = 0;

  // Keep callbacks in refs so they're always current
  private onNodeClickCb:  (id: string) => void;
  private onCanvasClickCb: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    onNodeClick: (id: string) => void,
    onCanvasClick: () => void,
  ) {
    this.cv = canvas;
    this.cx = canvas.getContext("2d")!;
    this.onNodeClickCb  = onNodeClick;
    this.onCanvasClickCb = onCanvasClick;

    // Bind event handlers so we can remove them later
    this._onResize = this._onResize.bind(this);
    this._onMove   = this._onMove.bind(this);
    this._onDown   = this._onDown.bind(this);
    this._onUp     = this._onUp.bind(this);
    this._onClick  = this._onClick.bind(this);
    this._onLeave  = this._onLeave.bind(this);

    window.addEventListener("resize", this._onResize);
    canvas.addEventListener("mousemove",  this._onMove);
    canvas.addEventListener("mousedown",  this._onDown);
    canvas.addEventListener("mouseup",    this._onUp);
    canvas.addEventListener("click",      this._onClick);
    canvas.addEventListener("mouseleave", this._onLeave);

    this.resize();
  }

  // ── Event handlers ───────────────────────────────────────────────────────

  private _onResize() { this.resize(); }

  private _onMove(e: MouseEvent) {
    const rc = this.cv.getBoundingClientRect();
    const mx = e.clientX - rc.left, my = e.clientY - rc.top;
    if (this.drag) {
      this.drag.x = mx; this.drag.y = my; this.drag.vx = 0; this.drag.vy = 0;
    } else {
      this.hov = this.getAt(mx, my);
      this.cv.style.cursor = this.hov ? "pointer" : "default";
    }
  }

  private _onDown(e: MouseEvent) {
    const rc = this.cv.getBoundingClientRect();
    const n = this.getAt(e.clientX - rc.left, e.clientY - rc.top);
    if (n) this.drag = n;
  }

  private _onUp() { this.drag = null; }

  private _onClick(e: MouseEvent) {
    const rc = this.cv.getBoundingClientRect();
    const n = this.getAt(e.clientX - rc.left, e.clientY - rc.top);
    if (n) { this.sel = n; this.onNodeClickCb(n.id); }
    else   { this.sel = null; this.onCanvasClickCb(); }
  }

  private _onLeave() {
    this.hov = null;
    this.cv.style.cursor = "default";
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.W = this.cv.offsetWidth;
    this.H = this.cv.offsetHeight;
    this.cv.width  = this.W * dpr;
    this.cv.height = this.H * dpr;
    this.cx.scale(dpr, dpr);
    this.genBackground();
    for (const n of this.nodes) {
      n.x = Math.max(n.r + 12, Math.min(this.W - n.r - 12, n.x));
      n.y = Math.max(n.r + 12, Math.min(this.H - n.r - 12, n.y));
    }
  }

  destroy() {
    if (this.frame) cancelAnimationFrame(this.frame);
    window.removeEventListener("resize",      this._onResize);
    this.cv.removeEventListener("mousemove",  this._onMove);
    this.cv.removeEventListener("mousedown",  this._onDown);
    this.cv.removeEventListener("mouseup",    this._onUp);
    this.cv.removeEventListener("click",      this._onClick);
    this.cv.removeEventListener("mouseleave", this._onLeave);
  }

  load(rawNodes: SiriusNode[], rawLinks: SiriusLink[]) {
    if (!this.W || !this.H) this.resize();
    const cx = this.W / 2, cy = this.H / 2;
    const spread = Math.min(this.W, this.H) * 0.52;

    this.nodes = rawNodes.map((n) => ({
      ...n,
      x:  cx + (Math.random() - 0.5) * spread,
      y:  cy + (Math.random() - 0.5) * spread * 0.65,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      r:  7 + (n.connections || 0) * 2.8,
      ph: Math.random() * Math.PI * 2,
      z:  (Math.random() - 0.5) * 0.6,
    }));
    this.links = rawLinks;
    this.start();
  }

  start() {
    if (this.frame) cancelAnimationFrame(this.frame);
    const loop = () => {
      this.tick++;
      this.sim();
      this.updateParticles();
      this.draw();
      this.frame = requestAnimationFrame(loop);
    };
    loop();
  }

  updateCallbacks(onNodeClick: (id: string) => void, onCanvasClick: () => void) {
    this.onNodeClickCb  = onNodeClick;
    this.onCanvasClickCb = onCanvasClick;
  }

  selectById(id: string)  { this.sel = this.nodes.find((n) => n.id === id) || null; }
  clearSelection()         { this.sel = null; }
  setParaFilter(b: string | null) { this.paraFilter = b; }
  setTextFilter(t: string | null) { this.textFilter = t; }
  onThemeChange(light: boolean)   { this.lightMode = light; this.genBackground(); }

  // ── Background ───────────────────────────────────────────────────────────

  private genBackground() {
    this.bgStars   = [];
    this.bgNebulae = [];

    const cols = this.lightMode
      ? ["rgba(99,102,241,.03)", "rgba(5,150,105,.025)", "rgba(37,99,235,.02)"]
      : ["rgba(129,140,248,.04)", "rgba(52,211,153,.03)", "rgba(96,165,250,.025)"];

    [
      { x: this.W * 0.28, y: this.H * 0.38 },
      { x: this.W * 0.72, y: this.H * 0.62 },
      { x: this.W * 0.55, y: this.H * 0.18 },
    ].forEach((p, i) => {
      this.bgNebulae.push({ x: p.x, y: p.y, rx: this.W * 0.22, ry: this.H * 0.18, color: cols[i], angle: Math.random() * Math.PI });
    });

    // Layer 0 — dust
    for (let i = 0; i < 180; i++) this.bgStars.push({
      x: Math.random() * this.W, y: Math.random() * this.H,
      r: Math.random() * 0.45 + 0.1, o: Math.random() * 0.06 + 0.02,
      layer: 0, ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.008 + 0.003,
    });
    // Layer 1 — mid
    for (let i = 0; i < 70; i++) this.bgStars.push({
      x: Math.random() * this.W, y: Math.random() * this.H,
      r: Math.random() * 0.75 + 0.3, o: Math.random() * 0.12 + 0.04,
      layer: 1, ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.012 + 0.004,
    });
    // Layer 2 — bright with glow
    for (let i = 0; i < 22; i++) this.bgStars.push({
      x: Math.random() * this.W, y: Math.random() * this.H,
      r: Math.random() * 1.1 + 0.5, o: Math.random() * 0.22 + 0.1,
      layer: 2, ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.018 + 0.006,
    });
  }

  // ── Physics ──────────────────────────────────────────────────────────────

  private sim() {
    const ns = this.nodes, W = this.W, H = this.H, damp = 0.87;

    // Repulsion
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i], b = ns[j];
        const dx = b.x - a.x || 0.1, dy = b.y - a.y || 0.1;
        const d2 = dx * dx + dy * dy, d = Math.sqrt(d2) || 1;
        const md = a.r + b.r + 48;
        if (d < md * 3) {
          const f = Math.min(3000 / d2, 10), nx = dx / d, ny = dy / d;
          a.vx -= nx * f; a.vy -= ny * f;
          b.vx += nx * f; b.vy += ny * f;
        }
      }
    }

    // Spring attraction along links
    for (const lk of this.links) {
      const s = ns.find((n) => n.id === lk.source);
      const t = ns.find((n) => n.id === lk.target);
      if (!s || !t) continue;
      const dx = t.x - s.x, dy = t.y - s.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - 170) * 0.038, nx = dx / d, ny = dy / d;
      s.vx += nx * f; s.vy += ny * f;
      t.vx -= nx * f; t.vy -= ny * f;
    }

    // Gravity toward centre
    for (const n of ns) {
      n.vx += (W / 2 - n.x) * 0.0022;
      n.vy += (H / 2 - n.y) * 0.0022;
    }

    // Integrate
    for (const n of ns) {
      if (n === this.drag) continue;
      n.vx *= damp; n.vy *= damp;
      n.x += n.vx;   n.y += n.vy;
      n.x = Math.max(n.r + 10, Math.min(W - n.r - 10, n.x));
      n.y = Math.max(n.r + 10, Math.min(H - n.r - 10, n.y));
    }
  }

  // ── Particles ────────────────────────────────────────────────────────────

  private updateParticles() {
    this.particles = this.particles.filter((p) => p.t < 1);
    this.particles.forEach((p) => { p.t += 0.009; });

    const active = this.hov || this.sel;
    if (active && Math.random() < 0.15) {
      const conn = this.links.filter((l) => l.source === active.id || l.target === active.id);
      if (conn.length) {
        const lk       = conn[Math.floor(Math.random() * conn.length)];
        const reversed = lk.target === active.id;
        this.particles.push({ source: lk.source, target: lk.target, t: 0, reversed });
      }
    }
  }

  // ── Bezier helpers ───────────────────────────────────────────────────────

  private getBezierCP(s: PhysNode, t: PhysNode) {
    const dx = t.x - s.x, dy = t.y - s.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    const curv = len * 0.12;
    return { cpX: (s.x + t.x) / 2 + (-dy / len) * curv, cpY: (s.y + t.y) / 2 + (dx / len) * curv };
  }

  private bezierPt(s: PhysNode, t: PhysNode, cp: { cpX: number; cpY: number }, tv: number) {
    const u = 1 - tv;
    return { x: u * u * s.x + 2 * u * tv * cp.cpX + tv * tv * t.x, y: u * u * s.y + 2 * u * tv * cp.cpY + tv * tv * t.y };
  }

  // ── Visibility ───────────────────────────────────────────────────────────

  private visible(n: PhysNode): boolean {
    if (this.paraFilter && n.para_bucket !== this.paraFilter) return false;
    if (this.textFilter &&
      !n.title.toLowerCase().includes(this.textFilter) &&
      !(n.tags ?? []).some((t) => t.includes(this.textFilter!))) return false;
    return true;
  }

  private linked(a: PhysNode, b: PhysNode): boolean {
    return this.links.some(
      (l) => (l.source === a.id && l.target === b.id) || (l.source === b.id && l.target === a.id),
    );
  }

  private paraColor(bucket: string): string {
    return (this.lightMode ? PARA_C_LIGHT : PARA_C)[bucket] ?? "#818CF8";
  }

  private getAt(mx: number, my: number): PhysNode | null {
    for (const n of [...this.nodes].reverse()) {
      if (!this.visible(n)) continue;
      const dx = mx - n.x, dy = my - n.y;
      if (dx * dx + dy * dy <= (n.r + 8) ** 2) return n;
    }
    return null;
  }

  // ── Draw ─────────────────────────────────────────────────────────────────

  private draw() {
    const cx = this.cx, W = this.W, H = this.H, t = this.tick;
    cx.clearRect(0, 0, W, H);

    // Background
    if (this.lightMode) {
      cx.fillStyle = "#fafaf8";
    } else {
      const bg = cx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
      bg.addColorStop(0, "#0d0e1c");
      bg.addColorStop(1, "#08090e");
      cx.fillStyle = bg;
    }
    cx.fillRect(0, 0, W, H);

    // Nebulae (dark only)
    if (!this.lightMode) {
      for (const nb of this.bgNebulae) {
        cx.save();
        cx.translate(nb.x, nb.y);
        cx.rotate(nb.angle);
        const g = cx.createRadialGradient(0, 0, 0, 0, 0, nb.rx);
        g.addColorStop(0, nb.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        cx.beginPath();
        cx.ellipse(0, 0, nb.rx, nb.ry, 0, 0, Math.PI * 2);
        cx.fillStyle = g; cx.fill();
        cx.restore();
      }
    }

    // Background stars (dark only)
    if (!this.lightMode) {
      for (const s of this.bgStars) {
        const twinkle = Math.sin(t * s.sp + s.ph);
        const o = s.o + twinkle * 0.04;
        if (s.layer === 2) {
          const glow = cx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          glow.addColorStop(0, `rgba(200,210,255,${o * 0.4})`);
          glow.addColorStop(1, "rgba(200,210,255,0)");
          cx.beginPath(); cx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          cx.fillStyle = glow; cx.fill();
        }
        cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        cx.fillStyle = s.layer === 2 ? `rgba(235,240,255,${o})` : `rgba(200,210,255,${o})`;
        cx.fill();
      }
    }

    const hasHov = !!this.hov, hasSel = !!this.sel;

    // ── Links (bezier curves) ─────────────────────────────────────────────
    for (const lk of this.links) {
      const s  = this.nodes.find((n) => n.id === lk.source);
      const t2 = this.nodes.find((n) => n.id === lk.target);
      if (!s || !t2 || !this.visible(s) || !this.visible(t2)) continue;

      const isActive = (hasHov && (this.hov === s || this.hov === t2))
                    || (hasSel && (this.sel === s || this.sel === t2));
      const isDim    = hasHov && !isActive && !this.linked(s, this.hov!) && !this.linked(t2, this.hov!);

      const sc = this.paraColor(s.para_bucket);
      const tc = this.paraColor(t2.para_bucket);
      const { cpX, cpY } = this.getBezierCP(s, t2);
      const grad = cx.createLinearGradient(s.x, s.y, t2.x, t2.y);

      if (isActive) {
        grad.addColorStop(0, sc + "CC"); grad.addColorStop(1, tc + "CC");
        cx.save();
        cx.shadowColor = sc; cx.shadowBlur = 6;
        cx.strokeStyle = grad; cx.lineWidth = 1.5;
        cx.beginPath(); cx.moveTo(s.x, s.y); cx.quadraticCurveTo(cpX, cpY, t2.x, t2.y); cx.stroke();
        cx.restore();
      } else {
        const a = isDim ? (this.lightMode ? "12" : "0D") : (this.lightMode ? "30" : "28");
        grad.addColorStop(0, sc + a); grad.addColorStop(1, tc + a);
        cx.strokeStyle = grad; cx.lineWidth = 1;
        cx.beginPath(); cx.moveTo(s.x, s.y); cx.quadraticCurveTo(cpX, cpY, t2.x, t2.y); cx.stroke();
      }
    }

    // ── Flow particles along active links ─────────────────────────────────
    for (const p of this.particles) {
      const s  = this.nodes.find((n) => n.id === p.source);
      const t2 = this.nodes.find((n) => n.id === p.target);
      if (!s || !t2 || !this.visible(s) || !this.visible(t2)) continue;
      const tv = p.reversed ? 1 - p.t : p.t;
      const { cpX, cpY } = this.getBezierCP(s, t2);
      const pt  = this.bezierPt(s, t2, { cpX, cpY }, tv);
      const col = this.paraColor(s.para_bucket);
      const fade = p.t < 0.15 ? p.t / 0.15 : p.t > 0.85 ? (1 - p.t) / 0.15 : 1;
      cx.save();
      cx.shadowColor = col; cx.shadowBlur = 6;
      cx.beginPath(); cx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      cx.fillStyle = col + Math.round(fade * 204).toString(16).padStart(2, "0");
      cx.fill();
      cx.restore();
    }

    // ── Nodes (sorted by z depth) ─────────────────────────────────────────
    for (const n of [...this.nodes].sort((a, b) => a.z - b.z)) {
      if (!this.visible(n)) continue;
      const isH = this.hov === n, isS = this.sel === n;
      const isDim = hasHov && !isH && !this.linked(n, this.hov!);
      const color = this.paraColor(n.para_bucket);
      const r = n.r * (1 + n.z * 0.25);
      const depthAlpha = 1 + n.z * 0.2;
      const x = n.x, y = n.y;
      const pulseR = r + Math.sin(t * 0.025 + n.ph) * 2;

      // 1 — Ambient outer glow
      if (!isDim) {
        const outerR = r * (isH || isS ? 5.5 : 4.5);
        const outerG = cx.createRadialGradient(x, y, r * 0.5, x, y, outerR);
        outerG.addColorStop(0, color + (isH || isS ? "1A" : "0D"));
        outerG.addColorStop(1, color + "00");
        cx.beginPath(); cx.arc(x, y, outerR, 0, Math.PI * 2);
        cx.fillStyle = outerG; cx.fill();
      }

      // 2 — Corona with shadowBlur (star glow)
      if (!isDim) {
        cx.save();
        cx.shadowColor = color;
        cx.shadowBlur  = isH || isS ? r * 3.5 : r * 2.2;
        const coronaR = pulseR * 1.7;
        const coronaG = cx.createRadialGradient(x, y, 0, x, y, coronaR);
        coronaG.addColorStop(0, color + (isH || isS ? "55" : "28"));
        coronaG.addColorStop(1, color + "00");
        cx.beginPath(); cx.arc(x, y, coronaR, 0, Math.PI * 2);
        cx.fillStyle = coronaG; cx.fill();
        cx.restore();
      }

      // 3 — Main body (radial gradient)
      const bodyG = cx.createRadialGradient(x - r * 0.28, y - r * 0.28, 0, x, y, r);
      if (isDim) {
        bodyG.addColorStop(0, color + "2A");
        bodyG.addColorStop(1, color + "12");
      } else {
        bodyG.addColorStop(0,   color + "FF");
        bodyG.addColorStop(0.4, color + "EE");
        bodyG.addColorStop(1,   color + (isH || isS ? "99" : "66"));
      }
      cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2);
      cx.fillStyle = bodyG; cx.fill();

      // 4 — Specular highlight
      if (!isDim) {
        const specG = cx.createRadialGradient(x - r * 0.32, y - r * 0.32, 0, x - r * 0.32, y - r * 0.32, r * 0.65);
        specG.addColorStop(0, `rgba(255,255,255,${0.42 * depthAlpha})`);
        specG.addColorStop(1, "rgba(255,255,255,0)");
        cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2);
        cx.fillStyle = specG; cx.fill();
      }

      // 5 — Hot white core
      if (!isDim) {
        const coreR = Math.max(1.8, r * 0.18);
        cx.save();
        cx.shadowColor = "rgba(255,255,255,0.9)";
        cx.shadowBlur  = coreR * 4;
        cx.beginPath(); cx.arc(x, y, coreR, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,255,255,${0.88 * depthAlpha})`;
        cx.fill();
        cx.restore();
      }

      // 6 — Selection rings (animated dashes)
      if (isS) {
        cx.save();
        cx.shadowColor = color; cx.shadowBlur = 8;
        cx.beginPath(); cx.arc(x, y, r + 4, 0, Math.PI * 2);
        cx.strokeStyle = color + "BB"; cx.lineWidth = 2; cx.stroke();
        cx.restore();
        cx.save();
        cx.setLineDash([4, 4]);
        cx.lineDashOffset = -(t * 0.4 % 8);
        cx.beginPath(); cx.arc(x, y, r + 11, 0, Math.PI * 2);
        cx.strokeStyle = color + "44"; cx.lineWidth = 1; cx.stroke();
        cx.setLineDash([]);
        cx.restore();
      }

      // 7 — Hover ring
      if (isH && !isS) {
        cx.beginPath(); cx.arc(x, y, r + 3, 0, Math.PI * 2);
        cx.strokeStyle = color + "66"; cx.lineWidth = 1; cx.stroke();
      }

      // 8 — Node type icon
      cx.font = `${Math.max(9, r * 0.72)}px sans-serif`;
      cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.fillStyle = isDim ? "rgba(200,210,255,.15)" : "rgba(255,255,255,.92)";
      cx.fillText(NODE_ICONS[n.node_type] ?? "·", x, y);

      // 9 — Label
      if (!isDim) {
        const ml  = 15;
        const lbl = n.title.length > ml ? n.title.slice(0, ml) + "…" : n.title;
        cx.font = `${isH ? "12" : "11"}px DM Sans, sans-serif`;
        cx.textAlign = "center"; cx.textBaseline = "top";
        const alpha = this.lightMode ? (isH || isS ? 0.9 : 0.55) : (isH || isS ? 0.85 : 0.6);
        cx.fillStyle = `rgba(${this.lightMode ? "26,24,40" : "220,218,240"},${alpha})`;
        cx.fillText(lbl, x, y + r + 5);
      }

      // 10 — Zettel ID (hover/select only)
      if ((isH || isS) && n.zettel_id) {
        cx.font = "10px JetBrains Mono, monospace";
        cx.textAlign = "center"; cx.textBaseline = "top";
        cx.fillStyle = this.lightMode ? "rgba(99,102,241,.6)" : "rgba(129,140,248,.5)";
        cx.fillText(n.zettel_id, x, y + r + 18);
      }

      // 11 — Evergreen dot (top-right of node)
      if (!isDim && n.evergreen) {
        const evColor = n.evergreen === "mature" ? "#F0C060" : n.evergreen === "growing" ? "#818CF8" : "#34D399";
        cx.beginPath(); cx.arc(x + r * 0.7, y - r * 0.7, 3, 0, Math.PI * 2);
        cx.fillStyle = evColor + "CC";
        cx.fill();
      }
    }
  }
}

// ── React wrapper ─────────────────────────────────────────────────────────

interface Props {
  nodes:          SiriusNode[];
  links:          SiriusLink[];
  paraFilter:     ParaBucket | null;
  textFilter:     string | null;
  selectedId:     string | null;
  isLight:        boolean;
  onNodeClick:    (id: string) => void;
  onCanvasClick:  () => void;
}

export default function SiriusStarMap({
  nodes, links, paraFilter, textFilter, selectedId, isLight, onNodeClick, onCanvasClick,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<StarMapEngine | null>(null);

  // Keep callbacks always current without recreating the engine
  const onNodeClickRef   = useRef(onNodeClick);
  const onCanvasClickRef = useRef(onCanvasClick);
  useEffect(() => { onNodeClickRef.current   = onNodeClick;   }, [onNodeClick]);
  useEffect(() => { onCanvasClickRef.current = onCanvasClick; }, [onCanvasClick]);

  // Init engine once
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new StarMapEngine(
      canvasRef.current,
      (id) => onNodeClickRef.current(id),
      ()   => onCanvasClickRef.current(),
    );
    engineRef.current = engine;
    return () => engine.destroy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload when data changes
  useEffect(() => {
    if (engineRef.current && nodes.length > 0) {
      engineRef.current.load(nodes, links);
    }
  }, [nodes, links]);

  // Sync filter / selection / theme
  useEffect(() => { engineRef.current?.setParaFilter(paraFilter); }, [paraFilter]);
  useEffect(() => { engineRef.current?.setTextFilter(textFilter);  }, [textFilter]);
  useEffect(() => { engineRef.current?.onThemeChange(isLight);     }, [isLight]);
  useEffect(() => {
    if (selectedId) engineRef.current?.selectById(selectedId);
    else            engineRef.current?.clearSelection();
  }, [selectedId]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

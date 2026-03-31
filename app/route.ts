export const dynamic = "force-static";

const HTML = `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Zaelyn — La IA que te conoce</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Figtree:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
/* ═══════════════════════════════════════
   TOKENS
═══════════════════════════════════════ */
:root {
  --ease: cubic-bezier(0.16,1,0.3,1);
  --ease-back: cubic-bezier(0.34,1.56,0.64,1);
  --radius: 16px;
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Figtree', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  /* Module colors */
  --mira: #8b5cf6; --sirius: #6d28d9; --orion: #3b82f6;
  --polaris: #10b981; --pulsar: #e879f9; --pleyades: #ec4899;
}

[data-theme="dark"] {
  --bg: #06070b; --bg2: #0a0c12; --bg3: #0f1118; --bg4: #141720;
  --surface: rgba(255,255,255,0.04); --surface2: rgba(255,255,255,0.07);
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.14);
  --text: #eceef4; --text2: #8891a8; --text3: #3d4560;
  --accent: #7c3aed; --accent2: #a78bfa; --accent3: #c4b5fd;
  --gold: #d4a853; --gold2: #f5c842;
  --green: #10b981; --red: #ef4444; --amber: #f59e0b;
  --noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  --shadow: 0 24px 80px rgba(0,0,0,0.6);
  --card-glow: 0 0 60px rgba(124,58,237,0.08);
}

[data-theme="light"] {
  --bg: #faf8f5; --bg2: #f3f0eb; --bg3: #ede9e2; --bg4: #e4dfd6;
  --surface: rgba(0,0,0,0.04); --surface2: rgba(0,0,0,0.07);
  --border: rgba(0,0,0,0.09); --border2: rgba(0,0,0,0.15);
  --text: #16112b; --text2: #5c5470; --text3: #9890b0;
  --accent: #6d28d9; --accent2: #7c3aed; --accent3: #8b5cf6;
  --gold: #b8860b; --gold2: #d4a817;
  --green: #059669; --red: #dc2626; --amber: #d97706;
  --noise: none;
  --shadow: 0 24px 80px rgba(0,0,0,0.12);
  --card-glow: 0 0 60px rgba(109,40,217,0.06);
}

/* ═══════════════════════════════════════
   RESET & BASE
═══════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.65;
  overflow-x: hidden;
  transition: background 0.3s var(--ease), color 0.3s var(--ease);
}
[data-theme="dark"] body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: var(--noise);
  pointer-events: none;
  z-index: 9999;
  opacity: 0.6;
}
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: inherit; }
img { display: block; max-width: 100%; }

/* ═══════════════════════════════════════
   NAV
═══════════════════════════════════════ */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(24px) saturate(1.4);
  background: rgba(6,7,11,0.8);
  transition: background 0.3s;
}
[data-theme="light"] nav {
  background: rgba(250,248,245,0.85);
}
.nav-logo {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.06em;
  color: var(--text);
  display: flex; align-items: center; gap: 6px;
}
.nav-logo-ae { color: var(--accent2); font-style: italic; }
.nav-logo-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: breathe 3s ease-in-out infinite; }
@keyframes breathe { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

.nav-links { display: flex; gap: 28px; }
.nav-links a {
  font-size: 13px; font-weight: 400; color: var(--text2);
  transition: color 0.2s;
  letter-spacing: 0.01em;
}
.nav-links a:hover { color: var(--text); }

.nav-controls { display: flex; align-items: center; gap: 10px; }

/* Language select */
.lang-select {
  appearance: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text2);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  padding: 5px 28px 5px 10px;
  cursor: pointer;
  transition: all 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}
.lang-select:hover { border-color: var(--border2); color: var(--text); }
.lang-select option { background: #0f1118; color: #fff; }

/* Theme toggle */
.theme-btn {
  width: 34px; height: 34px; border-radius: 9px;
  background: var(--surface); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--text2); transition: all 0.2s;
  font-size: 15px;
}
.theme-btn:hover { border-color: var(--border2); color: var(--text); }

.nav-cta {
  background: var(--accent);
  color: #fff; border: none;
  padding: 8px 18px; border-radius: 10px;
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.01em;
  transition: all 0.2s var(--ease);
  position: relative; overflow: hidden;
}
.nav-cta::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
}
.nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.4); }

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 80px 40px 60px;
  position: relative;
  overflow: hidden;
  gap: 40px;
}

/* Canvas constellation */
#constellation {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  z-index: 0;
}

.hero-left {
  position: relative; z-index: 2;
  max-width: 620px;
}

.hero-kicker {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono);
  font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text3);
  margin-bottom: 28px;
}
.hero-kicker-line {
  width: 32px; height: 1px; background: var(--accent2); opacity: 0.5;
}
.hero-kicker span { color: var(--accent2); }

h1 {
  font-family: var(--font-display);
  font-size: clamp(52px, 6vw, 88px);
  font-weight: 300;
  line-height: 1.0;
  letter-spacing: -0.03em;
  color: var(--text);
  margin-bottom: 28px;
}
h1 em {
  font-style: italic;
  color: var(--accent2);
  display: block;
}
h1 strong {
  font-weight: 600;
  display: block;
  font-size: 0.95em;
}

.hero-sub {
  font-size: 17px; font-weight: 300; color: var(--text2);
  line-height: 1.75; max-width: 480px;
  margin-bottom: 40px;
}

.hero-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

.btn-hero {
  padding: 13px 28px; border-radius: 12px;
  font-size: 14px; font-weight: 500;
  border: none; transition: all 0.25s var(--ease);
  position: relative; overflow: hidden;
}
.btn-hero-primary {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 0 0 0 rgba(124,58,237,0.4);
}
.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(124,58,237,0.45);
}
.btn-hero-ghost {
  background: var(--surface); color: var(--text2);
  border: 1px solid var(--border2);
}
.btn-hero-ghost:hover { color: var(--text); border-color: var(--accent2); }

.hero-proof {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: var(--text3);
  font-family: var(--font-mono);
  margin-top: 28px;
}
.hero-proof-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--green); }

/* Right side: memory preview */
.hero-right {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; gap: 10px;
}
.memory-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 18px;
  display: flex; align-items: flex-start; gap: 12px;
  backdrop-filter: blur(16px);
  transition: all 0.4s var(--ease);
  animation: floatCard 0s ease both;
  transform: translateX(40px); opacity: 0;
}
.memory-card.visible { transform: translateX(0); opacity: 1; animation: none; }
.memory-card:hover {
  border-color: var(--border2);
  background: var(--surface2);
  transform: translateX(-4px);
}
.mc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.mc-text { font-size: 13px; color: var(--text2); line-height: 1.5; }
.mc-text strong { color: var(--text); font-weight: 500; }
.mc-age { font-family: var(--font-mono); font-size: 10px; color: var(--text3); margin-left: auto; flex-shrink: 0; }

/* ═══════════════════════════════════════
   SECTION WRAPPER
═══════════════════════════════════════ */
.section { padding: 100px 40px; max-width: 1160px; margin: 0 auto; }
.section-sm { padding: 80px 40px; max-width: 1160px; margin: 0 auto; }

.eyebrow {
  font-family: var(--font-mono);
  font-size: 10px; font-weight: 500; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--text3);
  margin-bottom: 14px;
  display: flex; align-items: center; gap: 10px;
}
.eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--accent2); opacity: 0.5; }

h2 {
  font-family: var(--font-display);
  font-size: clamp(36px, 4vw, 58px);
  font-weight: 300;
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: var(--text);
  margin-bottom: 20px;
}
h2 em { font-style: italic; color: var(--accent2); }

.section-lead {
  font-size: 17px; font-weight: 300; color: var(--text2);
  max-width: 560px; line-height: 1.75;
  margin-bottom: 64px;
}
hr.divider { border: none; border-top: 1px solid var(--border); }

/* ═══════════════════════════════════════
   SCROLL DEMO — pinned conversation
═══════════════════════════════════════ */
.scroll-demo-wrapper {
  display: flex;
  gap: 0;
  position: relative;
}
.scroll-triggers {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.scroll-trigger-item {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 60px 60px 40px;
  opacity: 0.25;
  transition: opacity 0.5s var(--ease);
}
.scroll-trigger-item.active { opacity: 1; }
.sti-persona {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text3);
  margin-bottom: 16px;
}
.sti-persona-dot { width: 6px; height: 6px; border-radius: 50%; }
.sti-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 3vw, 44px);
  font-weight: 300; letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--text);
  margin-bottom: 16px;
}
.sti-title em { font-style: italic; color: var(--accent2); }
.sti-desc { font-size: 15px; color: var(--text2); line-height: 1.7; max-width: 440px; }

/* Sticky panel */
.scroll-panel {
  width: 420px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
}
.chat-window {
  width: 100%;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow), var(--card-glow);
  transition: all 0.3s var(--ease);
}
.chat-topbar {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: var(--surface);
}
.chat-title {
  font-family: var(--font-display);
  font-size: 16px; font-weight: 500;
  letter-spacing: -0.01em;
  display: flex; align-items: center; gap: 8px;
}
.chat-title-ae { color: var(--accent2); font-style: italic; }
.chat-status { font-size: 9px; color: var(--green); font-family: var(--font-mono); letter-spacing: 0.06em; }

.chat-body { padding: 20px 18px; min-height: 340px; display: flex; flex-direction: column; gap: 16px; }

/* Message bubbles */
.msg { display: flex; flex-direction: column; gap: 4px; animation: msgIn 0.4s var(--ease-back) both; }
@keyframes msgIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.msg-user { align-items: flex-end; }
.msg-user .bubble {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 14px 14px 4px 14px;
  padding: 9px 13px;
  font-size: 12px; font-style: italic;
  color: var(--text2);
  max-width: 260px;
  text-align: right;
}
.msg-zaelyn { align-items: flex-start; }
.msg-zaelyn .bubble {
  font-family: var(--font-display);
  font-size: 15px; line-height: 1.65;
  color: var(--text);
  max-width: 320px;
}
.msg-zaelyn .bubble em { font-style: italic; color: var(--accent2); }
.msg-chips { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 2px; }
.chip {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 9px; font-family: var(--font-mono); font-weight: 500;
  padding: 2px 8px; border-radius: 20px;
  border: 1px solid; letter-spacing: 0.03em;
}
.chip-mira { background: rgba(139,92,246,0.08); color: var(--mira); border-color: rgba(139,92,246,0.2); }
.chip-orion { background: rgba(59,130,246,0.08); color: var(--orion); border-color: rgba(59,130,246,0.2); }
.chip-sirius { background: rgba(109,40,217,0.08); color: #a78bfa; border-color: rgba(109,40,217,0.2); }
.chip-polaris { background: rgba(16,185,129,0.08); color: var(--polaris); border-color: rgba(16,185,129,0.2); }
.chip-pleyades { background: rgba(236,72,153,0.08); color: var(--pleyades); border-color: rgba(236,72,153,0.2); }
.chip-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }

.chat-persona-badge {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  border-top: 1px solid var(--border);
  font-family: var(--font-mono); font-size: 9px;
  color: var(--text3); letter-spacing: 0.06em;
}

/* ═══════════════════════════════════════
   KNOWS YOU SECTION
═══════════════════════════════════════ */
.knows-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 48px;
}
.know-card {
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 28px 24px;
  background: var(--surface);
  transition: all 0.3s var(--ease);
  position: relative;
  overflow: hidden;
  cursor: default;
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
}
.know-card::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 16px;
  background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(124,58,237,0.06), transparent 60%);
  opacity: 0; transition: opacity 0.3s;
}
.know-card:hover::before { opacity: 1; }
.know-card:hover {
  border-color: var(--border2);
  box-shadow: var(--card-glow);
}
.kc-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--surface2); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; margin-bottom: 16px;
}
.kc-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
.kc-desc { font-size: 12px; color: var(--text2); line-height: 1.65; }

/* ═══════════════════════════════════════
   PRIVACY — 4 DRAMATIC CARDS
═══════════════════════════════════════ */
.privacy-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.priv-card {
  border-radius: 20px;
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--bg2);
  transition: all 0.35s var(--ease);
  transform-style: preserve-3d;
}
.priv-card:hover {
  transform: perspective(1200px) rotateX(-2deg) rotateY(2deg);
  box-shadow: var(--shadow);
}
.priv-header {
  padding: 24px 24px 20px;
  display: flex; align-items: flex-start; gap: 14px;
  border-bottom: 1px solid var(--border);
  position: relative; overflow: hidden;
}
.priv-header::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
}
.priv-num-badge {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 20px; font-weight: 600; flex-shrink: 0;
}
.priv-title-grp { flex: 1; }
.priv-name { font-size: 16px; font-weight: 600; margin-bottom: 3px; letter-spacing: -0.01em; }
.priv-tagline { font-size: 12px; color: var(--text2); }
.priv-tag {
  font-family: var(--font-mono); font-size: 9px; font-weight: 500;
  padding: 3px 9px; border-radius: 20px; letter-spacing: 0.04em;
  flex-shrink: 0; align-self: flex-start;
}
.priv-points {
  padding: 20px 24px;
  display: flex; flex-direction: column; gap: 10px;
}
.pp {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 13px; color: var(--text2); line-height: 1.5;
}
.pp-icon {
  width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 600; flex-shrink: 0; margin-top: 1px;
}
.pp strong { color: var(--text); font-weight: 500; }
.priv-footer {
  padding: 14px 24px;
  border-top: 1px solid var(--border);
  font-size: 12px; font-style: italic; color: var(--text3);
  line-height: 1.55;
}

/* ═══════════════════════════════════════
   MODULES CONSTELLATION
═══════════════════════════════════════ */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.mod-card {
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 22px 20px;
  background: var(--bg2);
  position: relative; overflow: hidden;
  transition: all 0.3s var(--ease);
}
.mod-card:hover { border-color: var(--border2); transform: translateY(-3px); box-shadow: var(--shadow); }
.mod-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
.mod-phase {
  position: absolute; top: 14px; right: 14px;
  font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.06em;
  padding: 2px 7px; border-radius: 4px;
  background: var(--surface); color: var(--text3);
  border: 1px solid var(--border);
}
.mod-family {
  font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em;
  text-transform: uppercase; margin-bottom: 10px;
  display: flex; align-items: center; gap: 6px;
}
.mod-family-dot { width: 5px; height: 5px; border-radius: 50%; }
.mod-name {
  font-family: var(--font-display);
  font-size: 28px; font-weight: 400; letter-spacing: -0.02em;
  margin-bottom: 6px;
}
.mod-desc { font-size: 12px; color: var(--text2); line-height: 1.6; margin-bottom: 12px; }
.mod-features { display: flex; flex-direction: column; gap: 4px; }
.mf { font-size: 11px; color: var(--text3); display: flex; align-items: center; gap: 6px; }
.mf::before { content:'·'; color: inherit; font-size: 14px; }

/* ═══════════════════════════════════════
   LANGUAGE SECTION
═══════════════════════════════════════ */
.lang-strip {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2px;
  position: relative; overflow: hidden;
}
.lang-strip::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,58,237,0.04), transparent);
}
.lang-item {
  padding: 28px 32px;
  border-right: 1px solid var(--border);
  position: relative; z-index: 1;
}
.lang-item:last-child { border-right: none; }
.lang-code {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em;
  color: var(--accent2); margin-bottom: 8px;
  display: flex; align-items: center; gap: 8px;
}
.lang-name {
  font-family: var(--font-display);
  font-size: 32px; font-weight: 300; letter-spacing: -0.02em;
  margin-bottom: 8px; color: var(--text);
}
.lang-example {
  font-size: 12px; color: var(--text2); font-style: italic; line-height: 1.6;
}

/* ═══════════════════════════════════════
   COMPARE TABLE
═══════════════════════════════════════ */
.compare-wrap {
  border-radius: 20px;
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--bg2);
}
.compare-row {
  display: grid;
  grid-template-columns: 200px 1fr 1fr 1fr;
  border-bottom: 1px solid var(--border);
}
.compare-row:last-child { border-bottom: none; }
.compare-row.header-row { background: var(--surface); }
.compare-row.section-row { background: var(--bg3); }
.cc {
  padding: 12px 16px;
  font-size: 13px; color: var(--text2);
  border-right: 1px solid var(--border);
}
.cc:last-child { border-right: none; }
.cc.dim { font-weight: 500; color: var(--text); }
.cc.header { font-size: 12px; font-weight: 600; }
.cc.section-label {
  font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text3);
  grid-column: 1/-1; border-right: none; padding: 8px 16px;
}
.win { color: var(--green); } .lose { color: var(--red); }
.tag-w { display:inline-block; font-family: var(--font-mono); font-size:8px; padding:1px 6px; border-radius:4px; background:rgba(16,185,129,0.1); color:var(--green); font-weight:500; margin-left:4px; }
.tag-n { display:inline-block; font-family: var(--font-mono); font-size:8px; padding:1px 6px; border-radius:4px; background:rgba(124,58,237,0.1); color:var(--accent2); font-weight:500; margin-left:4px; }

/* ═══════════════════════════════════════
   CTA + FOOTER
═══════════════════════════════════════ */
.cta-section {
  text-align: center;
  padding: 120px 40px;
  position: relative; overflow: hidden;
}
.cta-glow {
  position: absolute;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.cta-section h2 { margin-bottom: 20px; }
.cta-section p { color: var(--text2); font-size: 17px; max-width: 420px; margin: 0 auto 40px; font-weight: 300; line-height: 1.7; }
.cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn-cta-primary {
  background: var(--accent); color: #fff; border: none;
  padding: 14px 32px; border-radius: 12px;
  font-size: 15px; font-weight: 500;
  transition: all 0.25s var(--ease);
}
.btn-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(124,58,237,0.45); }
.btn-cta-ghost {
  background: var(--surface); color: var(--text2);
  border: 1px solid var(--border2);
  padding: 14px 28px; border-radius: 12px;
  font-size: 15px; transition: all 0.25s var(--ease);
}
.btn-cta-ghost:hover { color: var(--text); border-color: var(--accent2); }

footer {
  padding: 24px 40px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
}
.footer-brand {
  font-family: var(--font-display); font-size: 13px;
  color: var(--text3); letter-spacing: 0.01em;
}
.footer-brand strong { color: var(--text2); font-weight: 400; }
.footer-links { display: flex; gap: 20px; }
.footer-links a { font-size: 12px; color: var(--text3); transition: color 0.2s; }
.footer-links a:hover { color: var(--text2); }

/* ═══════════════════════════════════════
   UTILITIES
═══════════════════════════════════════ */
.reveal {
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}
.reveal.in { opacity: 1; transform: translateY(0); }
.reveal-d1 { transition-delay: 0.1s; }
.reveal-d2 { transition-delay: 0.2s; }
.reveal-d3 { transition-delay: 0.3s; }

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 900px) {
  nav { padding: 0 20px; }
  .nav-links { display: none; }
  .hero { grid-template-columns: 1fr; padding: 80px 20px 40px; }
  .hero-right { display: none; }
  .scroll-demo-wrapper { flex-direction: column; }
  .scroll-panel { position: relative; top: 0; height: auto; width: 100%; padding: 0 20px 40px; }
  .scroll-trigger-item { min-height: auto; padding: 40px 20px; opacity: 1; }
  .section, .section-sm { padding: 60px 20px; }
  .knows-grid, .modules-grid { grid-template-columns: 1fr 1fr; }
  .privacy-grid { grid-template-columns: 1fr; }
  .lang-strip { grid-template-columns: 1fr; }
  .lang-item { border-right: none; border-bottom: 1px solid var(--border); }
  .lang-item:last-child { border-bottom: none; }
  .compare-row { grid-template-columns: 100px 1fr 1fr 1fr; }
  .cta-section { padding: 80px 20px; }
  footer { padding: 20px; }
  h1 { font-size: 44px; }
  h2 { font-size: 34px; }
}
@media (max-width: 600px) {
  .knows-grid, .modules-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<!-- ═══════════════ NAV ═══════════════ -->
<nav>
  <div class="nav-logo">
    <span class="nav-logo-dot"></span>
    Z<span class="nav-logo-ae">ae</span>lyn
  </div>
  <div class="nav-links">
    <a href="#conoce" data-i18n="nav_knows">Te conoce</a>
    <a href="#privacidad" data-i18n="nav_priv">Privacidad</a>
    <a href="#modulos" data-i18n="nav_mods">Módulos</a>
    <a href="#beta" data-i18n="nav_beta">Beta</a>
  </div>
  <div class="nav-controls">
    <select class="lang-select" id="langSelect">
      <option value="es">ES</option>
      <option value="en">EN</option>
      <option value="pt">PT</option>
    </select>
    <button class="theme-btn" id="themeBtn" title="Toggle theme">🌙</button>
    <button class="nav-cta" data-i18n="nav_cta">Empieza →</button>
  </div>
</nav>

<!-- ═══════════════ CANVAS ═══════════════ -->
<canvas id="constellation"></canvas>

<!-- ═══════════════ HERO ═══════════════ -->
<section class="hero">
  <div class="hero-left">
    <div class="hero-kicker">
      <span class="hero-kicker-line"></span>
      <span data-i18n="hero_kicker">National Expertise · NE DevIA</span>
      <span class="hero-kicker-line"></span>
    </div>
    <h1>
      <em data-i18n="hero_h1a">La IA que te conoce,</em>
      <strong data-i18n="hero_h1b">aprende contigo</strong>
      <span data-i18n="hero_h1c">y cuida tu privacidad.</span>
    </h1>
    <p class="hero-sub" data-i18n="hero_sub">No es un chatbot que olvida. Es Zaelyn — la primera IA que construye una memoria real de tu vida y la protege como tú decides.</p>
    <div class="hero-actions">
      <button class="btn-hero btn-hero-primary" data-i18n="hero_cta1">Empieza a hablar</button>
      <button class="btn-hero btn-hero-ghost" onclick="document.getElementById('conoce').scrollIntoView({behavior:'smooth'})" data-i18n="hero_cta2">Ver cómo funciona ↓</button>
    </div>
    <div class="hero-proof">
      <span class="hero-proof-dot"></span>
      <span data-i18n="hero_proof">Tres idiomas · Cuatro niveles de privacidad · Tu memoria, tus reglas</span>
    </div>
  </div>
  <div class="hero-right" id="heroMemories">
    <!-- populated by JS -->
  </div>
</section>

<hr class="divider">

<!-- ═══════════════ SCROLL DEMO ═══════════════ -->
<div id="conoce" style="padding: 0 40px; max-width: 1160px; margin: 0 auto 0;">
  <div class="section-sm" style="padding-bottom: 20px;">
    <div class="eyebrow" data-i18n="demo_eyebrow">La IA que te conoce</div>
    <h2 data-i18n="demo_h2">Zaelyn <em>sabe</em> quién eres,<br>lo que vives, lo que necesitas.</h2>
    <p class="section-lead" data-i18n="demo_lead">Cinco personas distintas. Una Zaelyn que se adapta a cada una.</p>
  </div>
</div>

<div style="max-width: 1160px; margin: 0 auto; padding: 0 40px 100px;">
  <div class="scroll-demo-wrapper" id="scrollDemo">
    <div class="scroll-triggers" id="scrollTriggers">

      <div class="scroll-trigger-item active" data-conv="0">
        <div class="sti-persona">
          <span class="sti-persona-dot" style="background:#ec4899"></span>
          <span data-i18n="s0_persona">Mamá de familia</span>
        </div>
        <div class="sti-title" data-i18n="s0_title">Sofía, 38 años.<br>Dos hijos, mil cosas<br><em>en la cabeza.</em></div>
        <p class="sti-desc" data-i18n="s0_desc">Zaelyn sabe que Mateo es alérgico a los mariscos, que Carmen tiene examen el viernes, que el pediatra llamó la semana pasada. Y recuerda que hoy fue un día muy largo.</p>
      </div>

      <div class="scroll-trigger-item" data-conv="1">
        <div class="sti-persona">
          <span class="sti-persona-dot" style="background:#3b82f6"></span>
          <span data-i18n="s1_persona">Freelancer creativa</span>
        </div>
        <div class="sti-title" data-i18n="s1_title">Ana, diseñadora.<br>Clientes, deadlines,<br><em>metas de negocio.</em></div>
        <p class="sti-desc" data-i18n="s1_desc">Zaelyn sabe que Carlos Mendoza del estudio de arquitectura quiere trabajar con ella, que la propuesta de Inés vence el viernes y que su meta es 3 clientes nuevos este mes.</p>
      </div>

      <div class="scroll-trigger-item" data-conv="2">
        <div class="sti-persona">
          <span class="sti-persona-dot" style="background:#10b981"></span>
          <span data-i18n="s2_persona">Emprendedor</span>
        </div>
        <div class="sti-title" data-i18n="s2_title">Miguel, fundador.<br>Decisions grandes,<br><em>mente llena.</em></div>
        <p class="sti-desc" data-i18n="s2_desc">Zaelyn sabe qué decidió la semana pasada, por qué, y qué está dejando sin resolver. No le da listas — le da claridad. Conecta lo de hoy con lo de antes.</p>
      </div>

      <div class="scroll-trigger-item" data-conv="3">
        <div class="sti-persona">
          <span class="sti-persona-dot" style="background:#8b5cf6"></span>
          <span data-i18n="s3_persona">Familia completa</span>
        </div>
        <div class="sti-title" data-i18n="s3_title">La familia Rodríguez.<br>Cuatro personas,<br><em>una sola Zaelyn.</em></div>
        <p class="sti-desc" data-i18n="s3_desc">Zaelyn sabe qué actividades tienen los hijos, cuándo toma su medicamento el abuelo, cuál es el presupuesto del mes y qué tiene el calendario familiar para el fin de semana.</p>
      </div>

      <div class="scroll-trigger-item" data-conv="4">
        <div class="sti-persona">
          <span class="sti-persona-dot" style="background:#f59e0b"></span>
          <span data-i18n="s4_persona">Bienestar personal</span>
        </div>
        <div class="sti-title" data-i18n="s4_title">Luis, 41 años.<br>Quiere cambiar hábitos.<br><em>Zaelyn lo acompaña.</em></div>
        <p class="sti-desc" data-i18n="s4_desc">Zaelyn sabe que lleva dos semanas sin dormir bien, que su meta es bajar 8 kilos antes de diciembre y que este lunes fue el primer día que cumplió con el ejercicio de mañana.</p>
      </div>

    </div>
    <div class="scroll-panel">
      <div class="chat-window" id="chatWindow">
        <div class="chat-topbar">
          <div class="chat-title">Z<span class="chat-title-ae">ae</span>lyn</div>
          <div class="chat-status" id="chatPersonaLabel">● Cálida · activa</div>
        </div>
        <div class="chat-body" id="chatBody">
          <!-- populated by JS -->
        </div>
        <div class="chat-persona-badge" id="chatBadge">◈ Sovereign · sin logs · zaelyn.ai</div>
      </div>
    </div>
  </div>
</div>
<hr class="divider">

<!-- ═══════════════ KNOWS YOU ═══════════════ -->
<div class="section" style="padding-bottom:60px;">
  <div class="eyebrow reveal" data-i18n="knows_eyebrow">Por qué te conoce</div>
  <h2 class="reveal reveal-d1" data-i18n="knows_h2">No es contexto.<br>Es <em>memoria real.</em></h2>
  <p class="section-lead reveal reveal-d2" data-i18n="knows_lead">Zaelyn construye un grafo vivo de tu vida — hechos, preferencias, decisiones, personas. Y lo protege como tú decides.</p>
  <div class="knows-grid">
    <div class="know-card reveal" data-i18n-card="k0">
      <div class="kc-icon">🧠</div>
      <div class="kc-title" data-i18n="k0_t">Memoria de 3 capas</div>
      <div class="kc-desc" data-i18n="k0_d">Conversación activa, historial reciente y hechos permanentes. Zaelyn sabe lo que dijiste hace 5 minutos y lo que le contaste hace 3 meses.</div>
    </div>
    <div class="know-card reveal reveal-d1">
      <div class="kc-icon">👥</div>
      <div class="kc-title" data-i18n="k1_t">People Graph</div>
      <div class="kc-desc" data-i18n="k1_d">Cada persona que mencionas queda en tu grafo de contactos con contexto: "Carlos Mendoza — arquitecto — quiere trabajar contigo — mencionado 3 veces."</div>
    </div>
    <div class="know-card reveal reveal-d2">
      <div class="kc-icon">💭</div>
      <div class="kc-title" data-i18n="k2_t">Estado emocional</div>
      <div class="kc-desc" data-i18n="k2_d">Zaelyn detecta cómo estás hoy. Si la semana fue pesada, lo nota. Si algo te alegró, lo celebra. Su tono se adapta a tu momento — no al tuyo de ayer.</div>
    </div>
    <div class="know-card reveal">
      <div class="kc-icon">🎯</div>
      <div class="kc-title" data-i18n="k3_t">Metas como organismos</div>
      <div class="kc-desc" data-i18n="k3_d">Tus metas tienen salud, momentum y un "Por Qué" como código genético. Zaelyn detecta si estás acercándote o alejándote — aunque no lo menciones.</div>
    </div>
    <div class="know-card reveal reveal-d1">
      <div class="kc-icon">📅</div>
      <div class="kc-title" data-i18n="k4_t">Compromisos bilaterales</div>
      <div class="kc-desc" data-i18n="k4_d">No confunde lo que tú debes hacer con lo que te prometieron a ti. Lleva el registro de ambos lados — y te recuerda cuando el tiempo se acaba.</div>
    </div>
    <div class="know-card reveal reveal-d2">
      <div class="kc-icon">✨</div>
      <div class="kc-title" data-i18n="k5_t">5 personalidades</div>
      <div class="kc-desc" data-i18n="k5_d">Elige cómo quieres que Zaelyn te hable: Serena, Viva, Lúcida, Cálida o Sabia. Su forma de responder cambia — su conocimiento de ti nunca.</div>
    </div>
  </div>
</div>
<hr class="divider">

<!-- ═══════════════ PRIVACY ═══════════════ -->
<div class="section" id="privacidad">
  <div class="eyebrow reveal" data-i18n="priv_eyebrow">Privacidad verificable</div>
  <h2 class="reveal reveal-d1" data-i18n="priv_h2">Tú decides cuánto<br><em>sabe</em> de ti.</h2>
  <p class="section-lead reveal reveal-d2" data-i18n="priv_lead">Cuatro niveles. Desde máxima inteligencia hasta anonimato verificable. Cambia de nivel en cualquier conversación.</p>
  <div class="privacy-grid">

    <div class="priv-card reveal">
      <div class="priv-header" style="--accent-c:rgba(107,114,128,0.1)">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:rgba(107,114,128,0.4)"></div>
        <div class="priv-num-badge" style="background:rgba(107,114,128,0.12);color:#9ca3af">1</div>
        <div class="priv-title-grp">
          <div class="priv-name" data-i18n="p1_name">Comfort</div>
          <div class="priv-tagline" data-i18n="p1_tag">Máxima inteligencia contextual</div>
        </div>
        <span class="priv-tag" style="background:rgba(107,114,128,0.1);color:#9ca3af" data-i18n="p1_badge">Default</span>
      </div>
      <div class="priv-points">
        <div class="pp"><div class="pp-icon" style="background:rgba(239,68,68,0.1);color:#ef4444">✕</div><span data-i18n="p1_p1">Zaelyn <strong>recuerda todo</strong> — conversaciones, módulos, historial completo.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(239,68,68,0.1);color:#ef4444">✕</div><span data-i18n="p1_p2">La IA conoce tu nombre, ciudad, contexto y patrones de comportamiento.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p1_p3"><strong>Mejor experiencia posible.</strong> Zaelyn te conoce a fondo desde el primer día.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p1_p4">Los módulos se alimentan y sincronizan automáticamente en todos tus canales.</span></div>
      </div>
      <div class="priv-footer" data-i18n="p1_footer">Como ChatGPT Memory — pero con módulos estructurados y privacidad mejorable en cualquier momento.</div>
    </div>

    <div class="priv-card reveal reveal-d1">
      <div class="priv-header">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#3b82f6,#60a5fa)"></div>
        <div class="priv-num-badge" style="background:rgba(59,130,246,0.12);color:#60a5fa">2</div>
        <div class="priv-title-grp">
          <div class="priv-name" style="color:#60a5fa" data-i18n="p2_name">Sovereign</div>
          <div class="priv-tagline" data-i18n="p2_tag">Módulos activos · conversación privada</div>
        </div>
        <span class="priv-tag" style="background:rgba(59,130,246,0.1);color:#60a5fa" data-i18n="p2_badge">Recomendado</span>
      </div>
      <div class="priv-points">
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p2_p1">Las conversaciones <strong>no se loggean.</strong> No quedan en ningún servidor.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p2_p2"><strong>Los módulos sí persisten</strong> — diario, tareas y metas guardados cifrados.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p2_p3">Zaelyn usa el contexto de tus módulos pero no almacena el chat en bruto.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(245,158,11,0.1);color:#f59e0b">~</div><span data-i18n="p2_p4">La IA conoce lo que guardaste explícitamente — no inferencias del chat.</span></div>
      </div>
      <div class="priv-footer" data-i18n="p2_footer">El equilibrio perfecto: toda la funcionalidad de los módulos, sin logs de conversación.</div>
    </div>

    <div class="priv-card reveal">
      <div class="priv-header">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#7c3aed,#a78bfa)"></div>
        <div class="priv-num-badge" style="background:rgba(124,58,237,0.15);color:#a78bfa">3</div>
        <div class="priv-title-grp">
          <div class="priv-name" style="color:#a78bfa" data-i18n="p3_name">Phantom Mode ◈</div>
          <div class="priv-tagline" data-i18n="p3_tag">Tu identidad desaparece de la ecuación</div>
        </div>
        <span class="priv-tag" style="background:rgba(167,139,250,0.1);color:#a78bfa" data-i18n="p3_badge">Nuevo</span>
      </div>
      <div class="priv-points">
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p3_p1"><strong>Token anónimo de 4h</strong> — nunca ligado a tu user_id real.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p3_p2">La IA no sabe quién pregunta. <strong>Verificable:</strong> exporta y confirma cero registros.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p3_p3">Al cerrar el tab el token se destruye. La sesión desaparece completamente.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(167,139,250,0.1);color:#a78bfa">◈</div><span data-i18n="p3_p4">3 sub-modos: <strong>Puro</strong> (nada), <strong>Selectivo</strong> (tú apruebas), <strong>Cifrado</strong> (E2E).</span></div>
      </div>
      <div class="priv-footer" data-i18n="p3_footer">Diseñado para temas sensibles o cualquier conversación que no debe existir después.</div>
    </div>

    <div class="priv-card reveal reveal-d1">
      <div class="priv-header">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#059669,#34d399)"></div>
        <div class="priv-num-badge" style="background:rgba(16,185,129,0.12);color:#34d399">4</div>
        <div class="priv-title-grp">
          <div class="priv-name" style="color:#34d399" data-i18n="p4_name">Full Sovereign</div>
          <div class="priv-tagline" data-i18n="p4_tag">Modelo local — ningún servidor ve nada</div>
        </div>
        <span class="priv-tag" style="background:rgba(16,185,129,0.1);color:#34d399" data-i18n="p4_badge">Fase II</span>
      </div>
      <div class="priv-points">
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p4_p1">La IA corre <strong>en tu dispositivo</strong> con Ollama. Ningún dato sale de tu hardware.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p4_p2">Módulos guardados localmente. <strong>Cero servidores de terceros</strong> involucrados.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✓</div><span data-i18n="p4_p3">Funciona sin internet para todas las funciones de IA.</span></div>
        <div class="pp"><div class="pp-icon" style="background:rgba(245,158,11,0.1);color:#f59e0b">~</div><span data-i18n="p4_p4">Requiere Ollama instalado. Calidad del modelo depende de tu hardware.</span></div>
      </div>
      <div class="priv-footer" data-i18n="p4_footer">La única privacidad 100% verificable. Si no hay tráfico de red, es real.</div>
    </div>

  </div>
</div>
<hr class="divider">

<!-- ═══════════════ MODULES ═══════════════ -->
<div class="section" id="modulos">
  <div class="eyebrow reveal" data-i18n="mod_eyebrow">Constelación de módulos</div>
  <h2 class="reveal reveal-d1" data-i18n="mod_h2">Cada aspecto de tu vida,<br><em>un módulo especializado.</em></h2>
  <p class="section-lead reveal reveal-d2" data-i18n="mod_lead">Todos conectados. Todos alimentando a Zaelyn. Todos bajo tus reglas de privacidad.</p>
  <div class="modules-grid">
    <div class="mod-card reveal" style="--mc: var(--mira)">
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:var(--mira)"></div>
      <div class="mod-family" style="color:var(--mira)"><span class="mod-family-dot" style="background:var(--mira)"></span><span data-i18n="fam_mem">Memoria</span></div>
      <div class="mod-name" style="color:var(--mira)">Mira</div>
      <div class="mod-desc" data-i18n="mira_d">Tu diario personal enriquecido por IA. Captura desde Telegram, voz, foto o texto. Mood automático, mapa de emociones, Wrapped anual.</div>
      <div class="mod-features">
        <div class="mf" data-i18n="mira_f1">Captura multi-canal: voz, foto, texto</div>
        <div class="mf" data-i18n="mira_f2">Mood detectado automáticamente</div>
        <div class="mf" data-i18n="mira_f3">Mira Wrapped — tu año en estadísticas</div>
      </div>
    </div>
    <div class="mod-card reveal reveal-d1">
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:var(--sirius)"></div>
      <div class="mod-family" style="color:var(--sirius)"><span class="mod-family-dot" style="background:var(--sirius)"></span><span data-i18n="fam_mem">Memoria</span></div>
      <div class="mod-name" style="color:var(--sirius)">Sirius</div>
      <div class="mod-desc" data-i18n="sirius_d">Tu grafo de conocimiento y People Graph. Ideas, conceptos, personas y sus conexiones. Búsqueda semántica vectorial.</div>
      <div class="mod-features">
        <div class="mf" data-i18n="sirius_f1">People Graph: personas + contexto</div>
        <div class="mf" data-i18n="sirius_f2">Búsqueda semántica en tu conocimiento</div>
        <div class="mf" data-i18n="sirius_f3">Captura automática de entidades</div>
      </div>
    </div>
    <div class="mod-card reveal reveal-d2">
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:var(--orion)"></div>
      <div class="mod-family" style="color:var(--orion)"><span class="mod-family-dot" style="background:var(--orion)"></span><span data-i18n="fam_action">Acción</span></div>
      <div class="mod-name" style="color:var(--orion)">Orion</div>
      <div class="mod-desc" data-i18n="orion_d">Tareas, compromisos y hábitos con lógicas distintas. Distingue lo que debes hacer tú de lo que prometiste a alguien más.</div>
      <div class="mod-features">
        <div class="mf" data-i18n="orion_f1">Compromisos: yo debo / me deben</div>
        <div class="mf" data-i18n="orion_f2">Hábitos con racha y tolerancia de fallo</div>
        <div class="mf" data-i18n="orion_f3">Avisos cuando algo vence</div>
      </div>
    </div>
    <div class="mod-card reveal">
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:var(--polaris)"></div>
      <div class="mod-family" style="color:var(--polaris)"><span class="mod-family-dot" style="background:var(--polaris)"></span><span data-i18n="fam_action">Acción</span></div>
      <div class="mod-name" style="color:var(--polaris)">Polaris</div>
      <div class="mod-desc" data-i18n="polaris_d">Tus metas como organismos vivos. Con salud, momentum y el Por Qué como código genético. El Obituario al completarlas.</div>
      <div class="mod-features">
        <div class="mf" data-i18n="polaris_f1">Metas con salud y momentum</div>
        <div class="mf" data-i18n="polaris_f2">Detección inversa de metas implícitas</div>
        <div class="mf" data-i18n="polaris_f3">Goals Wrapped anual</div>
      </div>
    </div>
    <div class="mod-card reveal reveal-d1" style="opacity:0.75">
      <div class="mod-phase" data-i18n="phase2">Fase II</div>
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:var(--pulsar)"></div>
      <div class="mod-family" style="color:var(--pulsar)"><span class="mod-family-dot" style="background:var(--pulsar)"></span><span data-i18n="fam_social">Social</span></div>
      <div class="mod-name" style="color:var(--pulsar)">Pulsar</div>
      <div class="mod-desc" data-i18n="pulsar_d">La red social que deriva de tu vida real. Comparte lo que ya capturaste. Sin algoritmo de engagement. Sin likes públicos.</div>
      <div class="mod-features">
        <div class="mf" data-i18n="pulsar_f1">Contenido real — no creado desde cero</div>
        <div class="mf" data-i18n="pulsar_f2">Feed cronológico sin manipulación</div>
      </div>
    </div>
    <div class="mod-card reveal reveal-d2" style="opacity:0.65">
      <div class="mod-phase" data-i18n="phase2">Fase II</div>
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:var(--pleyades)"></div>
      <div class="mod-family" style="color:var(--pleyades)"><span class="mod-family-dot" style="background:var(--pleyades)"></span><span data-i18n="fam_family">Familia</span></div>
      <div class="mod-name" style="color:var(--pleyades)">Pléyades</div>
      <div class="mod-desc" data-i18n="pleyades_d">La memoria colectiva de tu familia y grupos cercanos. Calendarios, expediente médico familiar, metas compartidas.</div>
      <div class="mod-features">
        <div class="mf" data-i18n="pleyades_f1">Espacios: familia, pareja, equipo</div>
        <div class="mf" data-i18n="pleyades_f2">Sync con Google Cal, Apple, Alexa</div>
      </div>
    </div>
  </div>
</div>
<hr class="divider">

<!-- ═══════════════ LANGUAGE ═══════════════ -->
<div class="section-sm">
  <div class="eyebrow reveal" data-i18n="lang_eyebrow">Tres idiomas nativos</div>
  <h2 class="reveal reveal-d1" data-i18n="lang_h2">Zaelyn te habla<br>en <em>tu idioma.</em></h2>
  <p style="color:var(--text2);font-size:16px;font-weight:300;line-height:1.7;max-width:520px;margin-bottom:40px" class="reveal reveal-d2" data-i18n="lang_sub">No es traducción automática. Zaelyn piensa, recuerda y responde en inglés, español y portugués. Cambia de idioma en medio de la conversación — Zaelyn te sigue.</p>
  <div class="lang-strip reveal">
    <div class="lang-item">
      <div class="lang-code">🇺🇸 EN</div>
      <div class="lang-name">English</div>
      <div class="lang-example" data-i18n="lang_ex_en">"I know you've been thinking about this for days. Let me reflect back what you've told me."</div>
    </div>
    <div class="lang-item">
      <div class="lang-code">🇲🇽 ES</div>
      <div class="lang-name">Español</div>
      <div class="lang-example" data-i18n="lang_ex_es">"Sé que llevas días dándole vueltas a esto. Déjame reflejar lo que me has contado."</div>
    </div>
    <div class="lang-item">
      <div class="lang-code">🇧🇷 PT</div>
      <div class="lang-name">Português</div>
      <div class="lang-example" data-i18n="lang_ex_pt">"Sei que você está pensando nisso há dias. Deixa eu refletir o que você me contou."</div>
    </div>
  </div>
</div>
<hr class="divider">

<!-- ═══════════════ COMPARE ═══════════════ -->
<div class="section-sm">
  <div class="eyebrow reveal" data-i18n="cmp_eyebrow">Posicionamiento</div>
  <h2 class="reveal reveal-d1" data-i18n="cmp_h2">Zaelyn no <em>compite.</em><br>Resuelve algo distinto.</h2>
  <p style="color:var(--text2);font-size:16px;font-weight:300;line-height:1.7;max-width:520px;margin-bottom:48px" class="reveal reveal-d2" data-i18n="cmp_sub">Hay IA que sabe todo de ti pero te vigila. Hay IA privada pero amnésica. Zaelyn es el tercero que faltaba.</p>
  <div class="compare-wrap reveal">
    <div class="compare-row header-row">
      <div class="cc dim header" data-i18n="c_dim">Dimensión</div>
      <div class="cc header" style="color:#60a5fa">ChatGPT / Claude</div>
      <div class="cc header" style="color:#a78bfa">Venice.AI</div>
      <div class="cc header" style="color:var(--accent2)">Zaelyn.AI</div>
    </div>
    <div class="compare-row section-row"><div class="cc section-label" data-i18n="c_s1">Privacidad</div></div>
    <div class="compare-row">
      <div class="cc dim" data-i18n="c_r1">Tus datos</div>
      <div class="cc"><span class="lose" data-i18n="c_r1a">Guarda todo</span></div>
      <div class="cc"><span class="win" data-i18n="c_r1b">No guarda nada</span></div>
      <div class="cc"><span class="win" data-i18n="c_r1c">Tú decides</span><span class="tag-n">4 niveles</span></div>
    </div>
    <div class="compare-row">
      <div class="cc dim" data-i18n="c_r2">Verificable</div>
      <div class="cc"><span class="lose">No</span></div>
      <div class="cc"><span class="win" data-i18n="c_r2b">TEE + E2EE</span></div>
      <div class="cc"><span class="win" data-i18n="c_r2c">Phantom</span><span class="tag-n" data-i18n="c_new">nuevo</span></div>
    </div>
    <div class="compare-row section-row"><div class="cc section-label" data-i18n="c_s2">Memoria</div></div>
    <div class="compare-row">
      <div class="cc dim" data-i18n="c_r3">Te conoce</div>
      <div class="cc"><span style="color:var(--amber)" data-i18n="c_r3a">Historial básico</span></div>
      <div class="cc"><span class="lose" data-i18n="c_r3b">No · amnésica</span></div>
      <div class="cc"><span class="win" data-i18n="c_r3c">4 módulos de vida real</span><span class="tag-w" data-i18n="c_unique">único</span></div>
    </div>
    <div class="compare-row">
      <div class="cc dim" data-i18n="c_r4">Estado emocional</div>
      <div class="cc"><span class="lose">No</span></div>
      <div class="cc"><span class="lose">No</span></div>
      <div class="cc"><span class="win" data-i18n="c_r4c">Detecta y adapta</span><span class="tag-w" data-i18n="c_unique">único</span></div>
    </div>
    <div class="compare-row section-row"><div class="cc section-label" data-i18n="c_s3">Acceso</div></div>
    <div class="compare-row">
      <div class="cc dim" data-i18n="c_r5">Canales</div>
      <div class="cc">Web + App</div>
      <div class="cc">Web + App</div>
      <div class="cc"><span class="win">Web + Telegram + WhatsApp</span><span class="tag-w" data-i18n="c_adv">ventaja</span></div>
    </div>
    <div class="compare-row">
      <div class="cc dim" data-i18n="c_r6">Idiomas</div>
      <div class="cc" data-i18n="c_r6a">Inglés</div>
      <div class="cc" data-i18n="c_r6a">Inglés</div>
      <div class="cc"><span class="win">ES · EN · PT</span><span class="tag-w">Américas</span></div>
    </div>
  </div>
</div>
<hr class="divider">

<!-- ═══════════════ CTA ═══════════════ -->
<div class="cta-section" id="beta">
  <div class="cta-glow"></div>
  <div class="eyebrow reveal" style="justify-content:center" data-i18n="cta_eyebrow">Beta por invitación</div>
  <h2 class="reveal reveal-d1" data-i18n="cta_h2">Empieza a construir<br>tu <em>segunda mente.</em></h2>
  <p class="reveal reveal-d2" data-i18n="cta_sub">Zaelyn está en beta. Los primeros usuarios definen el producto. Entra por invitación y sé parte del origen.</p>
  <div class="cta-buttons reveal reveal-d2">
    <button class="btn-cta-primary" data-i18n="cta_btn1">Pedir invitación beta</button>
    <button class="btn-cta-ghost" data-i18n="cta_btn2">Contactar NE America →</button>
  </div>
</div>

<footer>
  <div class="footer-brand">
    <strong>Zaelyn</strong> · Diseñado por National Expertise · NE DevIA<br>
    <span style="font-size:11px;color:var(--text3)">NE America · Houston, TX &amp; NE México · Monterrey / Chihuahua · 2026</span>
  </div>
  <div class="footer-links">
    <a href="#" data-i18n="f_priv">Privacidad</a>
    <a href="#" data-i18n="f_terms">Términos</a>
    <a href="https://zaera.ai" style="color:var(--text3)">zaera.ai</a>
    <a href="http://national.expert" style="color:var(--text3)">national.expert</a>
  </div>
</footer>

<!-- ═══════════════════════════════════════
   JAVASCRIPT
═══════════════════════════════════════ -->
<script>
// ─── TRANSLATIONS ─────────────────────────────────
const T = {
es:{
  nav_knows:"Te conoce",nav_priv:"Privacidad",nav_mods:"Módulos",nav_beta:"Beta",nav_cta:"Empieza →",
  hero_kicker:"National Expertise · NE DevIA",
  hero_h1a:"La IA que te conoce,",hero_h1b:"aprende contigo",hero_h1c:"y cuida tu privacidad.",
  hero_sub:"No es un chatbot que olvida. Es Zaelyn — la primera IA que construye una memoria real de tu vida y la protege como tú decides.",
  hero_cta1:"Empieza a hablar",hero_cta2:"Ver cómo funciona ↓",
  hero_proof:"Tres idiomas · Cuatro niveles de privacidad · Tu memoria, tus reglas",
  demo_eyebrow:"La IA que te conoce",
  demo_h2:"Zaelyn sabe quién eres,\\nlo que vives, lo que necesitas.",
  demo_lead:"Cinco personas distintas. Una Zaelyn que se adapta a cada una.",
  s0_persona:"Mamá de familia",s0_title:"Sofía, 38 años.\\nDos hijos, mil cosas\\nen la cabeza.",s0_desc:"Zaelyn sabe que Mateo es alérgico a los mariscos, que Carmen tiene examen el viernes, que el pediatra llamó la semana pasada. Y recuerda que hoy fue un día muy largo.",
  s1_persona:"Freelancer creativa",s1_title:"Ana, diseñadora.\\nClientes, deadlines,\\nmetas de negocio.",s1_desc:"Zaelyn sabe que Carlos Mendoza del estudio de arquitectura quiere trabajar con ella, que la propuesta de Inés vence el viernes y que su meta es 3 clientes nuevos este mes.",
  s2_persona:"Emprendedor",s2_title:"Miguel, fundador.\\nDecisiones grandes,\\nmente llena.",s2_desc:"Zaelyn sabe qué decidió la semana pasada, por qué, y qué está dejando sin resolver. No le da listas — le da claridad. Conecta lo de hoy con lo de antes.",
  s3_persona:"Familia completa",s3_title:"La familia Rodríguez.\\nCuatro personas,\\nuna sola Zaelyn.",s3_desc:"Zaelyn sabe qué actividades tienen los hijos, cuándo toma su medicamento el abuelo, cuál es el presupuesto del mes y qué tiene el calendario familiar para el fin de semana.",
  s4_persona:"Bienestar personal",s4_title:"Luis, 41 años.\\nQuiere cambiar hábitos.\\nZaelyn lo acompaña.",s4_desc:"Zaelyn sabe que lleva dos semanas sin dormir bien, que su meta es bajar 8 kilos antes de diciembre y que este lunes fue el primer día que cumplió con el ejercicio de mañana.",
  knows_eyebrow:"Por qué te conoce",knows_h2:"No es contexto.\\nEs memoria real.",knows_lead:"Zaelyn construye un grafo vivo de tu vida — hechos, preferencias, decisiones, personas. Y lo protege como tú decides.",
  k0_t:"Memoria de 3 capas",k0_d:"Conversación activa, historial reciente y hechos permanentes. Zaelyn sabe lo que dijiste hace 5 minutos y lo que le contaste hace 3 meses.",
  k1_t:"People Graph",k1_d:"Cada persona que mencionas queda en tu grafo de contactos con contexto: \\"Carlos Mendoza — arquitecto — quiere trabajar contigo — mencionado 3 veces.\\"",
  k2_t:"Estado emocional",k2_d:"Zaelyn detecta cómo estás hoy. Si la semana fue pesada, lo nota. Si algo te alegró, lo celebra. Su tono se adapta a tu momento — no al tuyo de ayer.",
  k3_t:"Metas como organismos",k3_d:"Tus metas tienen salud, momentum y un \\"Por Qué\\" como código genético. Zaelyn detecta si estás acercándote o alejándote — aunque no lo menciones.",
  k4_t:"Compromisos bilaterales",k4_d:"No confunde lo que tú debes hacer con lo que te prometieron a ti. Lleva el registro de ambos lados — y te recuerda cuando el tiempo se acaba.",
  k5_t:"5 personalidades",k5_d:"Elige cómo quieres que Zaelyn te hable: Serena, Viva, Lúcida, Cálida o Sabia. Su forma de responder cambia — su conocimiento de ti nunca.",
  priv_eyebrow:"Privacidad verificable",priv_h2:"Tú decides cuánto\\nsabe de ti.",priv_lead:"Cuatro niveles. Desde máxima inteligencia hasta anonimato verificable. Cambia de nivel en cualquier conversación.",
  p1_name:"Comfort",p1_tag:"Máxima inteligencia contextual",p1_badge:"Default",p1_p1:"Zaelyn <strong>recuerda todo</strong> — conversaciones, módulos, historial completo.",p1_p2:"La IA conoce tu nombre, ciudad, contexto y patrones de comportamiento.",p1_p3:"<strong>Mejor experiencia posible.</strong> Zaelyn te conoce a fondo desde el primer día.",p1_p4:"Los módulos se alimentan y sincronizan automáticamente en todos tus canales.",p1_footer:"Como ChatGPT Memory — pero con módulos estructurados y privacidad mejorable en cualquier momento.",
  p2_name:"Sovereign",p2_tag:"Módulos activos · conversación privada",p2_badge:"Recomendado",p2_p1:"Las conversaciones <strong>no se loggean.</strong> No quedan en ningún servidor.",p2_p2:"<strong>Los módulos sí persisten</strong> — diario, tareas y metas guardados cifrados.",p2_p3:"Zaelyn usa el contexto de tus módulos pero no almacena el chat en bruto.",p2_p4:"La IA conoce lo que guardaste explícitamente — no inferencias del chat.",p2_footer:"El equilibrio perfecto: toda la funcionalidad de los módulos, sin logs de conversación.",
  p3_name:"Phantom Mode ◈",p3_tag:"Tu identidad desaparece de la ecuación",p3_badge:"Nuevo",p3_p1:"<strong>Token anónimo de 4h</strong> — nunca ligado a tu user_id real.",p3_p2:"La IA no sabe quién pregunta. <strong>Verificable:</strong> exporta y confirma cero registros.",p3_p3:"Al cerrar el tab el token se destruye. La sesión desaparece completamente.",p3_p4:"3 sub-modos: <strong>Puro</strong> (nada), <strong>Selectivo</strong> (tú apruebas), <strong>Cifrado</strong> (E2E).",p3_footer:"Diseñado para temas sensibles o cualquier conversación que no debe existir después.",
  p4_name:"Full Sovereign",p4_tag:"Modelo local — ningún servidor ve nada",p4_badge:"Fase II",p4_p1:"La IA corre <strong>en tu dispositivo</strong> con Ollama. Ningún dato sale de tu hardware.",p4_p2:"Módulos guardados localmente. <strong>Cero servidores de terceros</strong> involucrados.",p4_p3:"Funciona sin internet para todas las funciones de IA.",p4_p4:"Requiere Ollama instalado. Calidad del modelo depende de tu hardware.",p4_footer:"La única privacidad 100% verificable. Si no hay tráfico de red, es real.",
  mod_eyebrow:"Constelación de módulos",mod_h2:"Cada aspecto de tu vida,\\nun módulo especializado.",mod_lead:"Todos conectados. Todos alimentando a Zaelyn. Todos bajo tus reglas de privacidad.",
  fam_mem:"Memoria",fam_action:"Acción",fam_social:"Social",fam_family:"Familia",phase2:"Fase II",
  mira_d:"Tu diario personal enriquecido por IA. Captura desde Telegram, voz, foto o texto. Mood automático, mapa de emociones, Wrapped anual.",mira_f1:"Captura multi-canal: voz, foto, texto",mira_f2:"Mood detectado automáticamente",mira_f3:"Mira Wrapped — tu año en estadísticas",
  sirius_d:"Tu grafo de conocimiento y People Graph. Ideas, conceptos, personas y sus conexiones. Búsqueda semántica vectorial.",sirius_f1:"People Graph: personas + contexto",sirius_f2:"Búsqueda semántica en tu conocimiento",sirius_f3:"Captura automática de entidades",
  orion_d:"Tareas, compromisos y hábitos con lógicas distintas. Distingue lo que debes hacer tú de lo que prometiste a alguien más.",orion_f1:"Compromisos: yo debo / me deben",orion_f2:"Hábitos con racha y tolerancia de fallo",orion_f3:"Avisos cuando algo vence",
  polaris_d:"Tus metas como organismos vivos. Con salud, momentum y el Por Qué como código genético. El Obituario al completarlas.",polaris_f1:"Metas con salud y momentum",polaris_f2:"Detección inversa de metas implícitas",polaris_f3:"Goals Wrapped anual",
  pulsar_d:"La red social que deriva de tu vida real. Comparte lo que ya capturaste. Sin algoritmo de engagement. Sin likes públicos.",pulsar_f1:"Contenido real — no creado desde cero",pulsar_f2:"Feed cronológico sin manipulación",
  pleyades_d:"La memoria colectiva de tu familia y grupos cercanos. Calendarios, expediente médico familiar, metas compartidas.",pleyades_f1:"Espacios: familia, pareja, equipo",pleyades_f2:"Sync con Google Cal, Apple, Alexa",
  lang_eyebrow:"Tres idiomas nativos",lang_h2:"Zaelyn te habla\\nen tu idioma.",lang_sub:"No es traducción automática. Zaelyn piensa, recuerda y responde en inglés, español y portugués. Cambia de idioma en medio de la conversación — Zaelyn te sigue.",
  lang_ex_en:"\\"I know you've been thinking about this for days. Let me reflect back what you've told me.\\"",lang_ex_es:"\\"Sé que llevas días dándole vueltas a esto. Déjame reflejar lo que me has contado.\\"",lang_ex_pt:"\\"Sei que você está pensando nisso há dias. Deixa eu refletir o que você me contou.\\"",
  cmp_eyebrow:"Posicionamiento",cmp_h2:"Zaelyn no compite.\\nResuelve algo distinto.",cmp_sub:"Hay IA que sabe todo de ti pero te vigila. Hay IA privada pero amnésica. Zaelyn es el tercero que faltaba.",
  c_dim:"Dimensión",c_s1:"Privacidad",c_s2:"Memoria",c_s3:"Acceso",c_r1:"Tus datos",c_r1a:"Guarda todo",c_r1b:"No guarda nada",c_r1c:"Tú decides",c_r2:"Verificable",c_r2b:"TEE + E2EE",c_r2c:"Phantom",c_new:"nuevo",c_r3:"Te conoce",c_r3a:"Historial básico",c_r3b:"No · amnésica",c_r3c:"4 módulos de vida real",c_unique:"único",c_r4:"Estado emocional",c_r4c:"Detecta y adapta",c_r5:"Canales",c_r6:"Idiomas",c_r6a:"Inglés",c_adv:"ventaja",
  cta_eyebrow:"Beta por invitación",cta_h2:"Empieza a construir\\ntu segunda mente.",cta_sub:"Zaelyn está en beta. Los primeros usuarios definen el producto. Entra por invitación y sé parte del origen.",cta_btn1:"Pedir invitación beta",cta_btn2:"Contactar NE America →",
  f_priv:"Privacidad",f_terms:"Términos",
  mem_sofia:"Sofía — tiene alergia al camarón",mem_carmen:"Carmen tiene examen el viernes",mem_carlos:"Carlos Mendoza · arquitecto · interesado",mem_goal:"8 kg antes de diciembre",mem_budget:"Presupuesto familiar: $18,400/mes",mem_med:"Medicamento abuelo: 8am y 8pm",
  chat_badge_calida:"● Cálida · activa",chat_badge_lucida:"● Lúcida · activa",chat_badge_sabia:"● Sabia · activa",chat_badge_viva:"● Viva · activa",chat_badge_serena:"● Serena · activa"
},
en:{
  nav_knows:"Knows you",nav_priv:"Privacy",nav_mods:"Modules",nav_beta:"Beta",nav_cta:"Start →",
  hero_kicker:"National Expertise · NE DevIA",hero_h1a:"The AI that knows you,",hero_h1b:"learns with you",hero_h1c:"and protects your privacy.",
  hero_sub:"Not a chatbot that forgets. Zaelyn is the first AI that builds a real memory of your life and protects it the way you decide.",
  hero_cta1:"Start talking",hero_cta2:"See how it works ↓",hero_proof:"Three languages · Four privacy levels · Your memory, your rules",
  demo_eyebrow:"The AI that knows you",demo_h2:"Zaelyn knows who you are,\\nwhat you live, what you need.",demo_lead:"Five different people. One Zaelyn that adapts to each one.",
  s0_persona:"Mom & family",s0_title:"Sofia, 38.\\nTwo kids, a thousand things\\non her mind.",s0_desc:"Zaelyn knows Mateo is allergic to shellfish, that Carmen has an exam on Friday, that the pediatrician called last week. And it remembers today was a very long day.",
  s1_persona:"Creative freelancer",s1_title:"Ana, designer.\\nClients, deadlines,\\nbusiness goals.",s1_desc:"Zaelyn knows Carlos Mendoza from the architecture firm wants to work with her, that Inés's proposal is due Friday and her goal is 3 new clients this month.",
  s2_persona:"Entrepreneur",s2_title:"Miguel, founder.\\nBig decisions,\\nfull mind.",s2_desc:"Zaelyn knows what he decided last week, why, and what he's leaving unresolved. It doesn't give lists — it gives clarity. Connects today with what came before.",
  s3_persona:"Full family",s3_title:"The Rodriguez family.\\nFour people,\\none Zaelyn.",s3_desc:"Zaelyn knows the kids' activities, when grandpa takes his medication, what the monthly budget is and what's on the family calendar for the weekend.",
  s4_persona:"Personal wellness",s4_title:"Luis, 41.\\nWants to change habits.\\nZaelyn walks with him.",s4_desc:"Zaelyn knows he's been sleeping poorly for two weeks, that his goal is to lose 15 pounds before December, and that Monday was the first day he completed his morning workout.",
  knows_eyebrow:"Why it knows you",knows_h2:"Not context.\\nReal memory.",knows_lead:"Zaelyn builds a living graph of your life — facts, preferences, decisions, people. And protects it the way you decide.",
  k0_t:"3-layer memory",k0_d:"Active conversation, recent history, and permanent facts. Zaelyn knows what you said 5 minutes ago and what you told it 3 months ago.",
  k1_t:"People Graph",k1_d:"Every person you mention stays in your contact graph with context: \\"Carlos Mendoza — architect — wants to work with you — mentioned 3 times.\\"",
  k2_t:"Emotional state",k2_d:"Zaelyn detects how you are today. If the week was heavy, it notices. If something made you happy, it celebrates. Its tone adapts to your moment — not yesterday's.",
  k3_t:"Goals as organisms",k3_d:"Your goals have health, momentum, and a Why as genetic code. Zaelyn detects if you're approaching or moving away — even if you don't mention it.",
  k4_t:"Bilateral commitments",k4_d:"Doesn't confuse what you need to do with what was promised to you. Tracks both sides — and reminds you when time runs out.",
  k5_t:"5 personalities",k5_d:"Choose how you want Zaelyn to talk to you: Serene, Vivid, Lucid, Warm, or Wise. The way it responds changes — its knowledge of you never does.",
  priv_eyebrow:"Verifiable privacy",priv_h2:"You decide how much\\nit knows about you.",priv_lead:"Four levels. From maximum intelligence to verifiable anonymity. Change levels in any conversation.",
  p1_name:"Comfort",p1_tag:"Maximum contextual intelligence",p1_badge:"Default",p1_p1:"Zaelyn <strong>remembers everything</strong> — conversations, modules, complete history.",p1_p2:"The AI knows your name, city, context, and behavioral patterns.",p1_p3:"<strong>Best possible experience.</strong> Zaelyn knows you deeply from day one.",p1_p4:"Modules feed and sync automatically across all your channels.",p1_footer:"Like ChatGPT Memory — but with structured modules and upgradeable privacy at any time.",
  p2_name:"Sovereign",p2_tag:"Active modules · private conversation",p2_badge:"Recommended",p2_p1:"Conversations <strong>are not logged.</strong> They don't stay on any server.",p2_p2:"<strong>Modules do persist</strong> — journal, tasks, and goals stored encrypted.",p2_p3:"Zaelyn uses your module context but doesn't store raw chat.",p2_p4:"The AI knows what you explicitly saved — not chat inferences.",p2_footer:"The perfect balance: all module functionality, without conversation logs.",
  p3_name:"Phantom Mode ◈",p3_tag:"Your identity disappears from the equation",p3_badge:"New",p3_p1:"<strong>4h anonymous token</strong> — never linked to your real user_id.",p3_p2:"The AI never knows who's asking. <strong>Verifiable:</strong> export and confirm zero records.",p3_p3:"When you close the tab the token is destroyed. The session disappears completely.",p3_p4:"3 sub-modes: <strong>Pure</strong> (nothing), <strong>Selective</strong> (you approve), <strong>Encrypted</strong> (E2E).",p3_footer:"Designed for sensitive topics or any conversation that shouldn't exist afterward.",
  p4_name:"Full Sovereign",p4_tag:"Local model — no server sees anything",p4_badge:"Phase II",p4_p1:"The AI runs <strong>on your device</strong> with Ollama. No data leaves your hardware.",p4_p2:"Modules stored locally. <strong>Zero third-party servers</strong> involved.",p4_p3:"Works without internet for all AI functions.",p4_p4:"Requires Ollama installed. Model quality depends on your hardware.",p4_footer:"The only 100% verifiable privacy. If there's no network traffic, it's real.",
  mod_eyebrow:"Module constellation",mod_h2:"Every aspect of your life,\\na specialized module.",mod_lead:"All connected. All feeding Zaelyn. All under your privacy rules.",
  fam_mem:"Memory",fam_action:"Action",fam_social:"Social",fam_family:"Family",phase2:"Phase II",
  mira_d:"Your personal AI-powered journal. Capture from Telegram, voice, photo, or text. Auto mood, emotion map, annual Wrapped.",mira_f1:"Multi-channel: voice, photo, text",mira_f2:"Mood detected automatically",mira_f3:"Mira Wrapped — your year in stats",
  sirius_d:"Your knowledge graph and People Graph. Ideas, concepts, people and their connections. Vector semantic search.",sirius_f1:"People Graph: people + context",sirius_f2:"Semantic search in your knowledge",sirius_f3:"Automatic entity capture",
  orion_d:"Tasks, commitments and habits with different logic. Distinguishes what you need to do from what you promised someone.",orion_f1:"Commitments: I owe / they owe me",orion_f2:"Habits with streaks and failure tolerance",orion_f3:"Alerts when something is due",
  polaris_d:"Your goals as living organisms. With health, momentum, and the Why as genetic code. The Obituary when you complete them.",polaris_f1:"Goals with health and momentum",polaris_f2:"Inverse detection of implicit goals",polaris_f3:"Annual Goals Wrapped",
  pulsar_d:"The social network that derives from your real life. Share what you already captured. No engagement algorithm.",pulsar_f1:"Real content — not created from scratch",pulsar_f2:"Chronological feed without manipulation",
  pleyades_d:"Your family's collective memory. Calendars, family medical records, shared goals.",pleyades_f1:"Spaces: family, couple, team",pleyades_f2:"Sync with Google Cal, Apple, Alexa",
  lang_eyebrow:"Three native languages",lang_h2:"Zaelyn speaks\\nin your language.",lang_sub:"Not automatic translation. Zaelyn thinks, remembers, and responds natively in English, Spanish, and Portuguese. Switch languages mid-conversation — Zaelyn follows you.",
  lang_ex_en:"\\"I know you've been thinking about this for days. Let me reflect back what you've told me.\\"",lang_ex_es:"\\"Sé que llevas días dándole vueltas a esto. Déjame reflejar lo que me has contado.\\"",lang_ex_pt:"\\"Sei que você está pensando nisso há dias. Deixa eu refletir o que você me contou.\\"",
  cmp_eyebrow:"Positioning",cmp_h2:"Zaelyn doesn't compete.\\nIt solves something different.",cmp_sub:"There's AI that knows everything about you but watches you. There's private AI that's amnesic. Zaelyn is the third option that was missing.",
  c_dim:"Dimension",c_s1:"Privacy",c_s2:"Memory",c_s3:"Access",c_r1:"Your data",c_r1a:"Saves everything",c_r1b:"Saves nothing",c_r1c:"You decide",c_r2:"Verifiable",c_r2b:"TEE + E2EE",c_r2c:"Phantom",c_new:"new",c_r3:"Knows you",c_r3a:"Basic history",c_r3b:"No · amnesic",c_r3c:"4 real-life modules",c_unique:"unique",c_r4:"Emotional state",c_r4c:"Detects and adapts",c_r5:"Channels",c_r6:"Languages",c_r6a:"English",c_adv:"advantage",
  cta_eyebrow:"Beta by invitation",cta_h2:"Start building\\nyour second mind.",cta_sub:"Zaelyn is in beta. The first users define the product. Join by invitation and be part of the origin.",cta_btn1:"Request beta invitation",cta_btn2:"Contact NE America →",
  f_priv:"Privacy",f_terms:"Terms",
  mem_sofia:"Sofia — allergic to shellfish",mem_carmen:"Carmen has exam on Friday",mem_carlos:"Carlos Mendoza · architect · interested",mem_goal:"Lose 15 lbs before December",mem_budget:"Family budget: $18,400/mo",mem_med:"Grandpa's meds: 8am and 8pm",
  chat_badge_calida:"● Warm · active",chat_badge_lucida:"● Lucid · active",chat_badge_sabia:"● Wise · active",chat_badge_viva:"● Vivid · active",chat_badge_serena:"● Serene · active"
},
pt:{
  nav_knows:"Te conhece",nav_priv:"Privacidade",nav_mods:"Módulos",nav_beta:"Beta",nav_cta:"Começar →",
  hero_kicker:"National Expertise · NE DevIA",hero_h1a:"A IA que te conhece,",hero_h1b:"aprende com você",hero_h1c:"e cuida da sua privacidade.",
  hero_sub:"Não é um chatbot que esquece. Zaelyn é a primeira IA que constrói uma memória real da sua vida e a protege como você decide.",
  hero_cta1:"Comece a falar",hero_cta2:"Ver como funciona ↓",hero_proof:"Três idiomas · Quatro níveis de privacidade · Sua memória, suas regras",
  demo_eyebrow:"A IA que te conhece",demo_h2:"Zaelyn sabe quem você é,\\no que vive, o que precisa.",demo_lead:"Cinco pessoas diferentes. Uma Zaelyn que se adapta a cada uma.",
  s0_persona:"Mãe de família",s0_title:"Sofia, 38 anos.\\nDois filhos, mil coisas\\nna cabeça.",s0_desc:"Zaelyn sabe que Mateo é alérgico a frutos do mar, que Carmen tem prova na sexta, que o pediatra ligou semana passada. E lembra que hoje foi um dia muito longo.",
  s1_persona:"Freelancer criativa",s1_title:"Ana, designer.\\nClientes, prazos,\\nmetas de negócio.",s1_desc:"Zaelyn sabe que Carlos Mendoza do escritório de arquitetura quer trabalhar com ela, que a proposta de Inês vence na sexta e que sua meta é 3 novos clientes este mês.",
  s2_persona:"Empreendedor",s2_title:"Miguel, fundador.\\nDecisões grandes,\\nmente cheia.",s2_desc:"Zaelyn sabe o que ele decidiu semana passada, por quê, e o que está deixando sem resolver. Não dá listas — dá clareza. Conecta o de hoje com o que veio antes.",
  s3_persona:"Família completa",s3_title:"A família Rodríguez.\\nQuatro pessoas,\\numa só Zaelyn.",s3_desc:"Zaelyn sabe as atividades dos filhos, quando o avô toma o remédio, qual é o orçamento do mês e o que tem no calendário familiar para o fim de semana.",
  s4_persona:"Bem-estar pessoal",s4_title:"Luis, 41 anos.\\nQuer mudar hábitos.\\nZaelyn o acompanha.",s4_desc:"Zaelyn sabe que há duas semanas ele dorme mal, que sua meta é emagrecer 8 kg antes de dezembro, e que segunda foi o primeiro dia que cumpriu o exercício de manhã.",
  knows_eyebrow:"Por que te conhece",knows_h2:"Não é contexto.\\nÉ memória real.",knows_lead:"Zaelyn constrói um grafo vivo da sua vida — fatos, preferências, decisões, pessoas. E protege como você decide.",
  k0_t:"Memória de 3 camadas",k0_d:"Conversa ativa, histórico recente e fatos permanentes. Zaelyn sabe o que você disse há 5 minutos e o que contou há 3 meses.",
  k1_t:"People Graph",k1_d:"Cada pessoa que você menciona fica no seu grafo de contatos com contexto: \\"Carlos Mendoza — arquiteto — quer trabalhar com você — mencionado 3 vezes.\\"",
  k2_t:"Estado emocional",k2_d:"Zaelyn detecta como você está hoje. Se a semana foi pesada, nota. Se algo te alegrou, celebra. Seu tom se adapta ao seu momento — não ao de ontem.",
  k3_t:"Metas como organismos",k3_d:"Suas metas têm saúde, momentum e um Por Quê como código genético. Zaelyn detecta se você está se aproximando ou se afastando — mesmo que não mencione.",
  k4_t:"Compromissos bilaterais",k4_d:"Não confunde o que você precisa fazer com o que prometeram para você. Rastreia ambos os lados — e te lembra quando o tempo acaba.",
  k5_t:"5 personalidades",k5_d:"Escolha como quer que Zaelyn te fale: Serena, Viva, Lúcida, Calorosa ou Sábia. A forma de responder muda — o conhecimento sobre você nunca.",
  priv_eyebrow:"Privacidade verificável",priv_h2:"Você decide o quanto\\nele sabe sobre você.",priv_lead:"Quatro níveis. Da inteligência máxima ao anonimato verificável. Mude de nível em qualquer conversa.",
  p1_name:"Comfort",p1_tag:"Máxima inteligência contextual",p1_badge:"Padrão",p1_p1:"Zaelyn <strong>lembra tudo</strong> — conversas, módulos, histórico completo.",p1_p2:"A IA conhece seu nome, cidade, contexto e padrões de comportamento.",p1_p3:"<strong>Melhor experiência possível.</strong> Zaelyn te conhece a fundo desde o primeiro dia.",p1_p4:"Os módulos se alimentam e sincronizam automaticamente em todos os canais.",p1_footer:"Como ChatGPT Memory — mas com módulos estruturados e privacidade melhorável a qualquer momento.",
  p2_name:"Sovereign",p2_tag:"Módulos ativos · conversa privada",p2_badge:"Recomendado",p2_p1:"As conversas <strong>não são registradas.</strong> Não ficam em nenhum servidor.",p2_p2:"<strong>Os módulos persistem</strong> — diário, tarefas e metas salvos criptografados.",p2_p3:"Zaelyn usa o contexto dos módulos mas não armazena o chat bruto.",p2_p4:"A IA conhece o que você salvou explicitamente — não inferências do chat.",p2_footer:"O equilíbrio perfeito: toda a funcionalidade dos módulos, sem logs de conversa.",
  p3_name:"Phantom Mode ◈",p3_tag:"Sua identidade desaparece da equação",p3_badge:"Novo",p3_p1:"<strong>Token anônimo de 4h</strong> — nunca ligado ao seu user_id real.",p3_p2:"A IA nunca sabe quem pergunta. <strong>Verificável:</strong> exporte e confirme zero registros.",p3_p3:"Ao fechar a aba o token é destruído. A sessão desaparece completamente.",p3_p4:"3 sub-modos: <strong>Puro</strong> (nada), <strong>Seletivo</strong> (você aprova), <strong>Cifrado</strong> (E2E).",p3_footer:"Projetado para temas sensíveis ou qualquer conversa que não deve existir depois.",
  p4_name:"Full Sovereign",p4_tag:"Modelo local — nenhum servidor vê nada",p4_badge:"Fase II",p4_p1:"A IA roda <strong>no seu dispositivo</strong> com Ollama. Nenhum dado sai do hardware.",p4_p2:"Módulos salvos localmente. <strong>Zero servidores de terceiros</strong> envolvidos.",p4_p3:"Funciona sem internet para todas as funções de IA.",p4_p4:"Requer Ollama instalado. Qualidade do modelo depende do hardware.",p4_footer:"A única privacidade 100% verificável. Se não há tráfego de rede, é real.",
  mod_eyebrow:"Constelação de módulos",mod_h2:"Cada aspecto da sua vida,\\num módulo especializado.",mod_lead:"Todos conectados. Todos alimentando Zaelyn. Todos sob suas regras de privacidade.",
  fam_mem:"Memória",fam_action:"Ação",fam_social:"Social",fam_family:"Família",phase2:"Fase II",
  mira_d:"Seu diário pessoal com IA. Capture do Telegram, voz, foto ou texto. Humor automático, mapa de emoções, Wrapped anual.",mira_f1:"Captura multi-canal: voz, foto, texto",mira_f2:"Humor detectado automaticamente",mira_f3:"Mira Wrapped — seu ano em estatísticas",
  sirius_d:"Seu grafo de conhecimento e People Graph. Ideias, conceitos, pessoas e conexões. Busca semântica vetorial.",sirius_f1:"People Graph: pessoas + contexto",sirius_f2:"Busca semântica no seu conhecimento",sirius_f3:"Captura automática de entidades",
  orion_d:"Tarefas, compromissos e hábitos com lógicas distintas. Distingue o que você precisa fazer do que prometeu para alguém.",orion_f1:"Compromissos: eu devo / me devem",orion_f2:"Hábitos com sequência e tolerância",orion_f3:"Avisos quando algo vence",
  polaris_d:"Suas metas como organismos vivos. Com saúde, momentum e o Por Quê como código genético.",polaris_f1:"Metas com saúde e momentum",polaris_f2:"Detecção inversa de metas implícitas",polaris_f3:"Goals Wrapped anual",
  pulsar_d:"A rede social que deriva da sua vida real. Compartilhe o que já capturou. Sem algoritmo de engajamento.",pulsar_f1:"Conteúdo real — não criado do zero",pulsar_f2:"Feed cronológico sem manipulação",
  pleyades_d:"A memória coletiva da sua família e grupos próximos. Calendários, prontuário familiar, metas compartilhadas.",pleyades_f1:"Espaços: família, casal, equipe",pleyades_f2:"Sync com Google Cal, Apple, Alexa",
  lang_eyebrow:"Três idiomas nativos",lang_h2:"Zaelyn fala\\nno seu idioma.",lang_sub:"Não é tradução automática. Zaelyn pensa, lembra e responde em inglês, espanhol e português. Troque de idioma no meio da conversa — Zaelyn te acompanha.",
  lang_ex_en:"\\"I know you've been thinking about this for days. Let me reflect back what you've told me.\\"",lang_ex_es:"\\"Sé que llevas días dándole vueltas a esto. Déjame reflejar lo que me has contado.\\"",lang_ex_pt:"\\"Sei que você está pensando nisso há dias. Deixa eu refletir o que você me contou.\\"",
  cmp_eyebrow:"Posicionamento",cmp_h2:"Zaelyn não compete.\\nResolve algo diferente.",cmp_sub:"Há IA que sabe tudo sobre você mas te vigia. Há IA privada mas amnésica. Zaelyn é a terceira opção que faltava.",
  c_dim:"Dimensão",c_s1:"Privacidade",c_s2:"Memória",c_s3:"Acesso",c_r1:"Seus dados",c_r1a:"Salva tudo",c_r1b:"Não salva nada",c_r1c:"Você decide",c_r2:"Verificável",c_r2b:"TEE + E2EE",c_r2c:"Phantom",c_new:"novo",c_r3:"Te conhece",c_r3a:"Histórico básico",c_r3b:"Não · amnésica",c_r3c:"4 módulos de vida real",c_unique:"único",c_r4:"Estado emocional",c_r4c:"Detecta e adapta",c_r5:"Canais",c_r6:"Idiomas",c_r6a:"Inglês",c_adv:"vantagem",
  cta_eyebrow:"Beta por convite",cta_h2:"Comece a construir\\nsua segunda mente.",cta_sub:"Zaelyn está em beta. Os primeiros usuários definem o produto. Entre por convite e seja parte da origem.",cta_btn1:"Pedir convite beta",cta_btn2:"Contatar NE America →",
  f_priv:"Privacidade",f_terms:"Termos",
  mem_sofia:"Sofia — alérgica a frutos do mar",mem_carmen:"Carmen tem prova na sexta",mem_carlos:"Carlos Mendoza · arquiteto · interessado",mem_goal:"Emagrecer 8 kg antes de dezembro",mem_budget:"Orçamento familiar: R$ 9.200/mês",mem_med:"Remédio avô: 8h e 20h",
  chat_badge_calida:"● Calorosa · ativa",chat_badge_lucida:"● Lúcida · ativa",chat_badge_sabia:"● Sábia · ativa",chat_badge_viva:"● Viva · ativa",chat_badge_serena:"● Serena · ativa"
}
};

// ─── CONVERSATIONS ─────────────────────────────────
const CONVS = [
  { // Mamá
    persona: "calida",
    color: "#ec4899",
    badge_key: "chat_badge_calida",
    msgs: [
      { u: true, text_key: "c0_q1" },
      { u: false, text_key: "c0_a1", chips: [{cls:"chip-orion",label_key:"c0_chip1"}] },
      { u: true, text_key: "c0_q2" },
      { u: false, text_key: "c0_a2", chips: [{cls:"chip-orion",label_key:"c0_chip2"},{cls:"chip-mira",label_key:"c0_chip3"}] },
    ]
  },
  { // Freelancer
    persona: "lucida",
    color: "#3b82f6",
    badge_key: "chat_badge_lucida",
    msgs: [
      { u: true, text_key: "c1_q1" },
      { u: false, text_key: "c1_a1", chips: [{cls:"chip-mira",label_key:"c1_chip1"}] },
      { u: true, text_key: "c1_q2" },
      { u: false, text_key: "c1_a2", chips: [{cls:"chip-orion",label_key:"c1_chip2"},{cls:"chip-sirius",label_key:"c1_chip3"},{cls:"chip-polaris",label_key:"c1_chip4"}] },
    ]
  },
  { // Emprendedor
    persona: "sabia",
    color: "#8b5cf6",
    badge_key: "chat_badge_sabia",
    msgs: [
      { u: true, text_key: "c2_q1" },
      { u: false, text_key: "c2_a1", chips: [{cls:"chip-mira",label_key:"c2_chip1"}] },
      { u: true, text_key: "c2_q2" },
      { u: false, text_key: "c2_a2", chips: [{cls:"chip-sirius",label_key:"c2_chip2"}] },
    ]
  },
  { // Familia
    persona: "calida",
    color: "#ec4899",
    badge_key: "chat_badge_calida",
    msgs: [
      { u: true, text_key: "c3_q1" },
      { u: false, text_key: "c3_a1", chips: [{cls:"chip-pleyades",label_key:"c3_chip1"},{cls:"chip-orion",label_key:"c3_chip2"}] },
      { u: true, text_key: "c3_q2" },
      { u: false, text_key: "c3_a2", chips: [{cls:"chip-pleyades",label_key:"c3_chip3"}] },
    ]
  },
  { // Bienestar
    persona: "viva",
    color: "#f59e0b",
    badge_key: "chat_badge_viva",
    msgs: [
      { u: true, text_key: "c4_q1" },
      { u: false, text_key: "c4_a1" },
      { u: true, text_key: "c4_q2" },
      { u: false, text_key: "c4_a2", chips: [{cls:"chip-orion",label_key:"c4_chip1"},{cls:"chip-polaris",label_key:"c4_chip2"}] },
    ]
  }
];

// Add conversation text keys
const convTexts = {
  es:{
    c0_q1:"recuérdame comprar el medicamento de Sofía mañana antes de las 10am, se le acaba hoy",c0_a1:"Anotado. Mañana a las 9:15 te aviso — así tienes tiempo de sobra. ¿Es el mismo de siempre, el que toma para el asma?",c0_chip1:"Tus tareas · mañana 9:15 AM",c0_q2:"sí ese. hoy fue un día agotador, llevo una semana cargando todo sola",c0_a2:"Lo imagino. Y que lo notes también importa. Lo guardo en tu diario — que conste que hoy fue difícil y que de todas formas lo sacaste adelante.",c0_chip2:"Tus tareas · recordatorio activo",c0_chip3:"Tu diario · guardado",
    c1_q1:"terminé el diseño del proyecto de Ana García, tardé más pero quedó muy bien",c1_a1:"Lo guardo. Que tardara más no lo hace menos valioso — al contrario. ¿Ya le enviaste la propuesta o falta eso?",c1_chip1:"Tu diario · guardado",c1_q2:"falta enviarla antes del viernes. y tengo pendiente llamar a Carlos Mendoza del estudio de arquitectura, quiere trabajar conmigo",c1_a2:"Dos cosas: propuesta a Ana antes del viernes, y llamada a Carlos Mendoza del estudio de arquitectura. Lo guardé como contacto con ese contexto. ¿Cuándo quieres que te recuerde?",c1_chip2:"Tus tareas · viernes",c1_chip3:"Tu memoria · Carlos Mendoza",c1_chip4:"Tus metas · 3 clientes",
    c2_q1:"necesito pensar en algo importante pero no sé cómo empezar. llevo semanas aplazándolo",c2_a1:"Lo veo. Lo de la semana pasada también quedó sin resolver. ¿Quieres que conectemos los puntos desde lo que ya me has contado?",c2_chip1:"Tu diario · patrón detectado",c2_q2:"sí. creo que tengo miedo de decidir mal",c2_a2:"Eso ya es mucho. Miedo de decidir mal es diferente a no saber qué decidir. Lo segundo lo podemos trabajar. ¿Cuál es la decisión que más pesa?",c2_chip2:"Tu memoria · decisión pendiente",
    c3_q1:"oye, ¿cuándo es el próximo medicamento del abuelo?",c3_a1:"Hoy a las 8pm. Y mañana la actividad de fútbol de Diego es a las 10am. Lo tengo todo en el calendario familiar.",c3_chip1:"Familia · medicamento activo",c3_chip2:"Tus tareas · Diego fútbol 10am",c3_q2:"perfecto. agrega al calendario que el sábado hay reunión de familia en casa de los tíos",c3_a2:"Listo, sábado reunión familiar en casa de los tíos. ¿Lo notifico a todos los miembros del espacio familiar?",c3_chip3:"Familia · calendario actualizado",
    c4_q1:"hoy por fin hice ejercicio en la mañana a las 6:30. llevaba dos semanas fallando",c4_a1:"¡Eso es. El primer día que cumples después de dos semanas vale por diez. ¿Cómo te sentiste al terminar?",c4_q2:"bien, cansado pero bien. quiero convertirlo en hábito, mi meta es bajar 8 kilos antes de diciembre",c4_a2:"6:30 todos los días — lo tengo. Y 8 kilos antes de diciembre es una meta muy real con el tiempo que tienes. La guardé. Vamos a convertir hoy en el día 1 oficial.",c4_chip1:"Tus tareas · mañana 6:30 AM",c4_chip2:"Tus metas · 8kg · diciembre"
  },
  en:{
    c0_q1:"remind me to buy Sofia's medicine tomorrow before 10am, she runs out today",c0_a1:"Done. I'll remind you tomorrow at 9:15 — that gives you plenty of time. Is it the same one as always, the one for her asthma?",c0_chip1:"Your tasks · tomorrow 9:15 AM",c0_q2:"yes that one. today was exhausting, I've been carrying everything alone for a week",c0_a2:"I can imagine. And noticing it matters too. Saving it in your journal — that today was hard and you got through it anyway.",c0_chip2:"Your tasks · active reminder",c0_chip3:"Your journal · saved",
    c1_q1:"I finished the design project for Ana García, it took longer but turned out really well",c1_a1:"Saving it. The fact it took longer doesn't make it less valuable — if anything the opposite. Did you send the proposal or is that still pending?",c1_chip1:"Your journal · saved",c1_q2:"still need to send it before Friday. and I have a pending call to Carlos Mendoza from the architecture firm, he wants to work with me",c1_a2:"Two things: proposal to Ana before Friday, and call to Carlos Mendoza from the architecture firm. Saved him as a contact with that context. When do you want me to remind you?",c1_chip2:"Your tasks · Friday",c1_chip3:"Your memory · Carlos Mendoza",c1_chip4:"Your goals · 3 clients",
    c2_q1:"I need to think about something important but I don't know how to start. I've been putting it off for weeks",c2_a1:"I see it. What happened last week is also still unresolved. Want me to connect the dots from what you've already told me?",c2_chip1:"Your journal · pattern detected",c2_q2:"yes. I think I'm afraid of making the wrong decision",c2_a2:"That's already a lot. Fear of deciding wrong is different from not knowing what to decide. The second one we can work with. What's the decision that weighs most?",c2_chip2:"Your memory · pending decision",
    c3_q1:"hey, when is grandpa's next medication?",c3_a1:"Today at 8pm. And tomorrow Diego's soccer activity is at 10am. I have everything in the family calendar.",c3_chip1:"Family · active medication",c3_chip2:"Your tasks · Diego soccer 10am",c3_q2:"perfect. add to the calendar that Saturday there's a family gathering at the aunt's house",c3_a2:"Done, Saturday family gathering at the aunt's house. Should I notify all members of the family space?",c3_chip3:"Family · calendar updated",
    c4_q1:"today I finally worked out in the morning at 6:30. I'd been failing for two weeks",c4_a1:"That's it. The first day you follow through after two weeks counts for ten. How did you feel when you finished?",c4_q2:"good, tired but good. I want to make it a habit, my goal is to lose 15 pounds before December",c4_a2:"6:30 every day — I've got it. And 15 pounds before December is a very real goal with the time you have. Saved it. Let's make today day 1 official.",c4_chip1:"Your tasks · tomorrow 6:30 AM",c4_chip2:"Your goals · 15lbs · December"
  },
  pt:{
    c0_q1:"me lembra de comprar o remédio da Sofia amanhã antes das 10h, acaba hoje",c0_a1:"Anotado. Amanhã às 9h15 te aviso — tempo de sobra. É o mesmo de sempre, o que ela toma para a asma?",c0_chip1:"Suas tarefas · amanhã 9:15",c0_q2:"sim esse. hoje foi exaustivo, faz uma semana que carrego tudo sozinha",c0_a2:"Imagino. E notar isso também importa. Guardo no seu diário — que hoje foi difícil e que mesmo assim você deu conta.",c0_chip2:"Suas tarefas · lembrete ativo",c0_chip3:"Seu diário · salvo",
    c1_q1:"terminei o design do projeto da Ana García, demorou mais mas ficou muito bom",c1_a1:"Salvei. Ter demorado mais não o torna menos valioso — pelo contrário. Você já enviou a proposta ou ainda falta?",c1_chip1:"Seu diário · salvo",c1_q2:"falta enviar antes de sexta. e tenho pendente ligar para Carlos Mendoza do escritório de arquitetura, ele quer trabalhar comigo",c1_a2:"Duas coisas: proposta para Ana antes de sexta, e ligação para Carlos Mendoza. Salvei como contato com esse contexto. Quando quer que eu te lembre?",c1_chip2:"Suas tarefas · sexta",c1_chip3:"Sua memória · Carlos Mendoza",c1_chip4:"Suas metas · 3 clientes",
    c2_q1:"preciso pensar em algo importante mas não sei como começar. faz semanas que estou adiando",c2_a1:"Vejo. O da semana passada também ficou sem resolver. Quer que eu conecte os pontos do que você já me contou?",c2_chip1:"Seu diário · padrão detectado",c2_q2:"sim. acho que tenho medo de decidir errado",c2_a2:"Isso já é muito. Medo de decidir errado é diferente de não saber o que decidir. O segundo a gente pode trabalhar. Qual é a decisão que mais pesa?",c2_chip2:"Sua memória · decisão pendente",
    c3_q1:"ei, quando é o próximo remédio do avô?",c3_a1:"Hoje às 20h. E amanhã a atividade de futebol do Diego é às 10h. Tenho tudo no calendário familiar.",c3_chip1:"Família · remédio ativo",c3_chip2:"Suas tarefas · Diego futebol 10h",c3_q2:"perfeito. adiciona no calendário que sábado tem reunião de família na casa dos tios",c3_a2:"Feito, sábado reunião familiar na casa dos tios. Notifico todos os membros do espaço familiar?",c3_chip3:"Família · calendário atualizado",
    c4_q1:"hoje finalmente fiz exercício de manhã às 6h30. fazia duas semanas que estava falhando",c4_a1:"É isso. O primeiro dia que você cumpre depois de duas semanas vale por dez. Como se sentiu ao terminar?",c4_q2:"bem, cansado mas bem. quero transformar em hábito, minha meta é emagrecer 8 kg antes de dezembro",c4_a2:"6h30 todo dia — tenho anotado. E 8 kg antes de dezembro é uma meta muito real com o tempo que você tem. Salvei. Vamos fazer de hoje o dia 1 oficial.",c4_chip1:"Suas tarefas · amanhã 6h30",c4_chip2:"Suas metas · 8kg · dezembro"
  }
};

// ─── STATE ────────────────────────────────────────
let lang = 'es';
let currentConv = -1;
let theme = localStorage.getItem('zaelyn-theme') || 'dark';

// ─── THEME ────────────────────────────────────────
function applyTheme(t) {
  theme = t;
  document.documentElement.setAttribute('data-theme', t);
  document.getElementById('themeBtn').textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('zaelyn-theme', t);
}
document.getElementById('themeBtn').addEventListener('click', () => {
  applyTheme(theme === 'dark' ? 'light' : 'dark');
});
applyTheme(theme);

// ─── LANGUAGE ─────────────────────────────────────
function setLang(l) {
  lang = l;
  document.getElementById('langSelect').value = l;
  document.documentElement.lang = l;
  const titles = {es:'Zaelyn — La IA que te conoce', en:'Zaelyn — The AI that knows you', pt:'Zaelyn — A IA que te conhece'};
  document.title = titles[l];
  applyTranslations();
  renderHeroMemories();
  if (currentConv >= 0) renderConv(currentConv);
}

function applyTranslations() {
  const t = { ...T[lang], ...convTexts[lang] };
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t[k] !== undefined) el.innerHTML = t[k];
  });
}

document.getElementById('langSelect').addEventListener('change', e => setLang(e.target.value));

// Auto-detect
const bl = navigator.language.split('-')[0];
const initLang = ['en','pt'].includes(bl) ? bl : 'es';
lang = initLang;
document.getElementById('langSelect').value = lang;

// ─── HERO MEMORIES ────────────────────────────────
function renderHeroMemories() {
  const t = { ...T[lang], ...convTexts[lang] };
  const memories = [
    { dot: '#ec4899', text: t.mem_sofia, age: '2h', delay: 0 },
    { dot: '#3b82f6', text: t.mem_carmen, age: '1d', delay: 80 },
    { dot: '#8b5cf6', text: t.mem_carlos, age: '3d', delay: 160 },
    { dot: '#10b981', text: t.mem_goal, age: '1w', delay: 240 },
    { dot: '#f59e0b', text: t.mem_budget, age: '1mo', delay: 320 },
    { dot: '#ef4444', text: t.mem_med, age: 'daily', delay: 400 },
  ];
  const container = document.getElementById('heroMemories');
  container.innerHTML = '';
  memories.forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'memory-card';
    el.style.transitionDelay = m.delay + 'ms';
    el.innerHTML = \`<span class="mc-dot" style="background:\${m.dot}"></span><span class="mc-text">\${m.text}</span><span class="mc-age">\${m.age}</span>\`;
    container.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
  });
}

// ─── CHAT RENDERER ────────────────────────────────
function renderConv(idx) {
  currentConv = idx;
  const conv = CONVS[idx];
  const t = { ...T[lang], ...convTexts[lang] };
  const body = document.getElementById('chatBody');
  const badge = document.getElementById('chatPersonaLabel');
  const chatWindow = document.getElementById('chatWindow');

  badge.textContent = t[conv.badge_key] || '● Zaelyn · activa';
  chatWindow.style.borderColor = conv.color + '30';

  // Clear + animate in
  body.innerHTML = '';
  conv.msgs.forEach((msg, mi) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'msg ' + (msg.u ? 'msg-user' : 'msg-zaelyn');
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerHTML = t[msg.text_key] || msg.text_key;
      div.appendChild(bubble);
      if (msg.chips && msg.chips.length) {
        const chips = document.createElement('div');
        chips.className = 'msg-chips';
        msg.chips.forEach(c => {
          const chip = document.createElement('span');
          chip.className = 'chip ' + c.cls;
          chip.innerHTML = '<span class="chip-dot"></span>' + (t[c.label_key] || c.label_key);
          chips.appendChild(chip);
        });
        div.appendChild(chips);
      }
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }, mi * 180);
  });
}

// ─── SCROLL DEMO ──────────────────────────────────
function setupScrollDemo() {
  const items = document.querySelectorAll('.scroll-trigger-item');
  if (window.innerWidth <= 900) {
    items.forEach((item, i) => { item.classList.add('active'); renderConv(0); });
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        items.forEach(el => el.classList.remove('active'));
        entry.target.classList.add('active');
        const idx = parseInt(entry.target.getAttribute('data-conv'));
        if (idx !== currentConv) renderConv(idx);
      }
    });
  }, { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' });
  items.forEach(item => obs.observe(item));
  renderConv(0);
}

// ─── REVEAL ON SCROLL ─────────────────────────────
function setupReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── 3D CARD TILT ─────────────────────────────────
function setupTilt() {
  document.querySelectorAll('.know-card, .priv-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotX = (y - 0.5) * -8;
      const rotY = (x - 0.5) * 8;
      card.style.transform = \`perspective(1000px) rotateX(\${rotX}deg) rotateY(\${rotY}deg) translateZ(4px)\`;
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── CANVAS CONSTELLATION ─────────────────────────
function setupConstellation() {
  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');
  let W, H, nodes, mouse = { x: -9999, y: -9999 }, raf;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initNodes();
  }

  function initNodes() {
    const count = Math.min(Math.floor(W * H / 28000), 55);
    nodes = [];
    const colors = ['#8b5cf6','#7c3aed','#6366f1','#818cf8','#a78bfa','#3b82f6','#10b981'];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Update
    nodes.forEach(n => {
      n.phase += 0.008;
      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 200) {
        n.vx += dx / dist * 0.015;
        n.vy += dy / dist * 0.015;
      }
      n.vx *= 0.985;
      n.vy *= 0.985;
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0) n.x = W;
      if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H;
      if (n.y > H) n.y = 0;
    });

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        const maxD = 140;
        if (d < maxD) {
          const alpha = (1 - d/maxD) * (isDark ? 0.15 : 0.08);
          ctx.strokeStyle = \`rgba(124,58,237,\${alpha})\`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const pulse = 0.5 + 0.5 * Math.sin(n.phase);
      const r = n.r * (0.9 + 0.1 * pulse);
      const a = isDark ? (0.4 + 0.3 * pulse) : (0.25 + 0.2 * pulse);
      // Glow
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
      grad.addColorStop(0, n.color + Math.round(a * 255).toString(16).padStart(2,'0'));
      grad.addColorStop(1, n.color + '00');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
      ctx.fill();
      // Core
      ctx.fillStyle = n.color + Math.round((a + 0.3) * 255).toString(16).padStart(2,'0').slice(0,2);
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ─── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  renderHeroMemories();
  setupConstellation();
  setupScrollDemo();
  setupReveal();
  setupTilt();
});
</script>
</body>
</html>`;

export async function GET() {
  return new Response(HTML, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

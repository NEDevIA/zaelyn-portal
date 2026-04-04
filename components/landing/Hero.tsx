"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LandingLang } from "@/lib/landing-i18n";
import { useLandingT } from "@/lib/landing-i18n";

interface HeroProps { lang: LandingLang; }

const CHAT_MSGS = [
  { role: "z", text: (t: (k:string)=>string) => t("chat.briefing") },
  { role: "u", text: (t: (k:string)=>string) => t("chat.user1") },
  { role: "z", text: (t: (k:string)=>string) => t("chat.z1") },
  { role: "u", text: (t: (k:string)=>string) => t("chat.user2") },
  { role: "z", text: (t: (k:string)=>string) => t("chat.z2") },
];

export default function Hero({ lang }: HeroProps) {
  const t = useLandingT(lang);
  const [visibleMsgs, setVisibleMsgs] = useState(0);

  useEffect(() => {
    setVisibleMsgs(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleMsgs(i);
      if (i >= CHAT_MSGS.length) clearInterval(interval);
    }, 800);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <section style={{
      position: "relative", zIndex: 1,
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "120px 24px 80px", textAlign: "center", overflow: "hidden",
      background: "var(--l-bg)",
    }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", left: "-200px", top: "-100px", borderRadius: "50%", background: "radial-gradient(circle, rgba(155,127,232,.22), transparent 70%)", filter: "blur(130px)", animation: "orbFloat 22s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", right: "-150px", top: "20%", borderRadius: "50%", background: "radial-gradient(circle, rgba(94,196,232,.18), transparent 70%)", filter: "blur(130px)", animation: "orbFloat 22s ease-in-out infinite", animationDelay: "-8s" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", left: "30%", bottom: "5%", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,121,249,.13), transparent 70%)", filter: "blur(130px)", animation: "orbFloat 22s ease-in-out infinite", animationDelay: "-15s" }} />
      </div>

      {/* Tag */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "6px 14px", borderRadius: "999px",
        border: "1px solid rgba(155,127,232,.3)", background: "rgba(155,127,232,.08)",
        fontSize: "11px", fontWeight: 500, color: "var(--z-violet)",
        fontFamily: "var(--font-jetbrains)", letterSpacing: ".1em", textTransform: "uppercase",
        marginBottom: "28px", animation: "fadeUp .8s ease both",
      }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--z-violet)", display: "inline-block" }} />
        {t("hero.tag")}
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: "var(--font-syne)", fontSize: "clamp(48px, 8vw, 88px)",
        fontWeight: 800, lineHeight: 1.05, marginBottom: "24px",
        color: "var(--l-text)",
        animation: "fadeUp .8s ease .1s both",
      }}>
        {t("hero.title1")} <br />
        <span style={{ background: "linear-gradient(135deg, var(--z-violet), var(--z-cyan))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {t("hero.title2")}
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{
        maxWidth: "600px", fontSize: "18px", lineHeight: 1.7,
        color: "var(--l-text2)", marginBottom: "36px",
        fontFamily: "var(--font-dm-sans)",
        animation: "fadeUp .8s ease .2s both",
      }}>
        {t("hero.sub")}
      </p>

      {/* Privacy note */}
      <p style={{
        fontSize: "12px", color: "var(--l-text3)", marginBottom: "40px",
        fontFamily: "var(--font-jetbrains)",
        animation: "fadeUp .8s ease .25s both",
      }}>
        🔒 {t("hero.privacy")}
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "80px", animation: "fadeUp .8s ease .3s both" }}>
        <Link href="/join" style={{
          padding: "14px 28px", borderRadius: "12px",
          background: "linear-gradient(135deg, var(--z-violet), var(--z-cyan))",
          color: "#fff", fontSize: "15px", fontWeight: 600,
          textDecoration: "none", fontFamily: "var(--font-syne)",
          boxShadow: "0 0 32px rgba(155,127,232,.4)",
        }}>
          {t("hero.cta1")}
        </Link>
        <a href="#como-funciona" style={{
          padding: "14px 28px", borderRadius: "12px",
          border: "1px solid var(--l-border2)",
          background: "var(--l-surface)",
          color: "var(--l-text)", fontSize: "15px",
          textDecoration: "none", fontFamily: "var(--font-dm-sans)",
        }}>
          {t("hero.cta2")}
        </a>
      </div>

      {/* Chat mockup */}
      <div style={{
        width: "100%", maxWidth: "500px",
        background: "var(--l-bg2)", border: "1px solid var(--l-border)",
        borderRadius: "16px", overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        animation: "fadeUp .8s ease .4s both",
      }}>
        <div style={{
          padding: "12px 16px", borderBottom: "1px solid var(--l-border)",
          display: "flex", alignItems: "center", gap: "8px",
          fontSize: "12px", fontFamily: "var(--font-jetbrains)", color: "var(--l-text3)",
        }}>
          <span style={{ color: "var(--z-violet)" }}>●</span> zaelyn · aura
        </div>
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", minHeight: "200px" }}>
          {CHAT_MSGS.slice(0, visibleMsgs).map((msg, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column",
              alignItems: msg.role === "u" ? "flex-end" : "flex-start",
              animation: "msgIn .3s ease both",
            }}>
              {msg.role === "z" && (
                <span style={{ fontSize: "10px", color: "var(--z-violet)", fontFamily: "var(--font-jetbrains)", marginBottom: "4px" }}>zaelyn · aura</span>
              )}
              <div style={{
                maxWidth: "85%", padding: "10px 14px",
                fontSize: "13px", lineHeight: 1.6, fontFamily: "var(--font-dm-sans)",
                background: msg.role === "u" ? "rgba(99,102,241,0.12)" : "var(--l-surface2)",
                border: msg.role === "u" ? "1px solid rgba(99,102,241,0.2)" : "1px solid var(--l-border)",
                color: "var(--l-text)",
                borderRadius: msg.role === "u" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              }}>
                {msg.text(t)}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          padding: "12px 16px", borderTop: "1px solid var(--l-border)",
          display: "flex", gap: "8px",
        }}>
          <input readOnly placeholder="Escribe, pregunta, o piensa en voz alta..." style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: "13px", color: "var(--l-text3)", fontFamily: "var(--font-dm-sans)",
          }} />
          <div style={{
            width: "28px", height: "28px", borderRadius: "8px",
            background: "linear-gradient(135deg, var(--z-violet), var(--z-cyan))",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
          }}>→</div>
        </div>
      </div>
    </section>
  );
}

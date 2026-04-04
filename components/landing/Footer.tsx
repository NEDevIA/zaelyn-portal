"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { LandingLang } from "@/lib/landing-i18n";
import { useLandingT } from "@/lib/landing-i18n";

export default function Footer({ lang }: { lang: LandingLang }) {
  const t = useLandingT(lang);
  const [theme, setTheme] = useState<"dark"|"light">("dark");
  useEffect(() => {
    setTheme((document.documentElement.getAttribute("data-theme") as "dark"|"light") ?? "dark");
    const obs = new MutationObserver(() => setTheme((document.documentElement.getAttribute("data-theme") as "dark"|"light") ?? "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const links = [
    { groupKey: "footer.product", items: [
      { labelKey: "nav.how", href: "#como-funciona" },
      { labelKey: "nav.modules", href: "#modulos" },
      { labelKey: "nav.privacy", href: "#privacidad" },
      { labelKey: "nav.pricing", href: "#planes" },
    ]},
    { groupKey: "footer.company", items: [
      { labelKey: "footer.about", href: "#" },
      { labelKey: "footer.contact", href: "#" },
      { labelKey: "footer.press", href: "#" },
    ]},
    { groupKey: "footer.legal", items: [
      { labelKey: "footer.privacy", href: "#" },
      { labelKey: "footer.terms", href: "#" },
      { labelKey: "footer.cookies", href: "#" },
      { labelKey: "footer.data", href: "#" },
    ]},
  ];

  return (
    <footer style={{ background: "var(--l-bg3)", borderTop: "1px solid var(--l-border)", padding: "60px 24px 40px", fontFamily: "var(--font-dm-sans)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <Image src={theme === "dark" ? "/logo-dark.jpeg" : "/logo-light.jpeg"} alt="Zaelyn" height={28} width={100} style={{ height: "28px", width: "auto", objectFit: "contain", filter: theme === "light" ? "brightness(0.85)" : "none" }} />
            </div>
            <p style={{ fontSize: "13px", color: "var(--l-text2)", lineHeight: 1.7, maxWidth: "260px" }}>{t("footer.tagline")}</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
              {(["es","en","pt"] as LandingLang[]).map((l) => (
                <span key={l} style={{
                  fontSize: "11px", padding: "3px 8px", borderRadius: "6px",
                  background: lang === l ? "rgba(155,127,232,.12)" : "var(--l-surface)",
                  border: `1px solid ${lang === l ? "rgba(155,127,232,.3)" : "var(--l-border)"}`,
                  color: lang === l ? "var(--z-violet)" : "var(--l-text3)",
                  fontFamily: "var(--font-jetbrains)",
                }}>{l.toUpperCase()}</span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {links.map((group) => (
            <div key={group.groupKey}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--l-text3)", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "var(--font-jetbrains)", marginBottom: "16px" }}>{t(group.groupKey)}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {group.items.map((item) => (
                  <Link key={item.labelKey} href={item.href} style={{ fontSize: "13px", color: "var(--l-text2)", textDecoration: "none", transition: "color .15s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--l-text)"}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--l-text2)"}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--l-border)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "var(--l-text3)", fontFamily: "var(--font-jetbrains)" }}>© 2026 NE DevIA · Zaelyn</p>
          <p style={{ fontSize: "12px", color: "var(--l-text3)", fontFamily: "var(--font-jetbrains)" }}>Hecho con ♥ para LATAM</p>
        </div>
      </div>
    </footer>
  );
}

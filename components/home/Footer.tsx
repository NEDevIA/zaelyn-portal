"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="py-8 px-6"
      style={{ background: "#080a0d", borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px]" style={{ color: "rgba(226,228,233,0.3)", fontFamily: "var(--font-dm-sans)" }}>
            <span style={{ color: "#8b5cf6" }}>Zae</span>lyn
          </span>
          <span className="text-[11px]" style={{ color: "rgba(226,228,233,0.15)" }}>
            — NE DevIA 2026 · Chihuahua, Mexico
          </span>
        </div>
        <div className="flex items-center gap-5">
          {[
            { label: "Privacidad", href: "#privacidad" },
            { label: "Terminos", href: "/terminos" },
            { label: "zaera.ai", href: "https://zaera.ai" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[11px] transition-colors duration-200"
              style={{ color: "rgba(226,228,233,0.2)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(226,228,233,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(226,228,233,0.2)"; }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="py-8 px-6"
      style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-medium" style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}>
            Z<span style={{ color: "#8b5cf6" }}>ae</span>lyn
          </span>
          <span className="text-[11px]" style={{ color: "var(--muted-foreground)", opacity: 0.4 }}>
            — NE DevIA 2026 · Chihuahua, México
          </span>
        </div>
        <div className="flex items-center gap-5">
          {[
            { label: "Privacidad", href: "#privacidad" },
            { label: "Términos", href: "/terminos" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[12px] transition-colors duration-200"
              style={{ color: "var(--muted-foreground)", opacity: 0.5 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.5"; }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, CaretDown, Ghost, ShieldCheck } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePhantomStore } from "@/store/usePhantomStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { logout } from "@/lib/api";
import type { Lang } from "@/lib/i18n";

function getTheme() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("zaelyn-theme") === "light" ? "light" : "dark";
}

export default function Topbar() {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();
  const { isPhantom, deactivate } = usePhantomStore();
  const { lang, setLang } = useLanguageStore();
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    typeof window !== "undefined" ? (getTheme() as "dark" | "light") : "dark"
  );
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("zaelyn-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  async function handleLogout() {
    await logout();
    clearUser();
    router.push("/login");
  }

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "Z";

  return (
    <header
      className="flex items-center px-5 gap-4 flex-shrink-0"
      style={{
        height: "48px",
        background: isPhantom ? "rgba(139,92,246,0.04)" : "var(--background)",
        borderBottom: isPhantom
          ? "1px solid rgba(139,92,246,0.2)"
          : "1px solid var(--border)",
        transition: "background 300ms ease, border-color 300ms ease",
      }}
    >
      {/* Logo */}
      <Link
        href="/chat"
        className="text-[17px] font-medium tracking-tight flex-shrink-0"
        style={{ fontFamily: "var(--font-dm-sans)", color: "var(--foreground)" }}
      >
        <span style={{ color: "#8b5cf6" }}>Zae</span>lyn
      </Link>

      <div className="flex-1" />

      {/* Model selector */}
      <button
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150"
        style={{
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          color: "#10b981",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
        Zaelyn Fast
        <CaretDown size={10} weight="bold" />
      </button>

      {/* Privacy badge */}
      {isPhantom ? (
        <Link
          href="/me/privacidad"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150"
          style={{
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "#a78bfa",
          }}
        >
          <Ghost size={12} weight="fill" />
          Phantom
          <span style={{ fontSize: "10px" }}>◈</span>
        </Link>
      ) : (
        <Link
          href="/me/privacidad"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150"
          style={{
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.15)",
            color: "#10b981",
          }}
        >
          <ShieldCheck size={12} weight="fill" />
          Sovereign
        </Link>
      )}

      {/* Language pill */}
      <div
        className="hidden sm:flex items-center rounded-lg overflow-hidden flex-shrink-0"
        style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)" }}
      >
        {(["es", "en", "pt"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className="px-2.5 py-1 text-[10px] font-medium tracking-widest transition-all duration-150"
            style={{
              color: lang === l ? "#fff" : "var(--muted-foreground)",
              background: lang === l ? "#6366f1" : "transparent",
              letterSpacing: "0.06em",
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
        style={{ color: "var(--muted-foreground)" }}
        aria-label="Cambiar tema"
      >
        {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Avatar / dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown((v) => !v)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium transition-all duration-150 flex-shrink-0"
          style={
            isPhantom
              ? {
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#a78bfa",
                }
              : {
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  color: "#818cf8",
                }
          }
        >
          {isPhantom ? <Ghost size={14} /> : initials}
        </button>

        {showDropdown && (
          <div
            className="absolute right-0 top-10 w-44 rounded-xl overflow-hidden z-50"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <Link
              href="/me"
              onClick={() => setShowDropdown(false)}
              className="block px-4 py-3 text-[13px] transition-colors duration-150"
              style={{ color: "var(--foreground)" }}
            >
              Mi perfil
            </Link>
            <Link
              href="/me/privacidad"
              onClick={() => setShowDropdown(false)}
              className="block px-4 py-3 text-[13px] transition-colors duration-150"
              style={{ color: "var(--foreground)", borderTop: "1px solid var(--border)" }}
            >
              Privacidad
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-[13px] transition-colors duration-150"
              style={{
                color: "var(--muted-foreground)",
                borderTop: "1px solid var(--border)",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

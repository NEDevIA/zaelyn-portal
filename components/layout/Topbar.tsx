"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  CaretDown,
  Ghost,
  ShieldCheck,
  Eye,
  Lock,
  Lightning,
  Brain,
} from "@phosphor-icons/react";
import ZaelynLogo from "@/components/ui/ZaelynLogo";
import { useAuthStore } from "@/store/useAuthStore";
import { usePhantomStore } from "@/store/usePhantomStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { logout, updateUser } from "@/lib/api";
import type { Lang } from "@/lib/i18n";

function getTheme() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("zaelyn-theme") === "light" ? "light" : "dark";
}

type PrivacyLevel = "comfort" | "sovereign" | "full_sovereign";

const PRIVACY_OPTIONS: {
  value: PrivacyLevel;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  disabled?: boolean;
  disabledLabel?: string;
}[] = [
  {
    value: "comfort",
    label: "Comfort",
    icon: <Eye size={12} weight="fill" />,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    value: "sovereign",
    label: "Sovereign",
    icon: <ShieldCheck size={12} weight="fill" />,
    color: "#10b981",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.15)",
  },
  {
    value: "full_sovereign",
    label: "Full Sovereign",
    icon: <Lock size={12} weight="fill" />,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.06)",
    border: "rgba(99,102,241,0.15)",
    disabled: true,
    disabledLabel: "Fase II",
  },
];

function getPrivacyOption(mode: string | undefined) {
  return PRIVACY_OPTIONS.find((o) => o.value === mode) ?? PRIVACY_OPTIONS[1];
}

export default function Topbar() {
  const router = useRouter();
  const { user, setUser, clearUser } = useAuthStore();
  const { isPhantom } = usePhantomStore();
  const { lang, setLang } = useLanguageStore();

  const [theme, setTheme] = useState<"dark" | "light">(() =>
    typeof window !== "undefined" ? (getTheme() as "dark" | "light") : "dark"
  );
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const privacyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node))
        setShowAvatarDropdown(false);
      if (modelRef.current && !modelRef.current.contains(e.target as Node))
        setShowModelDropdown(false);
      if (privacyRef.current && !privacyRef.current.contains(e.target as Node))
        setShowPrivacyDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

  async function handleModelSelect(model: "fast" | "smart") {
    setShowModelDropdown(false);
    if (!user) return;
    setUser({ ...user, preferredModel: model });
    await updateUser({ preferred_model: model });
  }

  async function handlePrivacySelect(level: PrivacyLevel) {
    setShowPrivacyDropdown(false);
    if (!user) return;
    setUser({ ...user, privacyMode: level });
    await updateUser({ privacy_level: level });
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "Z";

  const isPro = user?.plan === "pro" || user?.plan === "enterprise";
  const currentModel = user?.preferredModel ?? "fast";
  const modelLabel = currentModel === "smart" ? "Zaelyn Smart" : "Zaelyn Fast";
  const modelColor = currentModel === "smart" ? "#818cf8" : "#10b981";
  const modelBg =
    currentModel === "smart" ? "rgba(99,102,241,0.08)" : "rgba(16,185,129,0.08)";
  const modelBorder =
    currentModel === "smart" ? "rgba(99,102,241,0.2)" : "rgba(16,185,129,0.2)";

  const privacyOpt = getPrivacyOption(user?.privacyMode);

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
      <ZaelynLogo href="/chat" size={17} />

      <div className="flex-1" />

      {/* Model selector */}
      <div ref={modelRef} className="relative hidden sm:block">
        <button
          onClick={() => isPro && setShowModelDropdown((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150"
          style={{
            background: modelBg,
            border: `1px solid ${modelBorder}`,
            color: modelColor,
            cursor: isPro ? "pointer" : "default",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: modelColor }} />
          {modelLabel}
          {isPro && <CaretDown size={10} weight="bold" />}
        </button>

        {showModelDropdown && (
          <div
            className="absolute right-0 top-10 w-48 rounded-xl overflow-hidden z-50"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            {(
              [
                {
                  value: "fast" as const,
                  label: "Zaelyn Fast",
                  sub: "Haiku · rápido y eficiente",
                  icon: <Lightning size={13} weight="fill" />,
                  color: "#10b981",
                },
                {
                  value: "smart" as const,
                  label: "Zaelyn Smart",
                  sub: "Sonnet · profundo e inteligente",
                  icon: <Brain size={13} weight="fill" />,
                  color: "#818cf8",
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleModelSelect(opt.value)}
                className="w-full flex items-start gap-2.5 px-4 py-3 text-left transition-colors duration-150"
                style={{
                  background:
                    currentModel === opt.value ? `${opt.color}10` : "transparent",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ color: opt.color, marginTop: "1px" }}>{opt.icon}</span>
                <div>
                  <p className="text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                    {opt.label}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    {opt.sub}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

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
        <div ref={privacyRef} className="relative hidden sm:block">
          <button
            onClick={() => setShowPrivacyDropdown((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150"
            style={{
              background: privacyOpt.bg,
              border: `1px solid ${privacyOpt.border}`,
              color: privacyOpt.color,
            }}
          >
            {privacyOpt.icon}
            {privacyOpt.label}
            <CaretDown size={10} weight="bold" />
          </button>

          {showPrivacyDropdown && (
            <div
              className="absolute right-0 top-10 w-52 rounded-xl overflow-hidden z-50"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              }}
            >
              {PRIVACY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => !opt.disabled && handlePrivacySelect(opt.value)}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors duration-150"
                  style={{
                    background:
                      privacyOpt.value === opt.value ? `${opt.color}10` : "transparent",
                    borderBottom: "1px solid var(--border)",
                    opacity: opt.disabled ? 0.5 : 1,
                    cursor: opt.disabled ? "default" : "pointer",
                  }}
                >
                  <span style={{ color: opt.color }}>{opt.icon}</span>
                  <span
                    className="text-[12px] font-medium flex-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {opt.label}
                  </span>
                  {opt.disabled && (
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ background: `${opt.color}15`, color: opt.color }}
                    >
                      {opt.disabledLabel}
                    </span>
                  )}
                  {privacyOpt.value === opt.value && !opt.disabled && (
                    <span style={{ color: opt.color, fontSize: "10px" }}>✓</span>
                  )}
                </button>
              ))}
              <Link
                href="/me/privacidad"
                onClick={() => setShowPrivacyDropdown(false)}
                className="flex items-center px-4 py-2.5 text-[11px] transition-colors duration-150"
                style={{ color: "var(--muted-foreground)" }}
              >
                Gestionar Phantom Mode →
              </Link>
            </div>
          )}
        </div>
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
      <div ref={avatarRef} className="relative">
        <button
          onClick={() => setShowAvatarDropdown((v) => !v)}
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

        {showAvatarDropdown && (
          <div
            className="absolute right-0 top-10 w-44 rounded-xl overflow-hidden z-50"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <Link
              href="/settings"
              onClick={() => setShowAvatarDropdown(false)}
              className="block px-4 py-3 text-[13px] transition-colors duration-150"
              style={{ color: "var(--foreground)" }}
            >
              Configuración
            </Link>
            <Link
              href="/me"
              onClick={() => setShowAvatarDropdown(false)}
              className="block px-4 py-3 text-[13px] transition-colors duration-150"
              style={{
                color: "var(--foreground)",
                borderTop: "1px solid var(--border)",
              }}
            >
              Mi perfil
            </Link>
            <Link
              href="/me/privacidad"
              onClick={() => setShowAvatarDropdown(false)}
              className="block px-4 py-3 text-[13px] transition-colors duration-150"
              style={{
                color: "var(--foreground)",
                borderTop: "1px solid var(--border)",
              }}
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

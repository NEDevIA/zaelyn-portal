"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Ghost, ShieldCheck, Eye, Lock, Check } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePersonaStore } from "@/store/usePersonaStore";
import { updateUser, updatePersona } from "@/lib/api";

// ── Avatar color helpers ──────────────────────────────────────────────────────

const AVATAR_STYLES = [
  { bg: "rgba(99,102,241,0.12)", color: "#818cf8" },
  { bg: "rgba(16,185,129,0.08)", color: "#10b981" },
  { bg: "rgba(249,168,212,0.15)", color: "#ec4899" },
  { bg: "rgba(251,191,36,0.1)", color: "#f59e0b" },
  { bg: "rgba(139,92,246,0.12)", color: "#a78bfa" },
];

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

function getAvatarStyle(userId: string) {
  return AVATAR_STYLES[djb2(userId) % AVATAR_STYLES.length];
}

// ── Persona definitions ───────────────────────────────────────────────────────

const PERSONAS = [
  {
    id: "serena",
    emoji: "🌊",
    name: "Serena",
    description: "Calmada, reflexiva y profunda",
  },
  {
    id: "viva",
    emoji: "⚡",
    name: "Viva",
    description: "Energética, directa y ágil",
  },
  {
    id: "lucida",
    emoji: "🔭",
    name: "Lúcida",
    description: "Analítica, precisa y estructurada",
  },
  {
    id: "calida",
    emoji: "🌸",
    name: "Cálida",
    description: "Empática, cercana y humana",
  },
  {
    id: "sabia",
    emoji: "🦉",
    name: "Sabia",
    description: "Experimentada, pausada y perspicaz",
  },
];

// ── Privacy options ───────────────────────────────────────────────────────────

type PrivacyLevel = "comfort" | "sovereign" | "full_sovereign";

const PRIVACY_OPTIONS: {
  value: PrivacyLevel;
  icon: React.ReactNode;
  label: string;
  badge: string;
  description: string;
  color: string;
  disabled?: boolean;
}[] = [
  {
    value: "comfort",
    icon: <Eye size={16} weight="fill" />,
    label: "Comfort",
    badge: "Estándar",
    description: "Experiencia optimizada con contexto completo",
    color: "#3b82f6",
  },
  {
    value: "sovereign",
    icon: <ShieldCheck size={16} weight="fill" />,
    label: "Sovereign",
    badge: "Recomendado",
    description: "Privacidad avanzada, sin compartir datos con terceros",
    color: "#10b981",
  },
  {
    value: "full_sovereign",
    icon: <Lock size={16} weight="fill" />,
    label: "Full Sovereign",
    badge: "Fase II",
    description: "Control total, cifrado extremo a extremo",
    color: "#6366f1",
    disabled: true,
  },
];

// ── Section save feedback ────────────────────────────────────────────────────

type SavingSection = "persona" | "model" | "briefing" | "privacy" | null;

// ── Main component ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const {
    personaId,
    briefingEnabled,
    briefingTime,
    tone,
    isLoaded,
    setPersona,
    loadPersona,
  } = usePersonaStore();

  const [savingSection, setSavingSection] = useState<SavingSection>(null);

  useEffect(() => {
    if (!isLoaded) loadPersona();
  }, [isLoaded, loadPersona]);

  const flashSave = useCallback((section: SavingSection) => {
    setSavingSection(section);
    const t = setTimeout(() => setSavingSection(null), 1500);
    return () => clearTimeout(t);
  }, []);

  const isPro = user?.plan === "pro" || user?.plan === "enterprise";
  const currentModel = user?.preferredModel ?? "fast";
  const currentPrivacy = (user?.privacyMode ?? "sovereign") as PrivacyLevel | "phantom";

  const avatarStyle = user ? getAvatarStyle(user.id) : AVATAR_STYLES[0];
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "Z";

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handlePersonaSelect(id: string) {
    setPersona({ personaId: id });
    await updatePersona({ personaId: id });
    flashSave("persona");
  }

  async function handleModelSelect(model: "fast" | "smart") {
    if (!user) return;
    setUser({ ...user, preferredModel: model });
    await updateUser({ preferred_model: model });
    flashSave("model");
  }

  async function handleBriefingToggle(enabled: boolean) {
    setPersona({ briefingEnabled: enabled });
    await updatePersona({ briefingEnabled: enabled });
    flashSave("briefing");
  }

  async function handleBriefingTimeChange(time: string) {
    setPersona({ briefingTime: time });
    await updatePersona({ briefingTime: time });
    flashSave("briefing");
  }

  async function handlePrivacySelect(level: PrivacyLevel) {
    if (!user) return;
    setUser({ ...user, privacyMode: level });
    await updateUser({ privacy_level: level });
    flashSave("privacy");
  }

  if (!user) return null;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-2xl mx-auto px-6 py-10 pb-24">
        {/* Header */}
        <h1
          className="text-2xl font-semibold mb-8"
          style={{ fontFamily: "var(--font-dm-sans, inherit)" }}
        >
          Configuración
        </h1>

        {/* ── SECTION 1: PERFIL ────────────────────────────────────────────── */}
        <section className="mb-10">
          <p
            className="text-[11px] font-semibold tracking-widest mb-4 uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            Perfil
          </p>

          <div
            className="rounded-2xl p-6 flex items-center gap-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-semibold flex-shrink-0"
              style={{
                background: avatarStyle.bg,
                color: avatarStyle.color,
                border: `1.5px solid ${avatarStyle.color}33`,
              }}
            >
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name */}
              <div
                className="text-[14px] font-medium mb-1 truncate"
                style={{ color: "var(--foreground)" }}
              >
                {user.name ?? "—"}
              </div>
              {/* Email */}
              <div
                className="text-[13px] truncate"
                style={{ color: "var(--muted-foreground)" }}
              >
                {user.email}
              </div>
              {/* Plan badge */}
              <div className="mt-2">
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium capitalize"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    color: "#818cf8",
                  }}
                >
                  {user.plan}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: ZAELYN ────────────────────────────────────────────── */}
        <section className="mb-10">
          <p
            className="text-[11px] font-semibold tracking-widest mb-4 uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            Zaelyn
          </p>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Personalidad */}
            <div className="p-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                  Personalidad
                </p>
                {savingSection === "persona" && (
                  <span className="flex items-center gap-1 text-[12px]" style={{ color: "#10b981" }}>
                    <Check size={12} weight="bold" />
                    Guardado
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PERSONAS.map((p) => {
                  const selected = personaId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePersonaSelect(p.id)}
                      className="flex flex-col items-start p-3 rounded-xl text-left transition-all duration-150"
                      style={{
                        background: selected
                          ? "rgba(99,102,241,0.08)"
                          : "rgba(255,255,255,0.02)",
                        border: selected
                          ? "1.5px solid rgba(99,102,241,0.4)"
                          : "1.5px solid var(--border)",
                        outline: "none",
                      }}
                    >
                      <span className="text-[18px] mb-1.5">{p.emoji}</span>
                      <span
                        className="text-[13px] font-medium block"
                        style={{ color: selected ? "#818cf8" : "var(--foreground)" }}
                      >
                        {p.name}
                      </span>
                      <span
                        className="text-[11px] leading-tight mt-0.5"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {p.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modelo */}
            <div className="p-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                  Modelo
                </p>
                {savingSection === "model" && (
                  <span className="flex items-center gap-1 text-[12px]" style={{ color: "#10b981" }}>
                    <Check size={12} weight="bold" />
                    Guardado
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {/* Fast */}
                <button
                  onClick={() => handleModelSelect("fast")}
                  className="flex-1 flex flex-col items-start p-4 rounded-xl text-left transition-all duration-150"
                  style={{
                    background:
                      currentModel === "fast"
                        ? "rgba(16,185,129,0.08)"
                        : "rgba(255,255,255,0.02)",
                    border:
                      currentModel === "fast"
                        ? "1.5px solid rgba(16,185,129,0.35)"
                        : "1.5px solid var(--border)",
                  }}
                >
                  <span
                    className="text-[13px] font-semibold mb-0.5"
                    style={{ color: currentModel === "fast" ? "#10b981" : "var(--foreground)" }}
                  >
                    Fast
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Haiku · Rápido y eficiente
                  </span>
                </button>

                {/* Smart */}
                <button
                  onClick={() => {
                    if (isPro) handleModelSelect("smart");
                  }}
                  disabled={!isPro}
                  className="flex-1 flex flex-col items-start p-4 rounded-xl text-left transition-all duration-150"
                  style={{
                    background:
                      currentModel === "smart"
                        ? "rgba(99,102,241,0.08)"
                        : "rgba(255,255,255,0.02)",
                    border:
                      currentModel === "smart"
                        ? "1.5px solid rgba(99,102,241,0.4)"
                        : "1.5px solid var(--border)",
                    opacity: !isPro ? 0.55 : 1,
                    cursor: !isPro ? "not-allowed" : "pointer",
                  }}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[13px] font-semibold"
                      style={{ color: currentModel === "smart" ? "#818cf8" : "var(--foreground)" }}
                    >
                      Smart
                    </span>
                    {!isPro && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: "rgba(99,102,241,0.1)",
                          color: "#818cf8",
                        }}
                      >
                        Plan Pro
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Sonnet · Profundo e inteligente
                  </span>
                </button>
              </div>
            </div>

            {/* Briefing matutino */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                  Briefing matutino
                </p>
                {savingSection === "briefing" && (
                  <span className="flex items-center gap-1 text-[12px]" style={{ color: "#10b981" }}>
                    <Check size={12} weight="bold" />
                    Guardado
                  </span>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={briefingEnabled}
                  onChange={(e) => handleBriefingToggle(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-500"
                />
                <span className="text-[13px]" style={{ color: "var(--foreground)" }}>
                  Activar briefing diario
                </span>
              </label>

              {briefingEnabled && (
                <div className="mt-3 flex items-center gap-3">
                  <label
                    className="text-[12px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Hora:
                  </label>
                  <input
                    type="time"
                    value={briefingTime}
                    onChange={(e) => handleBriefingTimeChange(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-[13px] outline-none"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: PRIVACIDAD ─────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: "var(--muted-foreground)" }}
            >
              Privacidad
            </p>
            {savingSection === "privacy" && (
              <span className="flex items-center gap-1 text-[12px]" style={{ color: "#10b981" }}>
                <Check size={12} weight="bold" />
                Guardado
              </span>
            )}
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {PRIVACY_OPTIONS.map((opt, idx) => {
              const isSelected =
                currentPrivacy !== "phantom" && currentPrivacy === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (!opt.disabled) handlePrivacySelect(opt.value);
                  }}
                  disabled={opt.disabled}
                  className="w-full flex items-start gap-4 p-5 text-left transition-colors duration-150"
                  style={{
                    borderTop: idx > 0 ? "1px solid var(--border)" : undefined,
                    borderLeft: isSelected ? `3px solid ${opt.color}` : "3px solid transparent",
                    background: isSelected ? `${opt.color}08` : "transparent",
                    opacity: opt.disabled ? 0.55 : 1,
                    cursor: opt.disabled ? "not-allowed" : "pointer",
                  }}
                >
                  <span
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: isSelected ? opt.color : "var(--muted-foreground)" }}
                  >
                    {opt.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[13px] font-medium"
                        style={{
                          color: isSelected ? opt.color : "var(--foreground)",
                        }}
                      >
                        {opt.label}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${opt.color}15`,
                          color: opt.color,
                        }}
                      >
                        {opt.badge}
                      </span>
                    </div>
                    <p
                      className="text-[12px]"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Phantom mode note */}
            <div
              className="px-5 py-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div className="flex items-start gap-3">
                <Ghost
                  size={14}
                  weight="fill"
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "#a78bfa" }}
                />
                <div>
                  <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                    La gestión completa de Phantom Mode está en{" "}
                    <a
                      href="/me/privacidad"
                      className="underline"
                      style={{ color: "#a78bfa" }}
                    >
                      Privacidad
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

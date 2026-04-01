"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Ghost, Lock, Eye, CheckCircle } from "@phosphor-icons/react";
import { usePhantomStore } from "@/store/usePhantomStore";
import { startPhantom, endPhantom } from "@/lib/api";

type SubMode = "pure" | "selective" | "encrypted";

const SUB_MODES: { id: SubMode; label: string; desc: string }[] = [
  { id: "pure",      label: "Puro",      desc: "Nada se guarda. La sesión desaparece al cerrar el tab." },
  { id: "selective", label: "Selectivo", desc: "Zaelyn pregunta antes de guardar cualquier cosa." },
  { id: "encrypted", label: "Cifrado",   desc: "Los módulos se guardan con PIN. Máxima protección." },
];

const LEVELS = [
  {
    id: "comfort",
    icon: <Eye size={18} weight="duotone" />,
    name: "Comfort",
    badge: "Default",
    badgeColor: "#3b82f6",
    desc: "Zaelyn recuerda todo — conversaciones, módulos, historial completo. Máxima inteligencia contextual.",
    promise: "El modelo te conoce desde el primer día.",
  },
  {
    id: "sovereign",
    icon: <ShieldCheck size={18} weight="duotone" />,
    name: "Sovereign",
    badge: "Recomendado",
    badgeColor: "#10b981",
    desc: "Las conversaciones no se guardan en ningún servidor. Los módulos sí persisten, cifrados.",
    promise: "El balance perfecto: funcionalidad de módulos sin logs de chat.",
  },
  {
    id: "phantom",
    icon: <Ghost size={18} weight="duotone" />,
    name: "Phantom Mode ◈",
    badge: "Nuevo",
    badgeColor: "#8b5cf6",
    desc: "Token anónimo temporal. El modelo nunca sabe quién eres. Al cerrar el tab, desaparece. Verificable.",
    promise: "Para temas sensibles o cualquier conversación que no debería existir después.",
  },
  {
    id: "full_sovereign",
    icon: <Lock size={18} weight="duotone" />,
    name: "Full Sovereign",
    badge: "Fase II",
    badgeColor: "#6366f1",
    desc: "Modelo local con Ollama. Solo portal web. Nada sale de tu dispositivo.",
    promise: "La capa criptográfica completa. Instrucciones de instalación en docs.",
  },
];

export default function PrivacidadPage() {
  const { isPhantom, anonToken, subMode, activate, deactivate } = usePhantomStore();
  const [selectedSub, setSelectedSub] = useState<SubMode>(
    (subMode as SubMode | null) ?? "pure"
  );
  const [loading, setLoading] = useState(false);
  const [phantomExpanded, setPhantomExpanded] = useState(false);
  const [verifyExpanded, setVerifyExpanded] = useState(false);

  async function handleActivatePhantom() {
    setLoading(true);
    const data = await startPhantom(selectedSub);
    if (data) {
      activate(data.anonToken, data.subMode as SubMode, data.expiresAt);
    }
    setLoading(false);
  }

  async function handleDeactivatePhantom() {
    setLoading(true);
    if (anonToken) await endPhantom(anonToken);
    deactivate();
    setLoading(false);
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[640px] mx-auto w-full">
      {/* Back */}
      <Link
        href="/me"
        className="inline-flex items-center gap-2 text-[13px] mb-8 transition-opacity duration-150 hover:opacity-60"
        style={{ color: "var(--muted-foreground)" }}
      >
        <ArrowLeft size={14} /> Mi perfil
      </Link>

      <h1
        className="text-[20px] font-medium mb-2"
        style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
      >
        Privacidad
      </h1>
      <p className="text-[13px] mb-8 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        Cuatro niveles. Desde la inteligencia máxima hasta el anonimato verificable. La elección siempre es tuya.
      </p>

      {/* Privacy level cards */}
      <div className="flex flex-col gap-3 mb-10">
        {LEVELS.map((lvl) => {
          const isPhantomCard = lvl.id === "phantom";
          const isActive      = isPhantomCard ? isPhantom : false;
          const isFullSov     = lvl.id === "full_sovereign";

          return (
            <div
              key={lvl.id}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: isActive
                  ? "rgba(139,92,246,0.05)"
                  : "rgba(255,255,255,0.02)",
                border: isActive
                  ? "1px solid rgba(139,92,246,0.25)"
                  : "1px solid var(--border)",
              }}
            >
              {/* Card header */}
              <div
                className="flex items-center gap-3 px-4 py-4 cursor-pointer"
                onClick={() => isPhantomCard && setPhantomExpanded((v) => !v)}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${lvl.badgeColor}14`, color: lvl.badgeColor }}
                >
                  {lvl.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-medium" style={{ color: "var(--foreground)" }}>
                      {lvl.name}
                    </span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${lvl.badgeColor}18`, color: lvl.badgeColor }}
                    >
                      {lvl.badge}
                    </span>
                    {isActive && (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}
                      >
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] mt-0.5 leading-snug" style={{ color: "var(--muted-foreground)" }}>
                    {lvl.desc}
                  </p>
                </div>
                {isPhantomCard && (
                  <span style={{ color: "var(--muted-foreground)", opacity: 0.4, fontSize: 18 }}>
                    {phantomExpanded ? "∧" : "∨"}
                  </span>
                )}
                {isFullSov && (
                  <Link
                    href="https://ollama.com"
                    target="_blank"
                    className="text-[12px] flex-shrink-0 transition-opacity hover:opacity-70"
                    style={{ color: "#6366f1" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Docs →
                  </Link>
                )}
              </div>

              {/* Phantom Mode expanded */}
              {isPhantomCard && phantomExpanded && (
                <div
                  className="px-4 pb-5 flex flex-col gap-4"
                  style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}
                >
                  {/* Promise */}
                  <p className="text-[13px] pt-4 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    {lvl.promise}
                  </p>

                  {/* Sub-modes */}
                  {!isPhantom && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[11px] font-medium tracking-wide uppercase" style={{ color: "#8b5cf6", opacity: 0.7 }}>
                        Selecciona el modo
                      </p>
                      {SUB_MODES.map((sm) => (
                        <button
                          key={sm.id}
                          onClick={() => setSelectedSub(sm.id)}
                          className="flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150"
                          style={{
                            background: selectedSub === sm.id ? "rgba(139,92,246,0.1)" : "transparent",
                            border: selectedSub === sm.id
                              ? "1px solid rgba(139,92,246,0.3)"
                              : "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 transition-all"
                            style={{
                              borderColor: selectedSub === sm.id ? "#8b5cf6" : "rgba(255,255,255,0.2)",
                              background: selectedSub === sm.id ? "#8b5cf6" : "transparent",
                            }}
                          />
                          <div>
                            <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                              {sm.label}
                            </p>
                            <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                              {sm.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Active submode indicator */}
                  {isPhantom && subMode && (
                    <div
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}
                    >
                      <CheckCircle size={14} style={{ color: "#a78bfa" }} />
                      <p className="text-[13px]" style={{ color: "#a78bfa" }}>
                        Modo {SUB_MODES.find((s) => s.id === subMode)?.label ?? subMode} activo
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  {!isPhantom ? (
                    <button
                      onClick={handleActivatePhantom}
                      disabled={loading}
                      className="h-10 px-5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-all duration-150"
                      style={{
                        background: loading ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.15)",
                        border: "1px solid rgba(139,92,246,0.35)",
                        color: "#a78bfa",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      <Ghost size={14} />
                      {loading ? "Activando..." : "Activar Phantom Mode para esta sesión"}
                    </button>
                  ) : (
                    <button
                      onClick={handleDeactivatePhantom}
                      disabled={loading}
                      className="h-10 px-5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-all duration-150"
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(139,92,246,0.3)",
                        color: "#a78bfa",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {loading ? "Desactivando..." : "Desactivar Phantom Mode"}
                    </button>
                  )}

                  {/* Verificabilidad */}
                  <button
                    onClick={() => setVerifyExpanded((v) => !v)}
                    className="text-[12px] text-left transition-opacity hover:opacity-70"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    ¿Cómo verificar que funciona? {verifyExpanded ? "∧" : "→"}
                  </button>

                  {verifyExpanded && (
                    <div
                      className="flex flex-col gap-2 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
                    >
                      {[
                        "Activa Phantom Mode.",
                        "Manda 5 mensajes en el chat.",
                        "Ve a /me → Exportar mis datos.",
                        "Busca esos mensajes en el archivo exportado.",
                        "No van a estar. Esa es la prueba.",
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span
                            className="text-[10px] font-semibold flex-shrink-0 mt-0.5"
                            style={{ color: "#8b5cf6", opacity: 0.7 }}
                          >
                            {i + 1}.
                          </span>
                          <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Promise line for non-phantom cards */}
              {!isPhantomCard && (
                <div
                  className="px-4 pb-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <p className="text-[12px] pt-3 italic" style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>
                    {lvl.promise}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lo que prometemos */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.015)", border: "1px solid var(--border)" }}
      >
        <p className="text-[12px] font-medium tracking-wide mb-3 uppercase" style={{ color: "var(--muted-foreground)" }}>
          Lo que Zaelyn promete
        </p>
        <div className="flex flex-col gap-2">
          {[
            { yes: true,  text: "Tus datos nunca se venden a terceros." },
            { yes: true,  text: "En Sovereign, las conversaciones no se guardan en ningún servidor." },
            { yes: true,  text: "En Phantom Mode, el token anónimo desaparece al cerrar el tab." },
            { yes: true,  text: "Puedes exportar y borrar todos tus datos en cualquier momento." },
            { yes: false, text: "No prometemos que el modelo sea perfecto." },
            { yes: false, text: "No prometemos que Comfort sea tan privado como Sovereign." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="text-[12px] flex-shrink-0 font-semibold"
                style={{ color: item.yes ? "#10b981" : "#ef4444", marginTop: "1px" }}
              >
                {item.yes ? "✓" : "✗"}
              </span>
              <p className="text-[13px] leading-snug" style={{ color: "var(--muted-foreground)" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

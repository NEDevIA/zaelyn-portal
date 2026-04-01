"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, TelegramLogo, CheckCircle, ArrowCounterClockwise } from "@phosphor-icons/react";
import { getTelegramLinkCode, getTelegramLinkStatus } from "@/lib/api";

type Status = "loading" | "ready" | "polling" | "linked" | "error";

export default function TelegramPage() {
  const [status, setStatus]   = useState<Status>("loading");
  const [code, setCode]       = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const pollRef               = useRef<ReturnType<typeof setInterval> | null>(null);

  async function loadCode() {
    setStatus("loading");
    const data = await getTelegramLinkCode();
    if (!data) { setStatus("error"); return; }
    setCode(data.code);
    setStatus("ready");
  }

  function startPolling() {
    setStatus("polling");
    pollRef.current = setInterval(async () => {
      const s = await getTelegramLinkStatus();
      if (s.linked) {
        clearInterval(pollRef.current!);
        setUsername(s.username ?? "");
        setStatus("linked");
      }
    }, 3000);
  }

  useEffect(() => {
    loadCode();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  // Auto-start polling once code is loaded
  useEffect(() => {
    if (status === "ready" && code) startPolling();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, code]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[520px] mx-auto w-full">
      {/* Back */}
      <Link
        href="/me"
        className="inline-flex items-center gap-2 text-[13px] mb-8 transition-opacity duration-150 hover:opacity-60"
        style={{ color: "var(--muted-foreground)" }}
      >
        <ArrowLeft size={14} /> Mi perfil
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}
        >
          <TelegramLogo size={20} weight="duotone" />
        </div>
        <div>
          <h1 className="text-[18px] font-medium" style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}>
            Vincular Telegram
          </h1>
          <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
            Conecta @ZaelynBot con esta cuenta
          </p>
        </div>
      </div>

      {/* States */}
      {status === "loading" && (
        <div className="flex items-center gap-3 py-8">
          <div
            className="w-5 h-5 rounded-full border-2 animate-spin flex-shrink-0"
            style={{ borderColor: "#3b82f6", borderTopColor: "transparent" }}
          />
          <span className="text-[14px]" style={{ color: "var(--muted-foreground)" }}>
            Generando código...
          </span>
        </div>
      )}

      {(status === "ready" || status === "polling") && code && (
        <div className="flex flex-col gap-6">
          {/* Instrucciones */}
          <div className="flex flex-col gap-3">
            {[
              { n: "1", text: "Abre Telegram y busca @ZaelynBot" },
              { n: "2", text: "Mándale este código en un mensaje:" },
              { n: "3", text: "Listo — el bot confirmará y quedarán vinculados" },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}
                >
                  {step.n}
                </span>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* Código */}
          <div
            className="flex flex-col items-center gap-3 p-6 rounded-2xl"
            style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <p className="text-[11px] font-medium tracking-widest uppercase" style={{ color: "#3b82f6", opacity: 0.7 }}>
              Tu código
            </p>
            <p
              className="text-[44px] font-semibold tracking-[0.18em]"
              style={{ fontFamily: "var(--font-dm-mono)", color: "#3b82f6", letterSpacing: "0.2em" }}
            >
              {code}
            </p>
            <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
              Válido por 10 minutos
            </p>
          </div>

          {/* Polling indicator */}
          {status === "polling" && (
            <div className="flex items-center gap-2.5 py-2">
              <div
                className="w-4 h-4 rounded-full border-2 animate-spin flex-shrink-0"
                style={{ borderColor: "#3b82f6", borderTopColor: "transparent" }}
              />
              <span className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>
                Esperando confirmación del bot...
              </span>
            </div>
          )}

          {/* Refresh code */}
          <button
            onClick={loadCode}
            className="inline-flex items-center gap-2 text-[13px] transition-opacity duration-150 hover:opacity-60"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ArrowCounterClockwise size={13} /> Generar nuevo código
          </button>
        </div>
      )}

      {status === "linked" && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <CheckCircle size={48} weight="duotone" style={{ color: "#10b981" }} />
          <div>
            <p className="text-[18px] font-medium" style={{ color: "var(--foreground)" }}>
              Telegram vinculado
            </p>
            {username && (
              <p className="text-[14px] mt-1" style={{ color: "var(--muted-foreground)" }}>
                @{username}
              </p>
            )}
          </div>
          <p className="text-[13px] max-w-[300px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Zaelyn en el portal y en Telegram ahora comparten el mismo contexto, módulos y memoria.
          </p>
          <Link
            href="/chat"
            className="mt-2 h-10 px-5 rounded-xl text-[13px] font-medium flex items-center gap-2"
            style={{ background: "#6366f1", color: "#fff" }}
          >
            Ir al chat
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col gap-4 py-6">
          <p className="text-[14px]" style={{ color: "var(--muted-foreground)" }}>
            No se pudo generar el código. Intenta de nuevo.
          </p>
          <button
            onClick={loadCode}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-medium"
            style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <ArrowCounterClockwise size={13} /> Reintentar
          </button>
        </div>
      )}
    </div>
  );
}

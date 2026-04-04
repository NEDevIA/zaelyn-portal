"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, StopCircle } from "@phosphor-icons/react";

interface ComposerProps {
  onSend: (content: string) => void;
  isStreaming: boolean;
  onStop?: () => void;
  isPhantom?: boolean;
  disabled?: boolean;
}

export default function Composer({ onSend, isStreaming, onStop, isPhantom, disabled }: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    setValue("");
    onSend(trimmed);
  }

  const placeholder = isPhantom
    ? "Modo Phantom activo ◈ — esta sesión no se guarda..."
    : "Escribe, pregunta, o piensa en voz alta...";

  return (
    <div className="px-4 pb-5 pt-2">
      <div style={{ maxWidth: "760px", margin: "0 auto", width: "100%" }}>
      <div
        className="flex items-end gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
        style={{
          background: "var(--card)",
          border: isPhantom
            ? "1px solid rgba(139,92,246,0.3)"
            : "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isStreaming || disabled}
          className="flex-1 resize-none outline-none text-[14px] leading-relaxed bg-transparent"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-dm-sans)",
            minHeight: "24px",
            maxHeight: "120px",
          }}
        />

        <div className="flex-shrink-0 pb-0.5">
          {isStreaming ? (
            <button
              onClick={onStop}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
              aria-label="Detener"
            >
              <StopCircle size={16} weight="fill" />
            </button>
          ) : (
            value.trim() && (
              <button
                onClick={submit}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{ background: "#6366f1", color: "#ffffff" }}
                aria-label="Enviar"
              >
                <ArrowRight size={14} weight="bold" />
              </button>
            )
          )}
        </div>
      </div>

      <p
        className="text-center text-[11px] mt-2"
        style={{
          color: isPhantom ? "#a78bfa" : "var(--muted-foreground)",
          opacity: isPhantom ? 0.65 : 0.3,
          transition: "color 300ms ease",
        }}
      >
        {isPhantom
          ? "Phantom activo ◈ — esta sesión no existe en ningún servidor"
          : "Sovereign — sin logs · Enter para enviar · Shift+Enter para nueva línea"}
      </p>
      </div>
    </div>
  );
}

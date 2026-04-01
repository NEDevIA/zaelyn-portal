"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

const COPY = {
  es: "Habla con Zaelyn desde tu teléfono →",
  en: "Talk to Zaelyn from your phone →",
  pt: "Fale com Zaelyn pelo celular →",
} as const;

const STORAGE_KEY = "zaelyn_tg_banner_dismissed";

export default function TelegramBanner({ hasTelegram }: { hasTelegram: boolean }) {
  const { lang } = useLanguageStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasTelegram) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
  }, [hasTelegram]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(99,102,241,0.07)",
        borderBottom: "1px solid rgba(99,102,241,0.14)",
        padding: "7px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <a
        href="https://t.me/ZaelynBot"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 13,
          color: "#818cf8",
          textDecoration: "none",
          flex: 1,
        }}
      >
        {COPY[lang as keyof typeof COPY] ?? COPY.es}
      </a>
      <button
        onClick={dismiss}
        aria-label="Cerrar"
        style={{
          color: "var(--muted-foreground)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
          padding: "2px 4px",
          opacity: 0.6,
        }}
      >
        ×
      </button>
    </div>
  );
}

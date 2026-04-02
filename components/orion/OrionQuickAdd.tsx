"use client";

import { useState, useRef } from "react";

export default function OrionQuickAdd() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    if (!value.trim()) return;
    setValue("");
    setSent(true);
    setTimeout(() => setSent(false), 2200);
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--secondary)",
          border: "1px solid var(--border)",
          borderRadius: 10, padding: "8px 12px",
          transition: "border-color .2s",
        }}
        onFocus={() => {}}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={sent ? "Zaelyn procesó tu tarea ✓" : "Añadir tarea o compromiso..."}
          style={{
            background: "none", border: "none", outline: "none",
            fontSize: 12, color: "var(--foreground)",
            fontFamily: "inherit", flex: 1,
          }}
          onFocus={(e) => {
            (e.currentTarget.parentElement as HTMLDivElement).style.borderColor = "#60a5fa";
          }}
          onBlur={(e) => {
            (e.currentTarget.parentElement as HTMLDivElement).style.borderColor = "var(--border)";
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            color: "#60a5fa", fontSize: 14,
            background: "none", border: "none",
            cursor: "pointer", opacity: 0.8,
            transition: "opacity .2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.8"; }}
        >
          ↵
        </button>
      </div>
      <div
        style={{
          fontSize: 10, color: "var(--muted-foreground)",
          marginTop: 6, fontFamily: "var(--font-mono)", opacity: 0.45,
        }}
      >
        Zaelyn entiende lenguaje natural
      </div>
    </div>
  );
}

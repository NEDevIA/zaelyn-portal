"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { usePhantomStore } from "@/store/usePhantomStore";
import { Shield, TelegramLogo, Lock, User, ChartBar } from "@phosphor-icons/react";

export default function MePage() {
  const { user } = useAuthStore();
  const { isPhantom } = usePhantomStore();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "Z";

  const MENU = [
    {
      href: "/me/privacidad",
      icon: <Shield size={18} weight="duotone" />,
      label: "Privacidad",
      sub: "Comfort · Sovereign · Phantom · Full Sovereign",
      color: "#10b981",
    },
    {
      href: "/me/telegram",
      icon: <TelegramLogo size={18} weight="duotone" />,
      label: "Vincular Telegram",
      sub: "Conecta @ZaelynBot con tu cuenta web",
      color: "#3b82f6",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[640px] mx-auto w-full">
      {/* Avatar + nombre */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-[20px] font-semibold flex-shrink-0"
          style={
            isPhantom
              ? { background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }
              : { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }
          }
        >
          {initials}
        </div>
        <div>
          <p
            className="text-[18px] font-medium"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
          >
            {user?.name ?? "Usuario"}
          </p>
          <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>
            {user?.email}
          </p>
          <div
            className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#10b981",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
            {user?.plan ?? "beta"}
          </div>
        </div>
      </div>

      {/* Menú */}
      <div className="flex flex-col gap-2">
        {MENU.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-150 group"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-150"
              style={{ background: `${item.color}14`, color: item.color }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium" style={{ color: "var(--foreground)" }}>
                {item.label}
              </p>
              <p className="text-[12px] truncate" style={{ color: "var(--muted-foreground)" }}>
                {item.sub}
              </p>
            </div>
            <span style={{ color: "var(--muted-foreground)", opacity: 0.4 }}>›</span>
          </Link>
        ))}
      </div>

      {/* Plan */}
      <div
        className="mt-8 p-5 rounded-2xl"
        style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.12)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <ChartBar size={14} style={{ color: "#818cf8" }} />
          <p className="text-[12px] font-medium tracking-wide" style={{ color: "#818cf8" }}>
            PLAN BETA
          </p>
        </div>
        <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>
          Acceso completo durante la beta. Los primeros usuarios definen el producto.
        </p>
      </div>
    </div>
  );
}

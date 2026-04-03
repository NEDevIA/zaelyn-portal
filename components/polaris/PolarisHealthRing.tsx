"use client";
import { useEffect, useRef } from "react";

interface Props {
  score: number;
  size?: number;
  light?: boolean;
}

export function healthColor(score: number, light = false): string {
  if (score >= 90) return light ? "#ec4899" : "#f9a8d4";
  if (score >= 70) return light ? "#059669" : "#6ee7b7";
  if (score >= 50) return light ? "#2563eb" : "#93c5fd";
  if (score >= 30) return light ? "#d97706" : "#fcd34d";
  return light ? "#dc2626" : "#f87171";
}

export function healthEmoji(score: number): string {
  if (score >= 90) return "🌸";
  if (score >= 70) return "🌿";
  if (score >= 50) return "🍃";
  if (score >= 30) return "🍂";
  return "🥀";
}

export function momentumColor(m: string, light = false): string {
  const dark: Record<string, string> = {
    accelerating: "#34d399", stable: "#818cf8", slowing: "#f59e0b", stalled: "#f87171",
  };
  const lgt: Record<string, string> = {
    accelerating: "#059669", stable: "#6366f1", slowing: "#d97706", stalled: "#dc2626",
  };
  return (light ? lgt : dark)[m] ?? (light ? "#6366f1" : "#818cf8");
}

export function momentumLabel(m: string): string {
  return ({ accelerating: "acelerando", stable: "estable", slowing: "desacelerando", stalled: "estancada" }[m] ?? m);
}

export function momentumArrow(m: string): string {
  return ({ accelerating: "↑", stable: "→", slowing: "↓", stalled: "—" }[m] ?? "→");
}

export function PolarisHealthRing({ score, size = 44, light = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const color = healthColor(score, light);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    const cx = canvas.getContext("2d")!;
    cx.clearRect(0, 0, size * dpr, size * dpr);
    cx.scale(dpr, dpr);
    const c = size / 2, r = size / 2 - 3, lw = 3;
    // track
    cx.beginPath(); cx.arc(c, c, r, -Math.PI / 2, Math.PI * 1.5);
    cx.strokeStyle = light ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)";
    cx.lineWidth = lw; cx.stroke();
    // arc
    if (score > 0) {
      const end = -Math.PI / 2 + (score / 100) * Math.PI * 2;
      cx.beginPath(); cx.arc(c, c, r, -Math.PI / 2, end);
      cx.strokeStyle = color; cx.lineWidth = lw; cx.lineCap = "round"; cx.stroke();
      // glow
      cx.shadowColor = color; cx.shadowBlur = 6;
      cx.beginPath(); cx.arc(c, c, r, -Math.PI / 2, end);
      cx.strokeStyle = color + "88"; cx.lineWidth = lw + 1; cx.stroke();
    }
  }, [score, size, light]);

  return (
    <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
  );
}

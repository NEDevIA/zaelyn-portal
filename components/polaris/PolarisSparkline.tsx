"use client";
import { useEffect, useRef } from "react";

interface Props {
  data: number[];
  color: string;
  height?: number;
}

export function PolarisSparkline({ data, color, height = 28 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !data.length) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 120;
    const H = height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    const cx = canvas.getContext("2d")!;
    cx.clearRect(0, 0, W * dpr, H * dpr);
    cx.scale(dpr, dpr);
    const mn = Math.min(...data) - 5;
    const mx = Math.max(...data) + 5;
    const toY = (v: number) => H - ((v - mn) / (mx - mn || 1)) * (H - 4) - 2;
    const toX = (i: number) => (i / (data.length - 1)) * (W - 2) + 1;
    // gradient fill
    const grad = cx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + "44");
    grad.addColorStop(1, color + "00");
    cx.beginPath(); cx.moveTo(toX(0), toY(data[0]));
    for (let i = 1; i < data.length; i++) cx.lineTo(toX(i), toY(data[i]));
    cx.lineTo(toX(data.length - 1), H); cx.lineTo(toX(0), H); cx.closePath();
    cx.fillStyle = grad; cx.fill();
    // line
    cx.beginPath(); cx.moveTo(toX(0), toY(data[0]));
    for (let i = 1; i < data.length; i++) cx.lineTo(toX(i), toY(data[i]));
    cx.strokeStyle = color; cx.lineWidth = 1.5; cx.lineJoin = "round"; cx.stroke();
    // last dot
    const lx = toX(data.length - 1), ly = toY(data[data.length - 1]);
    cx.save(); cx.shadowColor = color; cx.shadowBlur = 6;
    cx.beginPath(); cx.arc(lx, ly, 2.5, 0, Math.PI * 2);
    cx.fillStyle = color; cx.fill(); cx.restore();
  }, [data, color, height]);

  return (
    <canvas
      ref={ref}
      style={{ width: "100%", height: height + "px", display: "block" }}
    />
  );
}

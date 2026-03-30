"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { validateInviteCode, sendMagicLink } from "@/lib/api";

export default function JoinPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "sent">("loading");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    validateInviteCode(code)
      .then((data) => {
        setStatus(data.valid ? "valid" : "invalid");
      })
      .catch(() => setStatus("invalid"));
  }, [code]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Ingresa un correo válido."); return; }
    setLoading(true);
    setError(null);
    try {
      await sendMagicLink(email, code);
      setStatus("sent");
    } catch {
      setError("No pudimos enviarte el link. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-[420px] flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-2xl font-medium tracking-tight"
            style={{ fontFamily: "var(--font-dm-sans)", color: "var(--foreground)" }}
          >
            <span style={{ color: "#8b5cf6" }}>Zae</span>lyn
          </span>
        </Link>

        {status === "loading" && (
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin flex-shrink-0"
              style={{ borderColor: "#8b5cf6", borderTopColor: "transparent" }}
            />
            <p className="text-[14px]" style={{ color: "var(--muted-foreground)" }}>
              Verificando invitación...
            </p>
          </div>
        )}

        {status === "invalid" && (
          <div className="flex flex-col gap-4">
            <h1
              className="text-2xl font-medium"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
            >
              Código no disponible.
            </h1>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Este código de invitación ya fue usado o no existe. Puedes pedir un lugar en la lista de espera.
            </p>
            <Link
              href="/#beta"
              className="inline-flex items-center gap-2 h-12 px-5 rounded-xl text-[14px] font-medium"
              style={{ background: "#6366f1", color: "#ffffff" }}
            >
              Pedir invitación
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {status === "valid" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div
                className="inline-flex items-center gap-2 text-[12px] font-medium px-3 py-1.5 rounded-full w-fit"
                style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                Invitación válida
              </div>
              <h1
                className="text-2xl font-medium"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
              >
                Te invitaron a Zaelyn.
              </h1>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                Ingresa tu correo para recibir el link de acceso.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoFocus
                className="h-12 px-4 rounded-xl text-[15px] outline-none transition-all duration-200"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              />
              {error && (
                <p className="text-[13px]" style={{ color: "#ef4444" }}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="h-12 px-5 rounded-xl text-[14px] font-medium flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: loading ? "rgba(99,102,241,0.5)" : "#6366f1",
                  color: "#ffffff",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Enviando..." : "Empezar"}
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>
          </div>
        )}

        {status === "sent" && (
          <div className="flex flex-col gap-4">
            <h1
              className="text-2xl font-medium"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
            >
              Revisa tu correo.
            </h1>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Te enviamos el link de bienvenida a{" "}
              <strong style={{ color: "var(--foreground)" }}>{email}</strong>.
            </p>
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <p className="text-[13px]" style={{ color: "#10b981" }}>
                Tienes 15 minutos para usar el link.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

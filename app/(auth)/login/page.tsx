"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { sendMagicLink } from "@/lib/api";
import ZaelynLogo from "@/components/ui/ZaelynLogo";

type SentState = "sent" | "waiting" | "not_found" | false;

function LoginForm() {
  const params = useSearchParams();
  const errorParam = params.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<SentState>(false);
  const [error, setError] = useState<string | null>(
    errorParam === "invalid_token"
      ? "El link expiró o no es válido. Intenta de nuevo."
      : errorParam === "missing_token"
        ? "Link incompleto. Intenta de nuevo."
        : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Ingresa un correo válido."); return; }
    setLoading(true);
    setError(null);
    try {
      // 1. Verificar si el email tiene acceso aprobado
      const check = await fetch("/api/auth/check-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((r) => r.json())
        .catch(() => ({ status: "approved" }));

      if (check.status === "waiting") {
        setSent("waiting");
        return;
      }
      if (check.status === "not_found") {
        setSent("not_found");
        return;
      }

      // 2. Aprobado → enviar magic link
      await sendMagicLink(email);
      setSent("sent");
    } catch {
      setError("No pudimos verificar tu acceso. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-[400px] flex flex-col gap-8">
        {/* Logo */}
        <ZaelynLogo href="/" size={24} />

        {/* Estado: magic link enviado */}
        {sent === "sent" && (
          <div className="flex flex-col gap-4">
            <h1
              className="text-2xl font-medium"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
            >
              Revisa tu correo.
            </h1>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Te enviamos un link a{" "}
              <strong style={{ color: "var(--foreground)" }}>{email}</strong>.
              Tienes 15 minutos para usarlo.
            </p>
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}
            >
              <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>
                ¿No llegó? Revisa spam o{" "}
                <button
                  onClick={() => setSent(false)}
                  className="underline"
                  style={{ color: "#8b5cf6" }}
                >
                  intenta de nuevo
                </button>
                .
              </p>
            </div>
          </div>
        )}

        {/* Estado: en lista de espera */}
        {sent === "waiting" && (
          <div className="flex flex-col gap-4">
            <h1
              className="text-2xl font-medium"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
            >
              Ya estás en nuestra lista.
            </h1>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Te avisamos en cuanto tengamos un lugar para ti. Gracias por tu paciencia.
            </p>
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)" }}
            >
              <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>
                ¿Cambiaste de email?{" "}
                <button
                  onClick={() => setSent(false)}
                  className="underline"
                  style={{ color: "#818cf8" }}
                >
                  Intenta con otro correo
                </button>
                .
              </p>
            </div>
          </div>
        )}

        {/* Estado: no está en ninguna lista */}
        {sent === "not_found" && (
          <div className="flex flex-col gap-4">
            <h1
              className="text-2xl font-medium"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
            >
              Zaelyn está en beta cerrada.
            </h1>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Únete a la lista de espera y te avisamos cuando sea tu turno.
            </p>
            <a
              href="https://zaelyn.ai/#beta"
              className="h-12 px-5 rounded-xl text-[14px] font-medium flex items-center justify-center gap-2 transition-all duration-200"
              style={{ background: "#6366f1", color: "#ffffff", textDecoration: "none" }}
            >
              Unirme a la lista →
            </a>
            <button
              onClick={() => setSent(false)}
              className="text-[13px] text-center"
              style={{ color: "var(--muted-foreground)" }}
            >
              ← Volver
            </button>
          </div>
        )}

        {/* Estado: formulario */}
        {!sent && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1
                className="text-2xl font-medium"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
              >
                Entrar a Zaelyn
              </h1>
              <p className="text-[14px]" style={{ color: "var(--muted-foreground)" }}>
                Sin contraseña. Te enviamos un link directo.
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
                {loading ? "Verificando..." : "Enviarme el link"}
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>

            <div className="w-full h-px" style={{ background: "var(--border)" }} />

            <Link
              href="/join"
              className="text-[13px] text-center transition-colors duration-200"
              style={{ color: "var(--muted-foreground)" }}
            >
              ¿Tienes un código de invitación?{" "}
              <span style={{ color: "#8b5cf6" }}>Úsalo aquí →</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      // Redirect to the API route that sets the cookie
      router.replace(`/api/auth/verify?token=${encodeURIComponent(token)}`);
    }
  }, [token, router]);

  if (token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "var(--background)" }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#8b5cf6", borderTopColor: "transparent" }}
          />
          <p className="text-[15px]" style={{ color: "var(--muted-foreground)" }}>
            Verificando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-2xl font-medium tracking-tight"
            style={{ fontFamily: "var(--font-dm-sans)", color: "var(--foreground)" }}
          >
            <span style={{ color: "#8b5cf6" }}>Zae</span>lyn
          </span>
        </Link>

        <div className="flex flex-col gap-3">
          <h1
            className="text-2xl font-medium"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-dm-sans)" }}
          >
            Revisa tu correo.
          </h1>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Te enviamos un link de acceso. Tienes 15 minutos para usarlo.
          </p>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>
            Al hacer click en el link de tu correo, entrarás directo al portal.
          </p>
        </div>

        <Link
          href="/login"
          className="text-[13px] text-center"
          style={{ color: "var(--muted-foreground)" }}
        >
          ← Volver y reenviar
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}

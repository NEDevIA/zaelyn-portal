"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import ZaelynLogo from "@/components/ui/ZaelynLogo";
import { MagnifyingGlass, Check, X } from "@phosphor-icons/react";

interface WaitlistEntry {
  id: string;
  email: string;
  status: "waiting" | "approved" | "rejected";
  created_at: string;
  approved_at: string | null;
  source: string;
}

interface WaitlistResponse {
  data: WaitlistEntry[];
  total: number;
  page: number;
  pages: number;
}

interface Stats {
  total: number;
  waiting: number;
  approved: number;
  rejected: number;
}

const STATUS_BADGE: Record<string, { label: string; dot: string; color: string }> = {
  waiting:  { label: "Esperando", dot: "#f59e0b", color: "rgba(245,158,11,0.12)"  },
  approved: { label: "Aprobado",  dot: "#10b981", color: "rgba(16,185,129,0.12)" },
  rejected: { label: "Rechazado", dot: "#ef4444", color: "rgba(239,68,68,0.12)"  },
};

const FILTERS = [
  { value: "all",      label: "Todos"     },
  { value: "waiting",  label: "Esperando" },
  { value: "approved", label: "Aprobados" },
  { value: "rejected", label: "Rechazados"},
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

async function fetchWaitlist(params: {
  page: number;
  filter: string;
  search: string;
}): Promise<WaitlistResponse> {
  const qs = new URLSearchParams({ page: String(params.page), limit: "20" });
  if (params.filter !== "all") qs.set("status", params.filter);
  if (params.search)           qs.set("search", params.search);
  const res = await fetch(`/api/admin/waitlist?${qs}`);
  return res.json() as Promise<WaitlistResponse>;
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [rows,    setRows]    = useState<WaitlistEntry[]>([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);
  const [stats,   setStats]   = useState<Stats>({ total: 0, waiting: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    if (user && user.plan !== "enterprise") router.replace("/chat");
  }, [user, router]);

  const loadRows = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const json = await fetchWaitlist({ page: p, filter, search });
      setRows(json.data ?? []);
      setTotal(json.total ?? 0);
      setPages(json.pages ?? 1);
      setPage(json.page ?? 1);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  const loadStats = useCallback(async () => {
    const [all, waiting, approved, rejected] = await Promise.all([
      fetch("/api/admin/waitlist?limit=1").then(r => r.json()) as Promise<WaitlistResponse>,
      fetch("/api/admin/waitlist?limit=1&status=waiting").then(r => r.json()) as Promise<WaitlistResponse>,
      fetch("/api/admin/waitlist?limit=1&status=approved").then(r => r.json()) as Promise<WaitlistResponse>,
      fetch("/api/admin/waitlist?limit=1&status=rejected").then(r => r.json()) as Promise<WaitlistResponse>,
    ]);
    setStats({
      total:    all.total      ?? 0,
      waiting:  waiting.total  ?? 0,
      approved: approved.total ?? 0,
      rejected: rejected.total ?? 0,
    });
  }, []);

  useEffect(() => { void loadRows(1); }, [loadRows]);

  useEffect(() => { void loadStats(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function doAction(email: string, action: "approve" | "reject") {
    setActing(email);
    try {
      await fetch(`/api/admin/waitlist/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await Promise.all([loadRows(page), loadStats()]);
    } finally {
      setActing(null);
    }
  }

  if (user?.plan !== "enterprise") return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <ZaelynLogo href="/chat" size={17} />
        <span style={{ fontSize: 13, color: "var(--muted-foreground)", paddingLeft: 12, borderLeft: "1px solid var(--border)" }}>
          Admin · Lista de espera
        </span>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Total",      value: stats.total,    accent: "#818cf8" },
            { label: "Esperando",  value: stats.waiting,  accent: "#f59e0b" },
            { label: "Aprobados",  value: stats.approved, accent: "#10b981" },
            { label: "Rechazados", value: stats.rejected, accent: "#ef4444" },
          ].map(s => (
            <div key={s.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>
                {s.label}
              </p>
              <p style={{ fontSize: 26, fontWeight: 600, color: s.accent, margin: 0, fontFamily: "var(--font-dm-sans)" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <MagnifyingGlass
              size={14}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }}
            />
            <input
              placeholder="Buscar email..."
              value={search}
              onChange={e => { setSearch(e.target.value); }}
              style={{ width: "100%", height: 38, paddingLeft: 34, paddingRight: 12, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", gap: 4, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 4 }}>
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => { setFilter(f.value); setPage(1); }}
                style={{ padding: "5px 12px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, background: filter === f.value ? "#6366f1" : "transparent", color: filter === f.value ? "#fff" : "var(--muted-foreground)", transition: "all 0.15s" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {/* Head */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 120px 90px", padding: "10px 16px", background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
            {["Email", "Fecha de registro", "Estado", "Acciones"].map(h => (
              <span key={h} style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "48px 16px", textAlign: "center", color: "var(--muted-foreground)", fontSize: 14 }}>
              Cargando...
            </div>
          ) : rows.length === 0 ? (
            <div style={{ padding: "48px 16px", textAlign: "center", color: "var(--muted-foreground)", fontSize: 14 }}>
              Sin resultados.
            </div>
          ) : rows.map((row, i) => {
            const badge    = STATUS_BADGE[row.status] ?? STATUS_BADGE.waiting;
            const isActing = acting === row.email;

            return (
              <div
                key={row.id}
                style={{ display: "grid", gridTemplateColumns: "1fr 180px 120px 90px", padding: "12px 16px", alignItems: "center", borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <span style={{ fontSize: 13, color: "var(--foreground)", fontFamily: "var(--font-mono, monospace)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>
                  {row.email}
                </span>

                <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                  {formatDate(row.created_at)}
                </span>

                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: badge.color, color: "var(--foreground)", width: "fit-content" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot, flexShrink: 0 }} />
                  {badge.label}
                </span>

                <div style={{ display: "flex", gap: 6 }}>
                  {row.status === "waiting" && (
                    <>
                      <button
                        onClick={() => doAction(row.email, "approve")}
                        disabled={isActing}
                        title="Aprobar"
                        style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)", color: "#10b981", cursor: isActing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: isActing ? 0.5 : 1 }}
                      >
                        <Check size={13} weight="bold" />
                      </button>
                      <button
                        onClick={() => doAction(row.email, "reject")}
                        disabled={isActing}
                        title="Rechazar"
                        style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", cursor: isActing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: isActing ? 0.5 : 1 }}
                      >
                        <X size={13} weight="bold" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
              {total} registros · página {page} de {pages}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => loadRows(page - 1)}
                disabled={page <= 1}
                style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: 13, cursor: page <= 1 ? "not-allowed" : "pointer", opacity: page <= 1 ? 0.4 : 1 }}
              >
                ← Anterior
              </button>
              <button
                onClick={() => loadRows(page + 1)}
                disabled={page >= pages}
                style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: 13, cursor: page >= pages ? "not-allowed" : "pointer", opacity: page >= pages ? 0.4 : 1 }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

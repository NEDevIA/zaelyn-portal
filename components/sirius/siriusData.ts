// ── Types ─────────────────────────────────────────────────────────────────

export type ParaBucket = "projects" | "areas" | "resources" | "archive";
export type Evergreen  = "seedling" | "growing" | "mature";
export type NodeType   = "idea" | "note" | "person" | "resource" | "project" | "insight";
export type TabKey     = "constellation" | "para" | "buscar";

/**
 * Real API response from GET /nodes (listNodes SELECT)
 * Fields: id, title, summary, node_type, para_bucket, tags, source,
 *         created_at, updated_at, last_reviewed
 *
 * Fields NOT in API (were mock-only): zettel_id, evergreen, connections,
 *         has_embedding, backlinks_count
 */
export interface SiriusNode {
  id:            string;
  title:         string;
  summary:       string | null;
  node_type:     NodeType;
  para_bucket:   ParaBucket;
  tags:          string[];
  source:        string | null;
  created_at:    string;
  updated_at:    string;
  last_reviewed: string | null;
  // Present only on GET /nodes/:id (select *)
  content?:      string | null;
  reflection?:   string | null;
}

/** Raw link record returned by getNodeLinks / getNode */
export interface RawLink {
  id:           string;
  from_node_id: string;
  to_node_id:   string;
  link_type:    string;
  strength:     number;
  auto_created: boolean;
  confirmed_at: string | null;
  from_node:    { id: string; title: string; node_type: string; summary: string | null } | null;
  to_node:      { id: string; title: string; node_type: string; summary: string | null } | null;
}

/** Node returned by GET /nodes/:id — includes links array */
export interface DetailNode extends SiriusNode {
  links: RawLink[];
}

/** Derived from links for the constellation canvas */
export interface SiriusLink {
  source: string;
  target: string;
}

// ── Colours ───────────────────────────────────────────────────────────────

export const PARA_COLORS: Record<ParaBucket, string> = {
  projects:  "#818CF8",
  areas:     "#34D399",
  resources: "#60A5FA",
  archive:   "#6B7280",
};

export const PARA_COLORS_LIGHT: Record<ParaBucket, string> = {
  projects:  "#6366f1",
  areas:     "#059669",
  resources: "#2563eb",
  archive:   "#4b5563",
};

export const PARA_LABELS: Record<ParaBucket, string> = {
  projects:  "Projects",
  areas:     "Areas",
  resources: "Resources",
  archive:   "Archive",
};

export const PARA_ICONS: Record<ParaBucket, string> = {
  projects:  "◆",
  areas:     "◉",
  resources: "◫",
  archive:   "○",
};

// ── Node metadata ─────────────────────────────────────────────────────────

export const NODE_ICONS: Record<NodeType, string> = {
  idea:     "✦",
  note:     "◌",
  person:   "◉",
  resource: "◫",
  project:  "◆",
  insight:  "★",
};

export const NODE_META: Record<NodeType, { bg: string; color: string; label: string }> = {
  idea:     { bg: "rgba(240,192,96,.12)",  color: "#F0C060", label: "Idea"     },
  note:     { bg: "rgba(148,163,184,.12)", color: "#94A3B8", label: "Nota"     },
  person:   { bg: "rgba(192,132,252,.12)", color: "#C084FC", label: "Persona"  },
  resource: { bg: "rgba(96,165,250,.12)",  color: "#60A5FA", label: "Recurso"  },
  project:  { bg: "rgba(129,140,248,.12)", color: "#818CF8", label: "Proyecto" },
  insight:  { bg: "rgba(52,211,153,.12)",  color: "#34D399", label: "Insight"  },
};

// ── Helpers ───────────────────────────────────────────────────────────────

/** Derive SiriusLinks for the constellation from a node's links array */
export function deriveLinks(nodes: SiriusNode[], allLinks: RawLink[]): SiriusLink[] {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const seen    = new Set<string>();
  const result: SiriusLink[] = [];

  for (const l of allLinks) {
    if (!nodeIds.has(l.from_node_id) || !nodeIds.has(l.to_node_id)) continue;
    const key = [l.from_node_id, l.to_node_id].sort().join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ source: l.from_node_id, target: l.to_node_id });
  }
  return result;
}

/** Format ISO date to short display string */
export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

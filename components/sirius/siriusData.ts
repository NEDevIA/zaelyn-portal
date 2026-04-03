// ── Types ─────────────────────────────────────────────────────────────────

export type ParaBucket = "projects" | "areas" | "resources" | "archive";
export type Evergreen  = "seedling" | "growing" | "mature";
export type NodeType   = "idea" | "note" | "person" | "resource" | "project" | "insight";
export type TabKey     = "constellation" | "para" | "buscar";

export interface SiriusNode {
  id:              string;
  zettel_id:       string;
  title:           string;
  node_type:       NodeType;
  para_bucket:     ParaBucket;
  evergreen:       Evergreen;
  backlinks_count: number;
  connections:     number;
  tags:            string[];
  summary:         string;
  content?:        string;
  reflection?:     string | null;
  has_embedding:   boolean;
}

export interface SiriusLink {
  source: string;
  target: string;
}

export interface DetailNode extends SiriusNode {
  connected:  SiriusNode[];
  backlinks:  SiriusNode[];
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

export const EV_ICONS: Record<Evergreen, string> = {
  seedling: "🌱",
  growing:  "🌿",
  mature:   "🌳",
};

export const EV_LABELS: Record<Evergreen, string> = {
  seedling: "Semilla",
  growing:  "Creciendo",
  mature:   "Madura",
};

// ── Mock data (fallback / dev) ─────────────────────────────────────────────

export const MOCK_NODES: SiriusNode[] = [
  { id: "1", zettel_id: "Z001", title: "Zaelyn.AI", node_type: "project", para_bucket: "projects",
    evergreen: "mature", backlinks_count: 4, connections: 4, tags: ["saas","ai","telegram","beta"],
    summary: "Primer producto de NE DevIA — AI bot multi-módulo con Telegram y portal web.",
    content: "Bot de productividad IA desplegado en Fly.io con Supabase. Módulos: Aura (journal), Orion (tareas), Sirius (memoria), Polaris (metas).",
    reflection: null, has_embedding: true },
  { id: "2", zettel_id: "Z002", title: "Arquitectura BotIOS", node_type: "note", para_bucket: "projects",
    evergreen: "growing", backlinks_count: 2, connections: 3, tags: ["backend","node.js","fly.io"],
    summary: "Hub central del ecosistema. Patrón hub-and-spokes con AXON como registry de módulos.",
    content: "17+ módulos nombrados con sistema de constelaciones. Stack: Node.js + Fly.io + Supabase + BullMQ + node-cron.",
    reflection: null, has_embedding: true },
  { id: "3", zettel_id: "Z003", title: "Modelo de Datos ZAE", node_type: "note", para_bucket: "resources",
    evergreen: "growing", backlinks_count: 2, connections: 3, tags: ["supabase","postgres","schema"],
    summary: "Un Supabase compartido con schemas separados por módulo. RLS por user_id.",
    reflection: null, has_embedding: true },
  { id: "4", zettel_id: "Z004", title: "SAP FI/CO Expertise", node_type: "resource", para_bucket: "resources",
    evergreen: "mature", backlinks_count: 3, connections: 2, tags: ["sap","fi-co","erp"],
    summary: "20+ años de consultoría SAP FI/CO. Base técnica que informa toda la arquitectura de Zaera.",
    reflection: "Esta expertise es el foso competitivo real del ecosistema.", has_embedding: true },
  { id: "5", zettel_id: "Z005", title: "Mercado Hispano", node_type: "idea", para_bucket: "areas",
    evergreen: "mature", backlinks_count: 2, connections: 2, tags: ["mercado","estrategia","latam"],
    summary: "Segmento objetivo primario. PYMEs hispanohablantes no atendidas por tools en inglés.",
    reflection: null, has_embedding: true },
];

export const MOCK_LINKS: SiriusLink[] = [
  { source: "1", target: "2" },
  { source: "1", target: "3" },
  { source: "2", target: "3" },
  { source: "3", target: "4" },
  { source: "4", target: "5" },
  { source: "1", target: "5" },
];

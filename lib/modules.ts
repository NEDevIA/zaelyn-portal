export type ModuleId = "mira" | "sirius" | "orion" | "polaris" | "pulsar" | "pleyades";

export interface ModuleDef {
  id: ModuleId;
  name: string;
  fullName: string;
  description: string;
  color: string;
  bg: string;
  route: string;
  phase: 1 | 2;
  disabled?: boolean;
  features: string[];
}

export const MODULES: ModuleDef[] = [
  {
    id: "mira",
    name: "Mira",
    fullName: "Zaelyn Mira",
    description: "Tu diario inteligente. Registra, reflexiona y conecta tu historia.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    route: "/mira",
    phase: 1,
    features: ["Diario con voz o texto", "Mood tracking", "Timeline de vida", "Zaelyn Wrapped"],
  },
  {
    id: "sirius",
    name: "Sirius",
    fullName: "Zaelyn Sirius",
    description: "Tu red de conocimiento personal. Ideas, personas y conexiones.",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    route: "/sirius",
    phase: 1,
    features: ["Grafo de conocimiento", "People Graph", "Busqueda semantica", "Conexiones automaticas"],
  },
  {
    id: "orion",
    name: "Orion",
    fullName: "Zaelyn Orion",
    description: "Tu sistema de compromisos. Tareas, habitos y recordatorios.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    route: "/orion",
    phase: 1,
    features: ["Captura rapida", "Compromisos con contexto", "Habitos continuos", "Integracion calendario"],
  },
  {
    id: "polaris",
    name: "Polaris",
    fullName: "Zaelyn Polaris",
    description: "Tu sistema de metas. Desde el objetivo hasta el habito diario.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    route: "/polaris",
    phase: 1,
    features: ["Metas con fecha", "Salud de objetivo", "Momentum semanal", "Obituario futuro"],
  },
  {
    id: "pulsar",
    name: "Pulsar",
    fullName: "Zaelyn Pulsar",
    description: "Tus momentos y medios. Fotos, videos y recuerdos con contexto.",
    color: "#e879f9",
    bg: "rgba(232,121,249,0.08)",
    route: "/pulsar",
    phase: 1,
    features: ["Momentos con IA", "Galeria inteligente", "Contexto automatico", "Historias"],
  },
  {
    id: "pleyades",
    name: "Pleyades",
    fullName: "Zaelyn Pleyades",
    description: "Tu espacio colaborativo. Proyectos compartidos con contexto privado.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    route: "/pleyades",
    phase: 1,
    features: ["Proyectos privados", "Contexto compartido", "Roles y permisos", "Historial de equipo"],
  },
];

export const MODULE_COLORS: Record<ModuleId, string> = {
  mira:     "#8b5cf6",
  sirius:   "#7c3aed",
  orion:    "#3b82f6",
  polaris:  "#10b981",
  pulsar:   "#e879f9",
  pleyades: "#f59e0b",
};

export type ModuleId = "mira" | "sirius" | "orion" | "polaris" | "pulsar" | "pleyades" | "nova" | "atlas";

export interface ModuleDef {
  id: ModuleId;
  name: string;
  fullName: string;
  category: string;
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
    fullName: "ZaelynMira",
    category: "MEMORIA",
    description: "Tu diario personal enriquecido por IA. Captura multi-canal, mood automático, mapa de personas, y el Libro del Año anual.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    route: "/mira",
    phase: 1,
    features: [
      "Captura desde Telegram, voz, foto, PDF",
      "Mood e insights extraídos automáticamente",
      "Mira Wrapped anual — tu año en estadísticas",
      "Compartir momentos selectivos con privacidad",
    ],
  },
  {
    id: "sirius",
    name: "Sirius",
    fullName: "ZaelynSirius",
    category: "MEMORIA",
    description: "Tu grafo de conocimiento personal. Ideas, decisiones, recursos — y un People Graph con todas las personas que importan.",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    route: "/sirius",
    phase: 1,
    features: [
      "Grafo semántico con búsqueda vectorial",
      "People Graph: personas + organizaciones + contexto",
      "'Preguntar al grafo' — IA responde solo con TU conocimiento",
      "Captura automática de entidades en conversaciones",
    ],
  },
  {
    id: "orion",
    name: "Orion",
    fullName: "ZaelynOrion",
    category: "ACCIÓN",
    description: "Tareas, compromisos y hábitos. Distingue entre lo que debes hacer tú y lo que le prometiste a alguien más.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    route: "/orion",
    phase: 1,
    features: [
      "Recordatorios vs Compromisos — lógicas distintas",
      "Detección de procrastinación inteligente",
      "Hábitos con racha y tolerancia de fallo",
      "Google Calendar sync · Contextos GTD",
    ],
  },
  {
    id: "polaris",
    name: "Polaris",
    fullName: "ZaelynPolaris",
    category: "ACCIÓN",
    description: "Tus metas como organismos vivos. Con salud, momentum y el Por Qué como código genético de cada objetivo.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    route: "/polaris",
    phase: 1,
    features: [
      "Metas que se marchitan si las abandonas",
      "Detección inversa de metas implícitas",
      "El Obituario — ritual de cierre de metas completadas",
      "Goals Wrapped anual + meta sugerida del año",
    ],
  },
  {
    id: "pulsar",
    name: "Pulsar",
    fullName: "ZaelynPulsar",
    category: "SOCIAL",
    description: "La red social de Zaelyn. Lo que decides compartir de tu vida — con quién tú eliges y cuando tú quieras.",
    color: "#e879f9",
    bg: "rgba(232,121,249,0.08)",
    route: "/pulsar",
    phase: 1,
    features: [
      "Feed social dentro del ecosistema Zaelyn",
      "Compartir desde cualquier módulo a Pulsar",
      "Álbumes colectivos con espacios privados",
      "Push a Instagram, Facebook, X (Fase II)",
    ],
  },
  {
    id: "pleyades",
    name: "Pléyades",
    fullName: "ZaelynPléyades",
    category: "FAMILIA",
    description: "Espacios familiares y grupos privados. Álbumes colectivos, recordatorios compartidos y memoria de grupo.",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.08)",
    route: "/pleyades",
    phase: 1,
    features: [
      "Espacios privados: familia, pareja, equipo",
      "Álbumes y momentos colectivos",
      "Tareas asignadas dentro del grupo",
      "Memoria compartida sin perder privacidad individual",
    ],
  },
  {
    id: "nova",
    name: "Nova",
    fullName: "ZaelynNova",
    category: "DINERO",
    description: "Tu inteligencia financiera personal. Gastos, patrones de consumo y proyecciones sin compartir tus datos con bancos.",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    route: "/nova",
    phase: 2,
    disabled: true,
    features: [
      "Captura de gastos por conversación",
      "Patrones y alertas inteligentes",
      "Proyecciones sin acceso a tu banco",
      "Meta de ahorro conectada a Polaris",
    ],
  },
  {
    id: "atlas",
    name: "Atlas",
    fullName: "ZaelynAtlas",
    category: "NEGOCIO",
    description: "Tu CRM personal e inteligente. Clientes, proyectos y seguimientos — sin hojas de cálculo interminables.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    route: "/atlas",
    phase: 2,
    disabled: true,
    features: [
      "CRM conversacional sin formularios",
      "Seguimiento automático de deals",
      "Contexto de cada cliente desde Sirius",
      "Integraciones con email y calendario",
    ],
  },
];

export const MODULE_COLORS: Record<ModuleId, string> = {
  mira:     "#8b5cf6",
  sirius:   "#7c3aed",
  orion:    "#3b82f6",
  polaris:  "#10b981",
  pulsar:   "#e879f9",
  pleyades: "#f472b6",
  nova:     "#22c55e",
  atlas:    "#ef4444",
};

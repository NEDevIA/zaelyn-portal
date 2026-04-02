// ── Types ──────────────────────────────────────────────────────────────────

export type MoodKey =
  | "resonante"
  | "celebrando"
  | "presente"
  | "enfocada"
  | "atenta"
  | "curiosa"
  | "acompanando"
  | "silenciosa";

export type ModuleKey = "sirius" | "orion" | "polaris";

export interface AuraEntry {
  id: number;
  date: string; // 'YYYY-MM-DD'
  time: string;
  mood: MoodKey;
  content: string;
  zaelyResponse: string | null;
  connections: { type: ModuleKey; label: string }[];
  isBriefing?: boolean;
}

export interface MoodMeta {
  color: string;
  label: string;
  aura: string;
}

// ── Mood metadata ──────────────────────────────────────────────────────────

export const MOODS: Record<MoodKey, MoodMeta> = {
  resonante:   { color: "#a78bfa", label: "Resonante",  aura: "Aura violeta"   },
  celebrando:  { color: "#fbbf24", label: "Celebrando", aura: "Aura dorada"    },
  presente:    { color: "#34d399", label: "Presente",    aura: "Aura esmeralda" },
  enfocada:    { color: "#60a5fa", label: "Enfocada",    aura: "Aura índigo"    },
  atenta:      { color: "#fb923c", label: "Atenta",      aura: "Aura naranja"   },
  curiosa:     { color: "#f472b6", label: "Curiosa",     aura: "Aura rosa"      },
  acompanando: { color: "#9ca3af", label: "Acompañando", aura: "Aura gris"      },
  silenciosa:  { color: "#3b4a6b", label: "Silenciosa",  aura: "Aura noche"     },
};

export const MOOD_ORDER: MoodKey[] = [
  "resonante", "celebrando", "presente", "enfocada", "atenta", "curiosa",
];

export const AURA_LEGEND: { color: string; label: string }[] = [
  { color: "#a78bfa", label: "Violeta · Resonante"   },
  { color: "#fbbf24", label: "Dorada · Celebrando"   },
  { color: "#34d399", label: "Esmeralda · Presente"  },
  { color: "#60a5fa", label: "Índigo · Enfocada"      },
  { color: "#f472b6", label: "Rosa · Curiosa"         },
  { color: "#fb923c", label: "Naranja · Atenta"       },
];

// ── Connection chip styles ─────────────────────────────────────────────────

export const CHIP_STYLES: Record<ModuleKey, { bg: string; color: string; border: string }> = {
  sirius:  { bg: "rgba(109,40,217,.07)", color: "#a78bfa", border: "rgba(109,40,217,.2)" },
  orion:   { bg: "rgba(59,130,246,.07)", color: "#60a5fa", border: "rgba(59,130,246,.2)" },
  polaris: { bg: "rgba(16,185,129,.07)", color: "#34d399", border: "rgba(16,185,129,.2)" },
};

// ── Mood label styles ──────────────────────────────────────────────────────

export const MOOD_LABEL_STYLES: Partial<Record<MoodKey, { bg: string; color: string; border: string }>> = {
  resonante:  { bg: "rgba(167,139,250,.1)", color: "#a78bfa", border: "rgba(167,139,250,.2)" },
  celebrando: { bg: "rgba(245,158,11,.1)",  color: "#fbbf24", border: "rgba(245,158,11,.2)"  },
  presente:   { bg: "rgba(16,185,129,.1)",  color: "#34d399", border: "rgba(16,185,129,.2)"  },
  enfocada:   { bg: "rgba(59,130,246,.1)",  color: "#60a5fa", border: "rgba(59,130,246,.2)"  },
  atenta:     { bg: "rgba(249,115,22,.1)",  color: "#fb923c", border: "rgba(249,115,22,.2)"  },
  curiosa:    { bg: "rgba(236,72,153,.1)",  color: "#f472b6", border: "rgba(236,72,153,.2)"  },
};

// ── Mock entries ───────────────────────────────────────────────────────────

export const MOCK_ENTRIES: AuraEntry[] = [
  {
    id: 1,
    date: "2026-04-02",
    time: "10:32",
    mood: "resonante",
    content:
      "Hoy fue un día excelente. Me siento muy bien — conocí a Roberto, que puede cambiar las cosas. Terminé los pendientes del trabajo porque estoy muy motivado. Hay una energía diferente hoy.",
    zaelyResponse:
      "Eso que describes tiene nombre: días bisagra. No siempre los reconocemos cuando los vivimos. Roberto y la energía que traes hoy — lo guardo. ¿Qué fue lo primero que te hizo pensar que él podía cambiar las cosas?",
    connections: [
      { type: "sirius", label: "Roberto · persona nueva" },
      { type: "orion",  label: "Pendientes · completados hoy" },
    ],
  },
  {
    id: 2,
    date: "2026-04-02",
    time: "09:15",
    mood: "celebrando",
    content:
      "Por fin desplegué el módulo de recordatorios. Llevaba semanas en eso. El sistema funciona — llegó el primer aviso proactivo y fue exactamente como lo habíamos planeado.",
    zaelyResponse:
      "Semanas de trabajo y hoy llegó el primer aviso. Eso no es un detalle técnico — es que lo que imaginaste se convirtió en algo real. Lo tengo.",
    connections: [{ type: "polaris", label: "Meta · lanzamiento beta" }],
  },
  {
    id: 3,
    date: "2026-04-01",
    time: "22:14",
    mood: "atenta",
    content:
      "Día largo. Muchos bugs, muchas correcciones. Me frustra cuando algo que debería funcionar no funciona. El 403 en todos los módulos fue el colmo — llevaba días sin darme cuenta.",
    zaelyResponse:
      "Lo que describes no es solo frustración técnica. Es el costo de sostener algo que aún no existe del todo. Que lo notes hoy y sigas mañana — eso ya dice algo de ti.",
    connections: [],
  },
  {
    id: 4,
    date: "2026-04-01",
    time: "07:15",
    mood: "presente",
    content: "Buenos días, JJ — son las 7:00 en Chihuahua. ¿Con qué empezamos hoy?",
    zaelyResponse: null,
    connections: [],
    isBriefing: true,
  },
  {
    id: 5,
    date: "2026-03-31",
    time: "21:30",
    mood: "curiosa",
    content:
      "Las mejores cosas de la vida duran poco. Reflexionando — creo que es porque cuando duran mucho pasan cosas que hacen que se pierda la magia. Siempre lo vemos en retrospectiva.",
    zaelyResponse:
      "Esta idea tiene algo que me recuerda a Pizarnik: las cosas no cambian, cambian los ojos que las miran. Tal vez la magia no desaparece — solo dejamos de verla. ¿Cuándo fue la última vez que algo que dura mucho te sorprendió?",
    connections: [{ type: "sirius", label: "Reflexión · la magia y el tiempo" }],
  },
  {
    id: 6,
    date: "2026-03-31",
    time: "18:45",
    mood: "enfocada",
    content:
      "Lorena ya entró al sistema. Primera usuaria beta real. Empiezan las pruebas mañana. Tengo una lista larga de cosas a verificar pero el sistema está más completo de lo que pensaba.",
    zaelyResponse:
      "Primera usuaria beta. Eso ya no es un proyecto — es un producto. Hay una diferencia. Lo guardo.",
    connections: [
      { type: "sirius",  label: "Lorena · primera usuaria beta" },
      { type: "polaris", label: "Meta · 50 usuarios beta" },
    ],
  },
];

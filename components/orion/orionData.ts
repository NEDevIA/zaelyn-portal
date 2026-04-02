// ── Types ──────────────────────────────────────────────────────────────────

export type DueType  = "overdue" | "today" | "future" | "done";
export type TabKey   = "tareas"  | "compromisos" | "habitos";
export type ViewKey  = "today"   | "overdue" | "commitments" | "upcoming" | "done" | "all";
export type Direction = "owe" | "they";

export interface OrionTask {
  id: number;
  title: string;
  due: string;
  dueType: DueType;
  urgent?: boolean;
  done?: boolean; // initially done (briefing/pre-done tasks)
}

export interface OrionCommitment {
  id: number;
  title: string;
  due: string;
  direction: Direction;
  contact: string;
  snoozes: number;
}

export interface OrionHabit {
  id: number;
  name: string;
  streak: number;
  week: (boolean | null)[]; // 7 days Mon–Sun; null = future
}

// ── Colours ───────────────────────────────────────────────────────────────

export const ORION_BLUE   = "#3b82f6";
export const ORION_BLUE2  = "#60a5fa";
export const ORION_GREEN  = "#10b981";
export const ORION_AMBER  = "#f59e0b";
export const ORION_RED    = "#ef4444";
export const ORION_PURPLE = "#8b5cf6";

export function dueColor(dueType: DueType): string {
  if (dueType === "overdue") return ORION_RED;
  if (dueType === "today")   return ORION_AMBER;
  if (dueType === "done")    return ORION_GREEN;
  return ORION_BLUE;
}

export function dueIcon(dueType: DueType): string {
  if (dueType === "overdue") return "⚠ ";
  if (dueType === "today")   return "⏰ ";
  if (dueType === "done")    return "✓ ";
  return "→ ";
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const MOCK_TASKS: OrionTask[] = [
  { id: 1,  title: "Llamar al banco",                              due: "Hoy 10:00am",       dueType: "overdue", urgent: true  },
  { id: 2,  title: "Revisar contrato de servicios con el despacho", due: "Hoy 14:00",         dueType: "today"                 },
  { id: 3,  title: "Enviar propuesta a cliente nuevo",              due: "Hoy 17:00",         dueType: "today",  urgent: true  },
  { id: 4,  title: "Tomar medicamento de Nicolás",                  due: "Hoy 18:00",         dueType: "today"                 },
  { id: 5,  title: "Pagar la renta",                                due: "Ayer",              dueType: "overdue"               },
  { id: 6,  title: "Responder correos del trabajo",                  due: "Mañana",            dueType: "future"                },
  { id: 7,  title: "Preparar presentación del trimestre",            due: "Vie 7 abr",         dueType: "future"                },
  { id: 8,  title: "Comprar regalo de cumpleaños",                   due: "Sáb 8 abr",         dueType: "future"                },
  { id: 9,  title: "Llamar al dentista para cita",                   due: "Completada 9:15am", dueType: "done",   done: true    },
  { id: 10, title: "Revisar el sistema de recordatorios",            due: "Completada ayer",   dueType: "done",   done: true    },
];

export const MOCK_COMMITMENTS: OrionCommitment[] = [
  { id: 1, title: "Entregar propuesta a Lorena",         due: "Vie 5 abr",  direction: "owe",  contact: "Lorena",  snoozes: 0 },
  { id: 2, title: "Lorena te envía el contrato revisado", due: "Lun 7 abr",  direction: "they", contact: "Lorena",  snoozes: 0 },
  { id: 3, title: "Llamada de seguimiento con Roberto",   due: "Jue 10 abr", direction: "owe",  contact: "Roberto", snoozes: 1 },
];

export const MOCK_HABITS: OrionHabit[] = [
  { id: 1, name: "Ejercicio mañana", streak: 4, week: [true,  true,  false, true,  false, null, null] },
  { id: 2, name: "Beber 2L de agua", streak: 7, week: [true,  true,  true,  true,  true,  null, null] },
  { id: 3, name: "Leer 20 minutos",  streak: 2, week: [false, true,  true,  false, false, null, null] },
];

export const WEEK_DAYS_SHORT = ["L", "M", "X", "J", "V", "S", "D"];
export const WEEK_DAYS_FULL  = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

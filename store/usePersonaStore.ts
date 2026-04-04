"use client";
import { create } from "zustand";

interface PersonaState {
  personaId: string;
  briefingEnabled: boolean;
  briefingTime: string;
  tone: string;
  isLoaded: boolean;
  setPersona: (p: Partial<Omit<PersonaState, "setPersona" | "loadPersona" | "isLoaded">>) => void;
  loadPersona: () => Promise<void>;
}

export const usePersonaStore = create<PersonaState>((set) => ({
  personaId: "calida",
  briefingEnabled: false,
  briefingTime: "07:00",
  tone: "friendly",
  isLoaded: false,

  setPersona: (p) => set((s) => ({ ...s, ...p })),

  loadPersona: async () => {
    try {
      const res = await fetch("/api/portal/persona", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json() as { persona?: Record<string, unknown> };
      const persona = data.persona;
      if (!persona) return;
      set({
        personaId: (persona["personaId"] as string | undefined) ?? "calida",
        briefingEnabled: (persona["briefingEnabled"] as boolean | undefined) ?? false,
        briefingTime: (persona["briefingTime"] as string | undefined) ?? "07:00",
        tone: (persona["tone"] as string | undefined) ?? "friendly",
        isLoaded: true,
      });
    } catch {
      // Backend unavailable — keep defaults
    }
  },
}));

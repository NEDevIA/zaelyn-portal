import { create } from "zustand";

export interface RightCard {
  id: string;
  turnId: string;
  module: string;
  color: string;
  label: string;
  lines: string[];
}

interface RightPanelStore {
  cards: RightCard[];
  addCard: (card: RightCard) => void;
  clearCards: () => void;
}

export const useRightPanelStore = create<RightPanelStore>((set) => ({
  cards: [],
  addCard: (card) => set((s) => ({ cards: [...s.cards, card] })),
  clearCards: () => set({ cards: [] }),
}));

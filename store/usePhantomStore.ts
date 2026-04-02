import { create } from "zustand";
import { useChatStore } from "./useChatStore";

type SubMode = "pure" | "selective" | "encrypted";

interface PhantomStore {
  isPhantom: boolean;
  anonToken: string | null;
  subMode: SubMode | null;
  expiresAt: string | null;
  activate: (token: string, subMode: SubMode, expiresAt: string) => void;
  deactivate: () => void;
}

export const usePhantomStore = create<PhantomStore>((set) => ({
  isPhantom: false,
  anonToken: null,
  subMode: null,
  expiresAt: null,
  activate: (token, subMode, expiresAt) => {
    useChatStore.getState().setPrivacyMode("phantom"); // wipes history
    set({ isPhantom: true, anonToken: token, subMode, expiresAt });
  },
  deactivate: () => {
    useChatStore.getState().setPrivacyMode("sovereign"); // wipes phantom history
    set({ isPhantom: false, anonToken: null, subMode: null, expiresAt: null });
  },
}));

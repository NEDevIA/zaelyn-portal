import { create } from "zustand";

export interface ZaelynUser {
  id: string;
  email: string;
  name?: string;
  plan: "beta" | "free" | "pro" | "enterprise";
  persona?: string;
  privacyMode?: "comfort" | "sovereign" | "phantom" | "full_sovereign";
  telegramId?: number | null;
  telegramUsername?: string | null;
}

interface AuthStore {
  user: ZaelynUser | null;
  isLoading: boolean;
  isHydrated: boolean;
  setUser: (user: ZaelynUser) => void;
  clearUser: () => void;
  setLoading: (v: boolean) => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isHydrated: false,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (v) => set({ isLoading: v }),
  setHydrated: () => set({ isHydrated: true }),
}));

import { create } from "zustand";
import type { Lang } from "@/lib/i18n";

interface LanguageStore {
  lang: Lang;
  setLang: (l: Lang) => void;
}

function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "es";
  const bl = navigator.language.split("-")[0];
  if (bl === "en") return "en";
  if (bl === "pt") return "pt";
  return "es";
}

function getInitialLang(): Lang {
  if (typeof localStorage === "undefined") return detectBrowserLang();
  const stored = localStorage.getItem("zaelyn-lang") as Lang | null;
  if (stored && ["es", "en", "pt"].includes(stored)) return stored;
  return detectBrowserLang();
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  lang: "es", // SSR default; hydrated on client

  setLang: (l) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("zaelyn-lang", l);
    }
    set({ lang: l });
  },
}));

// Hydrate from localStorage/browser on client mount
if (typeof window !== "undefined") {
  useLanguageStore.setState({ lang: getInitialLang() });
}

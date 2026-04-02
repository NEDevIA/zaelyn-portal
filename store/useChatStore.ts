import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export interface ModuleChipData {
  module: string;
  color: string;
  label: string;
  detail: string;
  cardId: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  chips?: ModuleChipData[];
  isStreaming?: boolean;
}

type PrivacyMode = "comfort" | "sovereign" | "phantom" | "full_sovereign";

interface ChatStore {
  messages: ChatMessage[];
  conversationId: string | null;
  isStreaming: boolean;
  privacyMode: PrivacyMode;
  addUserMessage: (content: string) => string;
  startAIMessage: () => string;
  appendChunk: (id: string, chunk: string) => void;
  finishAIMessage: (id: string) => void;
  addChip: (id: string, chip: ModuleChipData) => void;
  newConversation: () => void;
  setConversationId: (id: string) => void;
  setPrivacyMode: (mode: PrivacyMode) => void;
  clearHistory: () => void;
  replaceLastAIMessage: (text: string) => void;
}

// Storage that switches between localStorage (comfort) and sessionStorage (sovereign).
// Phantom mode never writes — handled via partialize returning {}.
const adaptiveStorage = createJSONStorage(() => {
  if (typeof window === "undefined") return localStorage;
  // Read current mode from the store key to decide storage type.
  // Default to sessionStorage (safer) if mode is unknown.
  try {
    const raw = localStorage.getItem("zaelyn-chat");
    const parsed = raw ? (JSON.parse(raw) as { state?: { privacyMode?: string } }) : null;
    if (parsed?.state?.privacyMode === "comfort") return localStorage;
  } catch { /* ignore */ }
  return sessionStorage;
});

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      conversationId: null,
      isStreaming: false,
      privacyMode: "sovereign",

      addUserMessage: (content) => {
        const id = uuid();
        set((s) => ({ messages: [...s.messages, { id, role: "user", content }] }));
        return id;
      },

      startAIMessage: () => {
        const id = uuid();
        set((s) => ({
          messages: [...s.messages, { id, role: "ai", content: "", isStreaming: true }],
          isStreaming: true,
        }));
        return id;
      },

      appendChunk: (id, chunk) => {
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, content: m.content + chunk } : m
          ),
        }));
      },

      finishAIMessage: (id) => {
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, isStreaming: false } : m
          ),
          isStreaming: false,
        }));
      },

      addChip: (id, chip) => {
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, chips: [...(m.chips ?? []), chip] } : m
          ),
        }));
      },

      newConversation: () => {
        set({ messages: [], conversationId: uuid(), isStreaming: false });
      },

      setConversationId: (id) => set({ conversationId: id }),

      replaceLastAIMessage: (text) => {
        set((s) => {
          const idx = [...s.messages].reverse().findIndex((m) => m.role === "ai");
          if (idx === -1) return s;
          const realIdx = s.messages.length - 1 - idx;
          const updated = s.messages.map((m, i) =>
            i === realIdx ? { ...m, content: text, isStreaming: false } : m
          );
          return { messages: updated };
        });
      },

      setPrivacyMode: (mode) => {
        const prev = get().privacyMode;
        set({ privacyMode: mode });

        // Entering or leaving phantom → wipe history immediately
        if (mode === "phantom" || prev === "phantom") {
          set({ messages: [], conversationId: uuid(), isStreaming: false });
          // Remove any persisted data from both storages
          try { localStorage.removeItem("zaelyn-chat"); } catch { /* ignore */ }
          try { sessionStorage.removeItem("zaelyn-chat"); } catch { /* ignore */ }
        }
      },

      clearHistory: () => {
        set({ messages: [], conversationId: uuid(), isStreaming: false });
        try { localStorage.removeItem("zaelyn-chat"); } catch { /* ignore */ }
        try { sessionStorage.removeItem("zaelyn-chat"); } catch { /* ignore */ }
      },
    }),
    {
      name: "zaelyn-chat",
      storage: adaptiveStorage,
      // Phantom: persist nothing. All other modes: persist messages + conversationId.
      partialize: (s) =>
        s.privacyMode === "phantom"
          ? ({ privacyMode: s.privacyMode } as Partial<ChatStore>)
          : { messages: s.messages, conversationId: s.conversationId, privacyMode: s.privacyMode },
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface ChatStore {
  messages: ChatMessage[];
  conversationId: string | null;
  isStreaming: boolean;
  addUserMessage: (content: string) => string;
  startAIMessage: () => string;
  appendChunk: (id: string, chunk: string) => void;
  finishAIMessage: (id: string) => void;
  addChip: (id: string, chip: ModuleChipData) => void;
  newConversation: () => void;
  setConversationId: (id: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      conversationId: null,
      isStreaming: false,

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
    }),
    {
      name: "zaelyn-chat",
      partialize: (s) => ({ messages: s.messages, conversationId: s.conversationId }),
    }
  )
);

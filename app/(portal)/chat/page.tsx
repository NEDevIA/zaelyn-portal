"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatThread from "@/components/chat/ChatThread";
import Composer from "@/components/chat/Composer";
import WelcomeMessage from "@/components/chat/WelcomeMessage";
import DailyGreeting from "@/components/chat/DailyGreeting";
import TelegramBanner from "@/components/chat/TelegramBanner";
import { useChatStore } from "@/store/useChatStore";
import { usePhantomStore } from "@/store/usePhantomStore";
import { useRightPanelStore } from "@/store/useRightPanelStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ZaelynWS } from "@/lib/websocket";
import { getWsToken } from "@/lib/api";
import type { WSServerMessage } from "@/lib/websocket";

const MODULE_META: Record<string, { label: string; color: string }> = {
  mira:    { label: "Tu diario",  color: "#8b5cf6" },
  sirius:  { label: "Tu memoria", color: "#7c3aed" },
  orion:   { label: "Tus tareas", color: "#3b82f6" },
  polaris: { label: "Tus metas",  color: "#10b981" },
  pulsar:  { label: "Tu red",     color: "#e879f9" },
  pleyades:{ label: "Tu familia", color: "#f472b6" },
};

interface FirstMessageData {
  isFirstToday: boolean;
  isFirstEver?: boolean;
  hasUrgent?: boolean;
  persona?: string;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const urlConvId = searchParams.get("id");

  const {
    addUserMessage,
    startAIMessage,
    appendChunk,
    finishAIMessage,
    addChip,
    replaceLastAIMessage,
    isStreaming,
    isLoadingHistory,
    conversationId,
    newConversation,
    loadConversation,
  } = useChatStore();
  const { isPhantom, anonToken, subMode } = usePhantomStore();
  const { addCard } = useRightPanelStore();
  const { lang } = useLanguageStore();
  const { user } = useAuthStore();

  const wsRef = useRef<ZaelynWS | null>(null);
  const currentAIIdRef = useRef<string | null>(null);

  const [firstMsgData, setFirstMsgData] = useState<FirstMessageData | null>(null);

  // If URL has ?id=, load that conversation; otherwise ensure a fresh one exists.
  // This handles direct URL access, page refresh, and browser back/forward navigation.
  // Sidebar click also calls loadConversation directly for instant response.
  const prevUrlConvId = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    // Only act if urlConvId actually changed (avoid double-load on initial render)
    if (prevUrlConvId.current === urlConvId) return;
    prevUrlConvId.current = urlConvId;

    if (urlConvId) {
      // Only load from backend if this is a different conversation than what's already shown
      if (conversationId !== urlConvId) {
        loadConversation(urlConvId);
      }
    } else if (!conversationId) {
      newConversation();
    }
  }, [urlConvId]); // eslint-disable-line react-hooks/exhaustive-deps

  // PASO 4: Check first-message-today on mount (only for authenticated users)
  useEffect(() => {
    if (isPhantom) return;
    fetch("/api/chat/first-message")
      .then((r) => r.json())
      .then((data: FirstMessageData) => setFirstMsgData(data))
      .catch(() => {});
  }, [isPhantom]);

  // Handle incoming WS messages
  const handleMessage = useCallback((msg: WSServerMessage) => {
    const currentId = currentAIIdRef.current;

    switch (msg.type) {
      case "text_chunk":
        if (currentId) appendChunk(currentId, msg.content);
        break;

      case "text_done":
        if (currentId) {
          finishAIMessage(currentId);
          currentAIIdRef.current = null;
        }
        break;

      case "module_saved": {
        if (isPhantom) break;
        const meta = MODULE_META[msg.module] ?? { label: msg.module, color: "#6366f1" };
        const cardId = msg.id ?? Math.random().toString(36).slice(2);

        if (currentId) {
          addChip(currentId, {
            module: msg.module,
            color: meta.color,
            label: meta.label,
            detail: msg.summary,
            cardId,
          });
        }

        addCard({
          id: cardId,
          turnId: currentId ?? "",
          module: msg.module,
          color: meta.color,
          label: meta.label,
          lines: [msg.summary, msg.itemType],
        });
        break;
      }

      case "replace_text":
        replaceLastAIMessage(msg.text);
        break;

      case "phantom_expired":
        // Handled by the phantom store / banner
        break;

      case "error":
        if (currentId) {
          appendChunk(currentId, `\n\n[${msg.message}]`);
          finishAIMessage(currentId);
          currentAIIdRef.current = null;
        }
        break;
    }
  }, [isPhantom, appendChunk, finishAIMessage, addChip, addCard]); // eslint-disable-line react-hooks/exhaustive-deps

  // Connect WebSocket
  useEffect(() => {
    let ws: ZaelynWS | null = null;

    getWsToken().then((token) => {
      if (!token) return;
      ws = new ZaelynWS(
        token,
        handleMessage,
        (status) => console.debug("[WS]", status)
      );
      wsRef.current = ws;
    });

    return () => {
      ws?.destroy();
      wsRef.current = null;
    };
  }, [handleMessage]);

  function handleSend(content: string) {
    addUserMessage(content);

    const aiId = startAIMessage();
    currentAIIdRef.current = aiId;

    // PASO 3: Send with context variables
    wsRef.current?.sendMessage(
      content,
      isPhantom ? undefined : (conversationId ?? undefined),
      isPhantom ? (anonToken ?? undefined) : undefined,
      {
        lang,
        isPhantom,
        phantomSubMode: isPhantom ? (subMode ?? "pure") : undefined,
        isFirstToday: firstMsgData?.isFirstToday ?? false,
      }
    );

    // Clear first-today flag after first send
    if (firstMsgData?.isFirstToday) {
      setFirstMsgData((d) => d ? { ...d, isFirstToday: false } : d);
    }
  }

  function handleStop() {
    if (currentAIIdRef.current) {
      finishAIMessage(currentAIIdRef.current);
      currentAIIdRef.current = null;
    }
  }

  function handleChipClick(cardId: string) {
    const el = document.getElementById(`card-${cardId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cambio 4: Banner Telegram — discreto, cierra con X, persiste en localStorage */}
      <TelegramBanner hasTelegram={!!user?.telegramId} />

      {/* PASO 5: First-ever welcome — only on a fresh session, not when viewing history */}
      {firstMsgData?.isFirstEver && !urlConvId && (
        <WelcomeMessage
          userName={user?.name ?? user?.email}
          persona={firstMsgData.persona ?? user?.persona}
        />
      )}

      {/* PASO 4: Daily greeting — only on a fresh session, not when viewing history */}
      {firstMsgData?.isFirstToday && !firstMsgData?.isFirstEver && !urlConvId && (
        <DailyGreeting
          persona={firstMsgData.persona ?? user?.persona}
          hasUrgent={firstMsgData.hasUrgent}
        />
      )}

      {isLoadingHistory ? (
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-5 h-5 rounded-full border-2 animate-spin"
            style={{ borderColor: "var(--border)", borderTopColor: "var(--foreground)" }}
          />
        </div>
      ) : (
        <ChatThread isPhantom={isPhantom} onChipClick={handleChipClick} />
      )}
      <Composer
        onSend={handleSend}
        isStreaming={isStreaming}
        onStop={handleStop}
        isPhantom={isPhantom}
        disabled={isLoadingHistory}
      />
    </div>
  );
}

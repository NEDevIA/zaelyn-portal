"use client";

import { useEffect, useRef, useCallback } from "react";
import ChatThread from "@/components/chat/ChatThread";
import Composer from "@/components/chat/Composer";
import { useChatStore } from "@/store/useChatStore";
import { usePhantomStore } from "@/store/usePhantomStore";
import { useRightPanelStore } from "@/store/useRightPanelStore";
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

export default function ChatPage() {
  const {
    addUserMessage,
    startAIMessage,
    appendChunk,
    finishAIMessage,
    addChip,
    isStreaming,
    conversationId,
    newConversation,
  } = useChatStore();
  const { isPhantom, anonToken } = usePhantomStore();
  const { addCard } = useRightPanelStore();

  const wsRef = useRef<ZaelynWS | null>(null);
  const currentAIIdRef = useRef<string | null>(null);

  // Ensure a conversation exists
  useEffect(() => {
    if (!conversationId) newConversation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        if (isPhantom) break; // In phantom mode, nothing is saved
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
    // Add user message to store
    addUserMessage(content);

    // Start AI response message slot
    const aiId = startAIMessage();
    currentAIIdRef.current = aiId;

    // Send via WebSocket
    wsRef.current?.sendMessage(
      content,
      isPhantom ? undefined : (conversationId ?? undefined),
      isPhantom ? (anonToken ?? undefined) : undefined
    );
  }

  function handleStop() {
    if (currentAIIdRef.current) {
      finishAIMessage(currentAIIdRef.current);
      currentAIIdRef.current = null;
    }
  }

  function handleChipClick(cardId: string) {
    // Scroll to the card in the right panel
    const el = document.getElementById(`card-${cardId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="flex flex-col h-full">
      <ChatThread isPhantom={isPhantom} onChipClick={handleChipClick} />
      <Composer
        onSend={handleSend}
        isStreaming={isStreaming}
        onStop={handleStop}
        isPhantom={isPhantom}
      />
    </div>
  );
}

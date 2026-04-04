"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import TurnUser from "./TurnUser";
import TurnAI from "./TurnAI";

interface ChatThreadProps {
  isPhantom?: boolean;
  onChipClick?: (cardId: string) => void;
}

export default function ChatThread({ isPhantom, onChipClick }: ChatThreadProps) {
  const { messages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p
          className="text-[15px]"
          style={{
            color: "var(--muted-foreground)",
            opacity: 0.35,
            fontFamily: "var(--font-dm-serif)",
            fontStyle: "italic",
          }}
        >
          ¿Por dónde empezamos?
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="py-6 flex flex-col gap-6 mx-auto" style={{ maxWidth: "760px", width: "100%" }}>
        {messages.map((msg) =>
          msg.role === "user" ? (
            <TurnUser key={msg.id} content={msg.content} />
          ) : (
            <TurnAI
              key={msg.id}
              message={msg}
              isPhantom={isPhantom}
              onChipClick={onChipClick}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

import type { ChatMessage } from "@/store/useChatStore";
import ModuleChip from "./ModuleChip";

interface TurnAIProps {
  message: ChatMessage;
  isPhantom?: boolean;
  onChipClick?: (cardId: string) => void;
}

export default function TurnAI({ message, isPhantom, onChipClick }: TurnAIProps) {
  return (
    <div className="px-6 py-1 flex flex-col gap-2.5">
      <p
        className="text-[16px] leading-relaxed"
        style={{
          color: "var(--foreground)",
          fontFamily: "var(--font-dm-serif)",
        }}
      >
        {message.content}
        {message.isStreaming && (
          <span className="cursor-blink" />
        )}
      </p>

      {!isPhantom && message.chips && message.chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.chips.map((chip) => (
            <ModuleChip
              key={chip.cardId}
              chip={chip}
              onClick={() => onChipClick?.(chip.cardId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import type { ChatMessage } from "@/store/useChatStore";
import ModuleChip from "./ModuleChip";

interface TurnAIProps {
  message: ChatMessage;
  isPhantom?: boolean;
  onChipClick?: (cardId: string) => void;
}

export default function TurnAI({ message, isPhantom, onChipClick }: TurnAIProps) {
  return (
    <div className="px-4 flex flex-col gap-2">
      {/* Zaelyn label */}
      <p
        className="text-[11px] font-medium tracking-wide"
        style={{ color: "var(--muted-foreground)", opacity: 0.45 }}
      >
        Zaelyn
      </p>

      <p
        className="zaelyn-message text-[14px] leading-[1.75]"
        style={{
          color: "var(--foreground)",
          fontFamily: "var(--font-dm-sans)",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.content}
        {message.isStreaming && (
          <span className="cursor-blink" />
        )}
      </p>

      {!isPhantom && message.chips && message.chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
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

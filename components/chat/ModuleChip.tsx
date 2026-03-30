import type { ModuleChipData } from "@/store/useChatStore";

interface ModuleChipProps {
  chip: ModuleChipData;
  onClick?: () => void;
}

export default function ModuleChip({ chip, onClick }: ModuleChipProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-150"
      style={{
        background: `${chip.color}12`,
        border: `1px solid ${chip.color}28`,
        color: chip.color,
        animation: "chipIn 200ms ease both",
      }}
    >
      <style>{`
        @keyframes chipIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: chip.color }} />
      {chip.label}
      <span style={{ opacity: 0.6 }}>— {chip.detail}</span>
    </button>
  );
}

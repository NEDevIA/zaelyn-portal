interface TurnUserProps {
  content: string;
}

export default function TurnUser({ content }: TurnUserProps) {
  return (
    <div className="flex justify-end px-6 py-1">
      <p
        className="max-w-[75%] text-[13px] leading-relaxed text-right"
        style={{
          color: "#4b5563",
          fontFamily: "var(--font-dm-sans)",
          fontStyle: "italic",
          fontWeight: 300,
        }}
      >
        {content}
      </p>
    </div>
  );
}

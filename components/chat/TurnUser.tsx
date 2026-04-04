interface TurnUserProps {
  content: string;
}

export default function TurnUser({ content }: TurnUserProps) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tr-sm"
        style={{
          background: "rgba(99,102,241,0.07)",
          border: "1px solid rgba(99,102,241,0.12)",
        }}
      >
        <p
          className="text-[14px] leading-[1.75]"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

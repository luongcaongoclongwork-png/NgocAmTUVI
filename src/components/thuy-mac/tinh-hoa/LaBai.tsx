import { CHAT, type Chat, type La } from "@/lib/tinh-hoa";

/**
 * The four suits drawn as paths (24 × 24), not font glyphs: some phones turn ♥ ♦ into colour emoji.
 * The same paths draw the cards of the A4 sheet (see banDoSheet.ts).
 */
export const CHAT_PATH: Record<Chat, string> = {
  co: "M12 21s-7.4-4.5-9.5-9.1C1 8.5 3 4.6 6.6 4.6c2.2 0 3.7 1.2 5.4 3.3 1.7-2.1 3.2-3.3 5.4-3.3 3.6 0 5.6 3.9 4.1 7.3C19.4 16.5 12 21 12 21z",
  ro: "M12 2.6 19.6 12 12 21.4 4.4 12z",
  bich: "M12 2.6S3.6 9.3 3.6 13.6c0 2.6 2 4.4 4.3 4.4 1.5 0 2.7-.7 3.3-1.7-.2 2-1 3.5-2.5 4.7h6.6c-1.5-1.2-2.3-2.7-2.5-4.7.6 1 1.8 1.7 3.3 1.7 2.3 0 4.3-1.8 4.3-4.4C20.4 9.3 12 2.6 12 2.6z",
  nhep: "M12 3a3.9 3.9 0 0 0-3.8 4.8 3.9 3.9 0 1 0 1.5 7.6c.5-.2.9-.5 1.2-.8-.2 2.3-1 4-2.5 5.1h7.2c-1.5-1.1-2.3-2.8-2.5-5.1.3.3.7.6 1.2.8a3.9 3.9 0 1 0 1.5-7.6A3.9 3.9 0 0 0 12 3z",
};

export function ChatIcon({ chat, className }: { chat: Chat; className?: string }) {
  return (
    <svg className={`thSuitIcon ${className ?? ""}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={CHAT_PATH[chat]} />
    </svg>
  );
}

/** A card in Ngọc Âm's hand: dó paper, a bronze inner frame, the suit in vermilion or ink. Empty = a face-down slot. */
export default function LaBai({ la, size = "md", label }: { la?: La | null; size?: "sm" | "md" | "lg"; label?: string }) {
  if (!la) return <span className={`thCard thCard--${size} is-empty`} aria-hidden={label ? undefined : true} aria-label={label} />;
  const c = CHAT.find((x) => x.id === la.chat)!;
  return (
    <span className={`thCard thCard--${size} ${c.son ? "is-son" : ""}`} role="img" aria-label={label ?? `${la.hang === "A" ? "Át" : la.hang} ${c.ten}`}>
      <span className="thCard-corner">
        <b>{la.hang}</b>
        <ChatIcon chat={la.chat} />
      </span>
      <ChatIcon chat={la.chat} className="thCard-pip" />
      <span className="thCard-corner thCard-corner--end" aria-hidden="true">
        <b>{la.hang}</b>
        <ChatIcon chat={la.chat} />
      </span>
    </span>
  );
}

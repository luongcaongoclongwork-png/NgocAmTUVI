import { normalizeVietnamesePhone } from "@/lib/contact-leads-constants";

/**
 * "0912 345 678", "+84 912 345 678" or "84912345678" → "0912345678".
 * Returns null for anything that isn't a valid Vietnamese mobile number.
 */
export function toLocalVietnamesePhone(raw: string): string | null {
  const n = normalizeVietnamesePhone(raw);
  if (!n) return null;
  if (n.startsWith("+84")) return "0" + n.slice(3);
  if (n.startsWith("84")) return "0" + n.slice(2);
  return n;
}

/** Opens a Zalo chat with this phone number (the customer's, not the brand's). */
export function zaloChatUrl(raw: string): string | null {
  const local = toLocalVietnamesePhone(raw);
  return local ? `https://zalo.me/${local}` : null;
}

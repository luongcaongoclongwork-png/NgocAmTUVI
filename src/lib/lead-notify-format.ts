import { toLocalVietnamesePhone, zaloChatUrl } from "@/lib/phone";
import { formatVietnamTime } from "@/lib/vn-time";

export { formatVietnamTime };

export type NotifiableLead = {
  id: number;
  name: string;
  phone: string;
  interest: string;
  message: string;
  createdAt: string;
};

const MESSAGE_PREVIEW_MAX = 600;

/**
 * Plain-text Telegram message for a new lead. Plain text on purpose: no
 * parse_mode means a customer's own "*" or "<" can never break the message.
 */
export function formatLeadMessage(lead: NotifiableLead, siteUrl?: string | null): string {
  const message =
    lead.message.length > MESSAGE_PREVIEW_MAX ? lead.message.slice(0, MESSAGE_PREVIEW_MAX) + "…" : lead.message;
  const phone = toLocalVietnamesePhone(lead.phone) ?? lead.phone;
  const zalo = zaloChatUrl(lead.phone);
  const base = siteUrl?.trim().replace(/\/+$/, "");

  return [
    "Khách mới gửi lời nhắn · Ngọc Âm",
    "",
    `Tên: ${lead.name}`,
    `SĐT: ${phone}`,
    `Quan tâm: ${lead.interest}`,
    `Gửi lúc: ${formatVietnamTime(lead.createdAt)}`,
    "",
    "Lời nhắn:",
    message,
    "",
    ...(zalo ? [`Nhắn Zalo cho khách: ${zalo}`] : []),
    ...(base ? [`Xem & xử lý: ${base}/admin/lien-he/${lead.id}`] : []),
  ]
    .join("\n")
    .trim();
}

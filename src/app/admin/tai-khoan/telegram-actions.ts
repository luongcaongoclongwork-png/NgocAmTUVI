"use server";

import { verifySession } from "@/lib/auth";
import { formatLeadMessage } from "@/lib/lead-notify-format";
import { findRecentTelegramChats, sendTelegramMessage, telegramStatus, type TelegramChat } from "@/lib/telegram";

export type TelegramTestState = { message: string | null; ok: boolean };
export type TelegramChatsState = { chats: TelegramChat[] | null; error: string | null };

export async function sendTelegramTestAction(): Promise<TelegramTestState> {
  const session = await verifySession();
  if (!session) return { ok: false, message: "Phiên đăng nhập đã hết hạn." };

  const { hasToken, chatCount } = telegramStatus();
  if (!hasToken) return { ok: false, message: "Chưa có TELEGRAM_BOT_TOKEN trong .env.local." };
  if (!chatCount) return { ok: false, message: "Chưa có TELEGRAM_CHAT_ID trong .env.local — dùng nút “Tìm Chat ID” bên dưới." };

  // A realistic sample so the admin sees exactly what a real alert looks like.
  const sample = formatLeadMessage(
    {
      id: 0,
      name: "Khách thử (tin kiểm tra)",
      phone: "0912345678",
      interest: "Sự nghiệp và hướng đi — Gói: Phiên Xuyên vấn chuyên sâu một vấn đề",
      message: `Đây là tin thử do ${session.username} gửi từ trang quản trị. Khi có khách thật, tin sẽ có dạng như thế này.`,
      createdAt: new Date().toISOString(),
    },
    process.env.SITE_URL
  );
  const { sent, errors } = await sendTelegramMessage(sample);
  if (errors.length) return { ok: sent > 0, message: `Đã gửi ${sent}/${sent + errors.length}. ${errors.join(" ")}` };
  return { ok: true, message: `Đã gửi tin thử tới ${sent} người nhận. Hãy kiểm tra Telegram.` };
}

export async function findTelegramChatsAction(): Promise<TelegramChatsState> {
  const session = await verifySession();
  if (!session) return { chats: null, error: "Phiên đăng nhập đã hết hạn." };
  const { chats, error } = await findRecentTelegramChats();
  return { chats, error };
}

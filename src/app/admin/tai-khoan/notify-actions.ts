"use server";

import { verifySession } from "@/lib/auth";
import { formatLeadMessage } from "@/lib/lead-notify-format";
import { channelStatus, findRecentChats, sendBotMessage, type BotChat, type ChannelKey } from "@/lib/notify-channels";

export type NotifyTestState = { message: string | null; ok: boolean };
export type NotifyChatsState = { chats: BotChat[] | null; error: string | null };

function isChannel(key: string): key is ChannelKey {
  return key === "zalo" || key === "telegram";
}

export async function sendNotifyTestAction(key: string): Promise<NotifyTestState> {
  const session = await verifySession();
  if (!session) return { ok: false, message: "Phiên đăng nhập đã hết hạn." };
  if (!isChannel(key)) return { ok: false, message: "Kênh không hợp lệ." };

  const status = channelStatus(key);
  if (!status.hasToken) return { ok: false, message: `Chưa có ${status.tokenEnv} trong .env.local.` };
  if (!status.chatCount) return { ok: false, message: `Chưa có ${status.chatEnv} trong .env.local. Dùng nút “Tìm Chat ID” bên dưới.` };

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
  const { sent, errors } = await sendBotMessage(key, sample);
  if (errors.length) return { ok: sent > 0, message: `Đã gửi ${sent}/${sent + errors.length}. ${errors.join(" ")}` };
  return { ok: true, message: `Đã gửi tin thử qua ${status.label} tới ${sent} người nhận. Hãy kiểm tra ${status.label}.` };
}

export async function findNotifyChatsAction(key: string): Promise<NotifyChatsState> {
  const session = await verifySession();
  if (!session) return { chats: null, error: "Phiên đăng nhập đã hết hạn." };
  if (!isChannel(key)) return { chats: null, error: "Kênh không hợp lệ." };
  return findRecentChats(key);
}

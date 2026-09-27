import "server-only";

/**
 * Minimal Telegram Bot API client for admin notifications. Configured only
 * through .env.local (never through the admin UI, so the bot token is never
 * shown in a browser):
 *   TELEGRAM_BOT_TOKEN  from @BotFather
 *   TELEGRAM_CHAT_ID    one or more chat ids, comma-separated
 * When either is missing, sending is a silent no-op.
 */

const API = "https://api.telegram.org";
const TIMEOUT_MS = 8000;

function token(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || null;
}

function chatIds(): string[] {
  return (process.env.TELEGRAM_CHAT_ID || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function telegramStatus(): { hasToken: boolean; chatCount: number } {
  return { hasToken: !!token(), chatCount: chatIds().length };
}

/** Human-readable reason from a Telegram API error, without echoing the token. */
function describe(status: number, body: unknown): string {
  const desc = (body as { description?: string } | null)?.description;
  if (status === 401) return "Mã bot (TELEGRAM_BOT_TOKEN) không đúng.";
  if (status === 400 && desc?.includes("chat not found"))
    return "Không tìm thấy Chat ID — hãy nhắn cho bot một tin trước, rồi kiểm tra lại TELEGRAM_CHAT_ID.";
  if (status === 403) return "Bot bị chặn hoặc chưa được bắt đầu (bấm Start trong Telegram).";
  return desc ? `Telegram báo lỗi: ${desc}` : `Telegram báo lỗi (HTTP ${status}).`;
}

export async function sendTelegramMessage(text: string): Promise<{ sent: number; errors: string[] }> {
  const t = token();
  const ids = chatIds();
  if (!t || ids.length === 0) return { sent: 0, errors: [] };

  const results = await Promise.all(
    ids.map(async (chatId) => {
      try {
        const res = await fetch(`${API}/bot${t}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (res.ok) return null;
        return describe(res.status, await res.json().catch(() => null));
      } catch (e) {
        return e instanceof Error && e.name === "TimeoutError"
          ? "Telegram không phản hồi (quá 8 giây)."
          : "Không kết nối được tới Telegram.";
      }
    })
  );
  const errors = results.filter((r): r is string => r !== null);
  return { sent: ids.length - errors.length, errors };
}

export type TelegramChat = { id: string; name: string; type: string };

/**
 * Chats that recently messaged the bot — lets the admin find their own Chat
 * ID by sending the bot any message, then clicking "Tìm Chat ID".
 */
export async function findRecentTelegramChats(): Promise<{ chats: TelegramChat[]; error: string | null }> {
  const t = token();
  if (!t) return { chats: [], error: "Chưa có TELEGRAM_BOT_TOKEN trong .env.local." };
  try {
    const res = await fetch(`${API}/bot${t}/getUpdates`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body = (await res.json().catch(() => null)) as {
      result?: { message?: { chat?: { id: number; type: string; title?: string; first_name?: string; last_name?: string; username?: string } } }[];
    } | null;
    if (!res.ok) return { chats: [], error: describe(res.status, body) };
    const seen = new Map<string, TelegramChat>();
    for (const u of body?.result ?? []) {
      const c = u.message?.chat;
      if (!c) continue;
      const name = c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username || "(không tên)";
      seen.set(String(c.id), { id: String(c.id), name, type: c.type });
    }
    return { chats: [...seen.values()], error: null };
  } catch {
    return { chats: [], error: "Không kết nối được tới Telegram." };
  }
}

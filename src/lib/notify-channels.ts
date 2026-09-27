import "server-only";

/**
 * Bot channels used to alert the admin about new leads. Zalo Bot (Zalo's
 * own bot platform, created from a personal Zalo account via the
 * "Zalo Bot Manager" OA; no Official Account needed) and Telegram expose
 * almost the same Bot API shape, so one client serves both.
 *
 * Configured only in .env.local, so tokens never reach a browser:
 *   ZALO_BOT_TOKEN, ZALO_BOT_CHAT_ID           (chat ids comma-separated)
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID       (optional second channel)
 * A channel with no token or no chat id is simply skipped.
 */

export type ChannelKey = "zalo" | "telegram";

type ChannelDef = {
  label: string;
  base: string;
  tokenEnv: string;
  chatEnv: string;
  maxText: number;
  /** Extra body for getUpdates (Zalo long-polls 30s by default, too long for a button click). */
  updatesBody: Record<string, unknown>;
  readChat: (update: unknown) => BotChat | null;
};

export type BotChat = { id: string; name: string; group: boolean };

type Update = {
  message?: {
    chat?: { id: number | string; type?: string; chat_type?: string; title?: string; first_name?: string; last_name?: string; username?: string };
    from?: { display_name?: string };
  };
};

const CHANNELS: Record<ChannelKey, ChannelDef> = {
  zalo: {
    label: "Zalo",
    base: "https://bot-api.zaloplatforms.com",
    tokenEnv: "ZALO_BOT_TOKEN",
    chatEnv: "ZALO_BOT_CHAT_ID",
    maxText: 2000,
    updatesBody: { timeout: "2" },
    readChat: (u) => {
      const m = (u as Update).message;
      if (!m?.chat?.id) return null;
      return {
        id: String(m.chat.id),
        name: m.from?.display_name || "(không tên)",
        group: (m.chat.chat_type || "").toUpperCase() !== "PRIVATE",
      };
    },
  },
  telegram: {
    label: "Telegram",
    base: "https://api.telegram.org",
    tokenEnv: "TELEGRAM_BOT_TOKEN",
    chatEnv: "TELEGRAM_CHAT_ID",
    maxText: 4096,
    updatesBody: {},
    readChat: (u) => {
      const c = (u as Update).message?.chat;
      if (!c?.id) return null;
      return {
        id: String(c.id),
        name: c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username || "(không tên)",
        group: c.type !== "private",
      };
    },
  },
};

export const CHANNEL_KEYS = Object.keys(CHANNELS) as ChannelKey[];
const TIMEOUT_MS = 8000;

function token(key: ChannelKey): string | null {
  return process.env[CHANNELS[key].tokenEnv]?.trim() || null;
}

function chatIds(key: ChannelKey): string[] {
  return (process.env[CHANNELS[key].chatEnv] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function channelStatus(key: ChannelKey) {
  const def = CHANNELS[key];
  return { key, label: def.label, tokenEnv: def.tokenEnv, chatEnv: def.chatEnv, hasToken: !!token(key), chatCount: chatIds(key).length };
}
export type ChannelStatus = ReturnType<typeof channelStatus>;

type ApiBody = { ok?: boolean; result?: unknown; description?: string; error_code?: number } | null;

/**
 * POST a Bot API method. Zalo answers HTTP 200 even for errors
 * ({"ok":false,"error_code":401}), so success is judged by the body's `ok`,
 * never by the HTTP status alone. Error text never contains the token.
 */
async function call(key: ChannelKey, method: string, body: Record<string, unknown>): Promise<{ ok: true; result: unknown } | { ok: false; error: string }> {
  const def = CHANNELS[key];
  const t = token(key);
  if (!t) return { ok: false, error: `Chưa có ${def.tokenEnv} trong .env.local.` };
  try {
    const res = await fetch(`${def.base}/bot${t}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const json = (await res.json().catch(() => null)) as ApiBody;
    if (res.ok && json?.ok === true) return { ok: true, result: json.result };
    return { ok: false, error: describe(def, json?.error_code ?? res.status, json?.description) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error && e.name === "TimeoutError" ? `${def.label} không phản hồi (quá 8 giây).` : `Không kết nối được tới ${def.label}.`,
    };
  }
}

function describe(def: ChannelDef, code: number, desc?: string): string {
  if (code === 401) return `Mã bot (${def.tokenEnv}) không đúng.`;
  if (code === 403) return `${def.label}: bot bị chặn hoặc bạn chưa nhắn cho bot lần nào.`;
  if (/chat not found/i.test(desc || ""))
    return `${def.label}: không tìm thấy Chat ID. Hãy nhắn cho bot một tin trước, rồi kiểm tra lại ${def.chatEnv}.`;
  return `${def.label} báo lỗi${desc ? `: ${desc}` : ""} (mã ${code}).`;
}

/** Sends to every chat id of one channel. Unconfigured channel = no-op. */
export async function sendBotMessage(key: ChannelKey, text: string): Promise<{ sent: number; errors: string[] }> {
  const ids = chatIds(key);
  if (!token(key) || ids.length === 0) return { sent: 0, errors: [] };
  const max = CHANNELS[key].maxText;
  const body = text.length > max ? text.slice(0, max - 1) + "…" : text;
  const results = await Promise.all(
    ids.map((chatId) => call(key, "sendMessage", { chat_id: chatId, text: body, disable_web_page_preview: true }))
  );
  const errors = results.flatMap((r) => (r.ok ? [] : [r.error]));
  return { sent: ids.length - errors.length, errors };
}

/** Sends to every configured channel (Zalo and/or Telegram). */
export async function sendToAllChannels(text: string): Promise<{ sent: number; errors: string[] }> {
  const all = await Promise.all(CHANNEL_KEYS.map((k) => sendBotMessage(k, text)));
  return { sent: all.reduce((a, r) => a + r.sent, 0), errors: all.flatMap((r) => r.errors) };
}

/** Chats that recently messaged the bot, so the admin can find their Chat ID. */
export async function findRecentChats(key: ChannelKey): Promise<{ chats: BotChat[]; error: string | null }> {
  const r = await call(key, "getUpdates", CHANNELS[key].updatesBody);
  if (!r.ok) return { chats: [], error: r.error };
  const updates = Array.isArray(r.result) ? r.result : r.result ? [r.result] : [];
  const seen = new Map<string, BotChat>();
  for (const u of updates) {
    const chat = CHANNELS[key].readChat(u);
    if (chat) seen.set(chat.id, chat);
  }
  return { chats: [...seen.values()], error: null };
}

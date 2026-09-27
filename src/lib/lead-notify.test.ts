import { afterEach, describe, expect, it, vi } from "vitest";
import { toLocalVietnamesePhone, zaloChatUrl } from "@/lib/phone";
import { formatLeadMessage, formatVietnamTime } from "@/lib/lead-notify-format";
import { channelStatus, findRecentChats, sendBotMessage, sendToAllChannels } from "@/lib/notify-channels";

describe("phone helpers", () => {
  it("normalises every accepted format to local 0xxxxxxxxx", () => {
    expect(toLocalVietnamesePhone("0912 345 678")).toBe("0912345678");
    expect(toLocalVietnamesePhone("+84 912.345.678")).toBe("0912345678");
    expect(toLocalVietnamesePhone("84912345678")).toBe("0912345678");
    expect(toLocalVietnamesePhone("12345")).toBeNull();
  });

  it("builds a Zalo link to the customer's number", () => {
    expect(zaloChatUrl("+84912345678")).toBe("https://zalo.me/0912345678");
    expect(zaloChatUrl("not a phone")).toBeNull();
  });
});

const lead = {
  id: 42,
  name: "Nguyễn Văn A",
  phone: "+84912345678",
  interest: "Sự nghiệp và hướng đi — Gói: Phiên Xuyên vấn chuyên sâu một vấn đề",
  message: "Tôi muốn hỏi về *công việc* <năm nay>.",
  createdAt: "2026-09-27T02:05:00.000Z", // 09:05 in Vietnam
};

describe("formatLeadMessage", () => {
  it("includes the essentials, Vietnam time, Zalo and admin link", () => {
    const text = formatLeadMessage(lead, "https://ngocam.vn/");
    expect(text).toContain("Tên: Nguyễn Văn A");
    expect(text).toContain("SĐT: 0912345678");
    expect(text).toContain("Gói: Phiên Xuyên vấn chuyên sâu một vấn đề");
    expect(text).toContain("Tôi muốn hỏi về *công việc* <năm nay>."); // plain text, kept verbatim
    expect(text).toContain("Nhắn Zalo cho khách: https://zalo.me/0912345678");
    expect(text).toContain("Xem & xử lý: https://ngocam.vn/admin/lien-he/42");
    expect(formatVietnamTime(lead.createdAt)).toContain("09:05");
  });

  it("omits the admin link without SITE_URL and truncates long messages", () => {
    const text = formatLeadMessage({ ...lead, message: "x".repeat(900) }, null);
    expect(text).not.toContain("/admin/lien-he/");
    expect(text).toContain("x".repeat(600) + "…");
    expect(text).not.toContain("x".repeat(601));
  });
});

describe("notify channels", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

  it("is a silent no-op when no channel is configured", async () => {
    for (const k of ["ZALO_BOT_TOKEN", "ZALO_BOT_CHAT_ID", "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"]) vi.stubEnv(k, "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect(channelStatus("zalo")).toMatchObject({ hasToken: false, chatCount: 0 });
    expect(await sendToAllChannels("hi")).toEqual({ sent: 0, errors: [] });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("Zalo: posts to bot-api.zaloplatforms.com and treats HTTP 200 + ok:false as a failure", async () => {
    vi.stubEnv("ZALO_BOT_TOKEN", "999:ZSECRET");
    vi.stubEnv("ZALO_BOT_CHAT_ID", "good,bad");
    const fetchSpy = vi.fn(async (_url: string, init: RequestInit) =>
      JSON.parse(String(init.body)).chat_id === "good"
        ? json({ ok: true, result: { message_id: "m1" } })
        : json({ ok: false, description: "Unauthorized", error_code: 401 }) // Zalo really answers errors with HTTP 200
    );
    vi.stubGlobal("fetch", fetchSpy);

    const res = await sendBotMessage("zalo", "x".repeat(2500));
    expect(res).toMatchObject({ sent: 1 });
    expect(res.errors[0]).toContain("ZALO_BOT_TOKEN");
    expect(res.errors.join(" ")).not.toContain("ZSECRET");
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://bot-api.zaloplatforms.com/bot999:ZSECRET/sendMessage");
    expect(JSON.parse(String(init.body)).text).toHaveLength(2000); // Zalo's text limit
  });

  it("Zalo: reads chat ids from a single-object getUpdates result", async () => {
    vi.stubEnv("ZALO_BOT_TOKEN", "999:ZSECRET");
    vi.stubGlobal("fetch", vi.fn(async () =>
      json({ ok: true, result: { message: { from: { id: "u1", display_name: "Chị Trang" }, chat: { id: "c1", chat_type: "PRIVATE" }, text: "hi" }, event_name: "message.text.received" } })
    ));
    expect(await findRecentChats("zalo")).toEqual({ chats: [{ id: "c1", name: "Chị Trang", group: false }], error: null });
  });

  it("Telegram: sends plain text to every chat id and reports failures without the token", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:SECRET");
    vi.stubEnv("TELEGRAM_CHAT_ID", "111, 222");
    const fetchSpy = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      return body.chat_id === "111"
        ? new Response(JSON.stringify({ ok: true }), { status: 200 })
        : new Response(JSON.stringify({ ok: false, description: "Bad Request: chat not found" }), { status: 400 });
    });
    vi.stubGlobal("fetch", fetchSpy);

    const res = await sendBotMessage("telegram", "hello");
    expect(res.sent).toBe(1);
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0]).toContain("Chat ID");
    expect(res.errors.join(" ")).not.toContain("SECRET");
    const [, init] = fetchSpy.mock.calls[0];
    expect(JSON.parse(String(init.body))).toMatchObject({ text: "hello", disable_web_page_preview: true });
    expect(JSON.parse(String(init.body))).not.toHaveProperty("parse_mode");
  });
});

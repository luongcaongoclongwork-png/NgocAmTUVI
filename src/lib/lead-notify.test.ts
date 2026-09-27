import { afterEach, describe, expect, it, vi } from "vitest";
import { toLocalVietnamesePhone, zaloChatUrl } from "@/lib/phone";
import { formatLeadMessage, formatVietnamTime } from "@/lib/lead-notify-format";
import { sendTelegramMessage, telegramStatus } from "@/lib/telegram";

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

describe("sendTelegramMessage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("is a silent no-op when not configured", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    vi.stubEnv("TELEGRAM_CHAT_ID", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect(telegramStatus()).toEqual({ hasToken: false, chatCount: 0 });
    expect(await sendTelegramMessage("hi")).toEqual({ sent: 0, errors: [] });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends plain text to every chat id and reports failures without the token", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:SECRET");
    vi.stubEnv("TELEGRAM_CHAT_ID", "111, 222");
    const fetchSpy = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      return body.chat_id === "111"
        ? new Response(JSON.stringify({ ok: true }), { status: 200 })
        : new Response(JSON.stringify({ ok: false, description: "Bad Request: chat not found" }), { status: 400 });
    });
    vi.stubGlobal("fetch", fetchSpy);

    const res = await sendTelegramMessage("hello");
    expect(res.sent).toBe(1);
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0]).toContain("Chat ID");
    expect(res.errors.join(" ")).not.toContain("SECRET");
    const [, init] = fetchSpy.mock.calls[0];
    expect(JSON.parse(String(init.body))).toMatchObject({ text: "hello", disable_web_page_preview: true });
    expect(JSON.parse(String(init.body))).not.toHaveProperty("parse_mode");
  });
});

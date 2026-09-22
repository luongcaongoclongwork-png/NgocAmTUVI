import { describe, expect, it } from "vitest";
import {
  normalizeVietnamesePhone,
  resolveTopicFromQuery,
  topicLabel,
  validateLeadInput,
  type LeadFormInput,
} from "./contact-leads-constants";

function validInput(overrides: Partial<LeadFormInput> = {}): LeadFormInput {
  return {
    name: "Nguyễn Văn A",
    phone: "0912345678",
    interest: "Sự nghiệp và hướng đi",
    message: "Tôi đang cân nhắc đổi hướng công việc.",
    consent: "on",
    honeypot: "",
    ...overrides,
  };
}

describe("normalizeVietnamesePhone", () => {
  it("accepts a plain 0-prefixed mobile number", () => {
    expect(normalizeVietnamesePhone("0912345678")).toBe("0912345678");
  });

  it("accepts +84 and 84 prefixes, stripping separators", () => {
    expect(normalizeVietnamesePhone("+84 912 345 678")).toBe("+84912345678");
    expect(normalizeVietnamesePhone("84-912-345-678")).toBe("84912345678");
  });

  it("rejects a landline-style or too-short number", () => {
    expect(normalizeVietnamesePhone("0212345678")).toBeNull(); // invalid leading digit
    expect(normalizeVietnamesePhone("091234")).toBeNull();
  });

  it("rejects non-numeric input", () => {
    expect(normalizeVietnamesePhone("gọi cho tôi nhé")).toBeNull();
  });
});

describe("validateLeadInput", () => {
  it("accepts a fully valid submission", () => {
    const result = validateLeadInput(validInput());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Nguyễn Văn A");
      expect(result.data.phone).toBe("0912345678");
      expect(result.data.consent).toBe(true);
    }
  });

  it("trims whitespace on name/message and defaults a blank interest", () => {
    const result = validateLeadInput(
      validInput({ name: "  Trần Thị B  ", interest: "   ", message: "  Có điều muốn hỏi.  " })
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Trần Thị B");
      expect(result.data.interest).toBe("Chưa xác định");
      expect(result.data.message).toBe("Có điều muốn hỏi.");
    }
  });

  it("rejects a missing/too-short name", () => {
    const result = validateLeadInput(validInput({ name: "A" }));
    expect(result.ok).toBe(false);
  });

  it("rejects an invalid phone number", () => {
    const result = validateLeadInput(validInput({ phone: "123" }));
    expect(result.ok).toBe(false);
  });

  it("rejects a too-short message", () => {
    const result = validateLeadInput(validInput({ message: "Hi" }));
    expect(result.ok).toBe(false);
  });

  it("rejects when consent is missing", () => {
    const result = validateLeadInput(validInput({ consent: undefined }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/đồng ý/);
  });

  it("rejects when consent is explicitly false", () => {
    const result = validateLeadInput(validInput({ consent: false }));
    expect(result.ok).toBe(false);
  });

  it("silently rejects when the honeypot field is filled in", () => {
    const result = validateLeadInput(validInput({ honeypot: "http://spam.example" }));
    expect(result.ok).toBe(false);
  });
});

describe("query parameter -> topic mapping", () => {
  it("resolves a canonical topic id directly", () => {
    expect(resolveTopicFromQuery("vat-pham-dong-hanh")).toBe("vat-pham-dong-hanh");
  });

  it("resolves the short CTA aliases used by service/product cards", () => {
    expect(resolveTopicFromQuery("tu-vi")).toBe("su-nghiep-huong-di");
    expect(resolveTopicFromQuery("phong-thuy")).toBe("khong-gian-song");
    expect(resolveTopicFromQuery("vat-pham")).toBe("vat-pham-dong-hanh");
  });

  it("resolves to null for an unknown or missing value", () => {
    expect(resolveTopicFromQuery("khong-ton-tai")).toBeNull();
    expect(resolveTopicFromQuery(null)).toBeNull();
    expect(resolveTopicFromQuery(undefined)).toBeNull();
  });

  it("topicLabel returns the exact spec'd Vietnamese label for every topic", () => {
    expect(topicLabel("su-nghiep-huong-di")).toBe("Sự nghiệp và hướng đi");
    expect(topicLabel("moi-quan-he")).toBe("Mối quan hệ");
    expect(topicLabel("khong-gian-song")).toBe("Không gian sống hoặc nơi làm việc");
    expect(topicLabel("thoi-diem-quan-trong")).toBe("Một thời điểm quan trọng");
    expect(topicLabel("vat-pham-dong-hanh")).toBe("Vật phẩm đồng hành");
    expect(topicLabel("chua-ro")).toBe("Tôi chưa muốn gọi tên điều mình đang bận tâm");
  });
});

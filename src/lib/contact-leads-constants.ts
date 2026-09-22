/**
 * Types + pure logic for the /lien-he contact flow — kept separate from
 * src/lib/contact-leads.ts (which has `import "server-only"` for its DB
 * access), same reasoning as service-constants.ts: the public letter form
 * and the admin UI both need these at runtime, and importing anything from
 * a server-only module would pull DB code into the client bundle. No
 * Next.js or Node API is used here, so this file is also safe to unit test
 * directly.
 */

export type TopicId =
  | "su-nghiep-huong-di"
  | "moi-quan-he"
  | "khong-gian-song"
  | "thoi-diem-quan-trong"
  | "vat-pham-dong-hanh"
  | "chua-ro";

export const CONTACT_TOPICS: { id: TopicId; label: string }[] = [
  { id: "su-nghiep-huong-di", label: "Sự nghiệp và hướng đi" },
  { id: "moi-quan-he", label: "Mối quan hệ" },
  { id: "khong-gian-song", label: "Không gian sống hoặc nơi làm việc" },
  { id: "thoi-diem-quan-trong", label: "Một thời điểm quan trọng" },
  { id: "vat-pham-dong-hanh", label: "Vật phẩm đồng hành" },
  { id: "chua-ro", label: "Tôi chưa muốn gọi tên điều mình đang bận tâm" },
];

export function isTopicId(value: string | null | undefined): value is TopicId {
  return !!value && CONTACT_TOPICS.some((t) => t.id === value);
}

export function topicLabel(id: TopicId): string {
  return CONTACT_TOPICS.find((t) => t.id === id)!.label;
}

/** Short aliases a CTA link can use without knowing this page's exact topic
 * wording (e.g. a Tu Vi service card just knows it's "tu-vi", not which of
 * the 6 topic phrasings that maps to). Resolves either a real topic id or
 * one of these aliases; anything else resolves to no pre-selection. */
const TOPIC_QUERY_ALIASES: Record<string, TopicId> = {
  "tu-vi": "su-nghiep-huong-di",
  "phong-thuy": "khong-gian-song",
  "vat-pham": "vat-pham-dong-hanh",
};

export function resolveTopicFromQuery(value: string | null | undefined): TopicId | null {
  if (!value) return null;
  if (isTopicId(value)) return value;
  return TOPIC_QUERY_ALIASES[value] ?? null;
}

export type LeadStatus = "new" | "contacted" | "discussing" | "booked" | "closed";

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "Mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "discussing", label: "Đang trao đổi" },
  { value: "booked", label: "Đã đặt lịch" },
  { value: "closed", label: "Không tiếp tục" },
];

export function isLeadStatus(value: string | null | undefined): value is LeadStatus {
  return !!value && LEAD_STATUSES.some((s) => s.value === value);
}

export type ContactLead = {
  id: number;
  name: string;
  phone: string;
  interest: string;
  message: string;
  consent: boolean;
  status: LeadStatus;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};

// ---------- Public-form input + validation (framework-independent, unit-testable) ----------

export type LeadFormInput = {
  name: string;
  phone: string;
  interest: string;
  message: string;
  /** Checkbox value as it arrives from FormData ("on") or a plain boolean from a test. */
  consent: boolean | string | null | undefined;
  /** Hidden honeypot field — a real visitor never fills this in. */
  honeypot?: string | null;
};

export type ValidatedLeadData = {
  name: string;
  phone: string;
  interest: string;
  message: string;
  consent: true;
};

export type LeadValidationResult =
  | { ok: true; data: ValidatedLeadData }
  | { ok: false; error: string };

const NAME_MIN = 2;
const NAME_MAX = 100;
const MESSAGE_MIN = 5;
const MESSAGE_MAX = 2000;
const INTEREST_MAX = 200;

// Vietnamese mobile numbers: optional +84/84/0 prefix, then a valid leading
// digit (3/5/7/8/9), then 8 more digits. Accepts spaces/dots/dashes as
// separators (stripped before testing).
const VN_PHONE_RE = /^(?:\+84|84|0)(3|5|7|8|9)\d{8}$/;

export function normalizeVietnamesePhone(raw: string): string | null {
  const stripped = raw.trim().replace(/[\s.\-()]/g, "");
  return VN_PHONE_RE.test(stripped) ? stripped : null;
}

function isConsentGiven(consent: LeadFormInput["consent"]): boolean {
  return consent === true || consent === "on" || consent === "true";
}

export function validateLeadInput(input: LeadFormInput): LeadValidationResult {
  // Silently-rejected honeypot: a real visitor never sees or fills this field.
  if (input.honeypot && input.honeypot.trim() !== "") {
    return { ok: false, error: "Yêu cầu không hợp lệ." };
  }

  const name = input.name.trim();
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return { ok: false, error: "Vui lòng cho Ngọc Âm biết tên bạn." };
  }

  const phone = normalizeVietnamesePhone(input.phone);
  if (!phone) {
    return { ok: false, error: "Số điện thoại chưa hợp lệ, vui lòng kiểm tra lại." };
  }

  const interest = input.interest.trim().slice(0, INTEREST_MAX) || "Chưa xác định";

  const message = input.message.trim();
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    return { ok: false, error: "Vui lòng chia sẻ đôi dòng để Ngọc Âm hiểu thêm." };
  }

  if (!isConsentGiven(input.consent)) {
    return { ok: false, error: "Vui lòng đồng ý để Ngọc Âm liên hệ lại." };
  }

  return { ok: true, data: { name, phone, interest, message, consent: true } };
}

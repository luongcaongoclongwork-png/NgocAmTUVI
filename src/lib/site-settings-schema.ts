/**
 * Site-wide contact / social / legal settings: the shape, the defaults
 * (exactly what the site showed before these became editable, so nothing
 * changes until the admin edits them) and validation. No DB access here,
 * so it is unit-testable and importable from client forms.
 */

export const SETTING_FIELDS = [
  { key: "phone", label: "Số điện thoại", group: "contact", kind: "phone", hint: "Hiện ở chân trang và trang Liên hệ." },
  { key: "email", label: "Email", group: "contact", kind: "email", hint: "Nên dùng email tên miền riêng, ví dụ lienhe@ngocam.vn." },
  { key: "workingHours", label: "Giờ làm việc", group: "contact", kind: "text", hint: "Ví dụ: 8:30–18:00, thứ Hai – thứ Bảy." },
  { key: "address", label: "Địa chỉ", group: "contact", kind: "text", hint: "Để trống nếu chưa muốn công khai." },
  { key: "zaloUrl", label: "Zalo", group: "social", kind: "url", hint: "Ví dụ: https://zalo.me/0775448989 (hoặc link Zalo OA)." },
  { key: "messengerUrl", label: "Messenger", group: "social", kind: "url", hint: "Ví dụ: https://m.me/tên-trang" },
  { key: "facebookUrl", label: "Facebook", group: "social", kind: "url", hint: "" },
  { key: "instagramUrl", label: "Instagram", group: "social", kind: "url", hint: "" },
  { key: "youtubeUrl", label: "YouTube", group: "social", kind: "url", hint: "" },
  { key: "tiktokUrl", label: "TikTok", group: "social", kind: "url", hint: "" },
  { key: "businessName", label: "Tên pháp nhân / hộ kinh doanh", group: "legal", kind: "text", hint: "Hiện ở cuối chân trang." },
  { key: "taxCode", label: "Mã số thuế", group: "legal", kind: "text", hint: "" },
] as const;

export type SettingKey = (typeof SETTING_FIELDS)[number]["key"];
export type SiteSettings = Record<SettingKey, string>;

export const SETTING_GROUPS: { id: "contact" | "social" | "legal"; title: string; desc: string }[] = [
  { id: "contact", title: "Liên hệ", desc: "Để trống mục nào thì mục đó không hiện trên website." },
  { id: "social", title: "Mạng xã hội và nhắn tin", desc: "Chỉ nhận link bắt đầu bằng https://" },
  { id: "legal", title: "Thông tin pháp lý", desc: "Giúp khách hàng doanh nghiệp tin tưởng hơn." },
];

export function defaultSettings(env: Record<string, string | undefined> = {}): SiteSettings {
  return {
    phone: "0775 448 989",
    email: "trangsucngocam.work@gmail.com",
    workingHours: "",
    address: "",
    zaloUrl: env.NEXT_PUBLIC_ZALO_CONTACT_URL || "",
    messengerUrl: env.NEXT_PUBLIC_MESSENGER_CONTACT_URL || "",
    facebookUrl: "https://www.facebook.com/Tuviphongthuyngocam",
    instagramUrl: "https://www.instagram.com/ngocam_tuviphongthuy/",
    youtubeUrl: "",
    tiktokUrl: "https://www.tiktok.com/@ngocam.tuviphongthuy",
    businessName: "",
    taxCode: "",
  };
}

const MAX_LEN = 300;

/** Only real web links: blocks javascript:, data:, relative paths and typos. */
export function isSafeHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return (u.protocol === "https:" || u.protocol === "http:") && !!u.hostname.includes(".");
  } catch {
    return false;
  }
}

export type SettingsValidation = { ok: true; values: SiteSettings } | { ok: false; errors: Partial<Record<SettingKey, string>> };

export function validateSettings(input: Record<string, unknown>): SettingsValidation {
  const values = {} as SiteSettings;
  const errors: Partial<Record<SettingKey, string>> = {};
  for (const f of SETTING_FIELDS) {
    const v = String(input[f.key] ?? "").trim();
    values[f.key] = v;
    if (!v) continue;
    if (v.length > MAX_LEN) errors[f.key] = `Tối đa ${MAX_LEN} ký tự.`;
    else if (f.kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors[f.key] = "Email chưa đúng định dạng.";
    else if (f.kind === "phone" && !/^\+?[\d\s.\-()]{8,20}$/.test(v)) errors[f.key] = "Số điện thoại chỉ gồm số (có thể có dấu cách, +, -, .).";
    else if (f.kind === "url" && !isSafeHttpUrl(v)) errors[f.key] = "Link phải bắt đầu bằng https:// và là một địa chỉ web đầy đủ.";
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, values };
}

/** "0775 448 989" → "tel:0775448989" */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/**
 * Social links in display order. Messaging first (Zalo is what Vietnamese
 * clients actually use), TikTok last: the audit found leading with TikTok
 * read as mass-market for a premium brand.
 */
export function socialLinks(s: SiteSettings): { label: string; href: string }[] {
  return [
    { label: "Zalo", href: s.zaloUrl },
    { label: "Facebook", href: s.facebookUrl },
    { label: "Instagram", href: s.instagramUrl },
    { label: "YouTube", href: s.youtubeUrl },
    { label: "TikTok", href: s.tiktokUrl },
  ].filter((l) => l.href && isSafeHttpUrl(l.href));
}

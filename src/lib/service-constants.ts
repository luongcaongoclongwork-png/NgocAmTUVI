/**
 * Types + fixed group list — kept separate from src/lib/services.ts (which
 * has `import "server-only"` for its DB access), same reasoning as
 * article-constants.ts: a Client Component form needs these at runtime for
 * its <select>, and importing any real value from a server-only module pulls
 * the whole module — DB code included — into the client bundle.
 */

export type ServiceGroup = "tu-vi" | "phong-thuy" | "dai-chu-su";

export type Service = {
  id: number;
  group: ServiceGroup;
  title: string;
  desc: string;
  price: string;
  /** e.g. "45 phút" or "Theo sự kiện" — empty string when not applicable. */
  duration: string;
  /** Eligibility badge (e.g. "Dành cho Chủ Sự đã Xuyên Vấn tại Ngọc Âm") — empty string when not applicable. */
  note: string;
  sortOrder: number;
};

export type ServiceInput = {
  group: ServiceGroup;
  title: string;
  desc: string;
  price: string;
  duration: string;
  note: string;
  sortOrder: number;
};

export const SERVICE_GROUPS: { value: ServiceGroup; label: string }[] = [
  { value: "tu-vi", label: "Tử Vi" },
  { value: "phong-thuy", label: "Phong Thuỷ" },
  { value: "dai-chu-su", label: "Đại Chủ Sự (doanh nghiệp)" },
];

/**
 * Price as typed in admin → as shown on the site. Admin writes the number
 * with any wording it needs ("2.000.000", "Từ 1.500.000", "Liên hệ"); " đ"
 * is appended only when there is a number and no currency already.
 */
export function formatPrice(price: string): string {
  const p = price.trim();
  return /d/.test(p) && !/(đ|vnđ|vnd)s*$/i.test(p) ? `${p} đ` : p;
}

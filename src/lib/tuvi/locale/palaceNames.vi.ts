import type { PalaceNameVi } from "../types/VietnameseChart";

/**
 * 12 palace names, keyed by iztro's actual runtime zh-CN string — NOT the
 * "X宫" form used in the spec's own section J, which turned out to only
 * match iztro's soulPalace/bodyPalace keys. Verified 2026-09-12 against
 * node_modules/iztro@2.6.1/lib/i18n/locales/zh-CN/palace.js directly (its
 * palace.d.ts type signature does not capture this, only the compiled data
 * does): 11 of the 12 palace names are emitted WITHOUT the trailing "宫".
 *
 * Also corrects vs iztro's own vi-VN locale: "子女" is translated there as
 * "Tử Nữ" — we use the standard Vietnamese term "Tử Tức" per spec section J.
 */
export const PALACE_NAMES_VI: Record<string, PalaceNameVi> = {
  "命宫": "Mệnh",
  "兄弟": "Huynh Đệ",
  "夫妻": "Phu Thê",
  "子女": "Tử Tức",
  "财帛": "Tài Bạch",
  "疾厄": "Tật Ách",
  "迁移": "Thiên Di",
  "仆役": "Nô Bộc",
  "官禄": "Quan Lộc",
  "田宅": "Điền Trạch",
  "福德": "Phúc Đức",
  "父母": "Phụ Mẫu",
};

export const BODY_PALACE_ZH = "身宫";
export const BODY_PALACE_VI = "Thân";

const ZH_BY_VI: Record<string, string> = Object.fromEntries(
  Object.entries(PALACE_NAMES_VI).map(([zh, vi]) => [vi, zh]),
);

export function palaceZhFromVi(vi: PalaceNameVi): string {
  return ZH_BY_VI[vi];
}

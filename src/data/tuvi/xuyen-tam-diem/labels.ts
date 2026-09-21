import type { FiveElementsClassVi, VietnameseBrightness } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Xuyen Tam Diem (川三焰) display names for the non-star "khung luan"
 * (frame) items — cuc, brightness, Tuan/Triet, Vo Chinh Dieu, Menh/Than,
 * relations between palaces, time layers. Source: user-provided
 * "Xuyen-Tam-Diem.pdf" (2026-09-21), section III + the Tuan/Triet and Vo
 * chinh dieu tables. Display-only; nothing here is read by lib/tuvi.
 */

/** Ngu hanh cuc — "chat cua vach". */
export const XUYEN_TAM_DIEM_CUC_MAP: Record<FiveElementsClassVi, string> = {
  "Thủy Nhị Cục": "Nguyệt Tuyền",
  "Mộc Tam Cục": "Hồ Dương",
  "Kim Tứ Cục": "Lưu Kim",
  "Thổ Ngũ Cục": "Áo Thổ",
  "Hỏa Lục Cục": "Chu Sa",
};

export function getXtdCucName(cuc: string): string {
  return XUYEN_TAM_DIEM_CUC_MAP[cuc as FiveElementsClassVi] ?? cuc;
}

/**
 * The PDF lists six brightness levels (Mieu, Vuong, Dac, Loi ich, Binh hoa,
 * Ham); this app's Tan Bien table only has five (M/V/D/B/H) — "Loi ich"
 * (Tro Diem) has no engine counterpart, so it is simply never produced.
 */
export const XUYEN_TAM_DIEM_BRIGHTNESS_LABEL: Record<VietnameseBrightness, string> = {
  M: "Mãn Diệm",
  V: "Thịnh Diệm",
  Đ: "Ổn Diệm",
  B: "Bình Diệm",
  H: "Tàn Diệm",
};

/** Tuan / Triet overlay labels. */
export const XTD_TUAN_LABEL = "Bạch Bích";
export const XTD_TRIET_LABEL = "Đoạn Lộ";

/**
 * A palace covered by BOTH Tuan and Triet ("dong cung") shows one shared badge
 * "Bich Lo" — the last word of each name (Bach BICH + Doan LO), coloured to
 * match (Bich = Tuan colour, Lo = Triet colour). NOT in Xuyen-Tam-Diem.pdf:
 * a coined term proposed by the user (2026-09-22) so the two full names,
 * which don't fit side by side in the footer row, don't need a line of their
 * own. Kept out of the star/palace dictionaries on purpose — it is a display
 * abbreviation, not a name for anything.
 */
export const XTD_TUAN_TRIET_COMBINED = { tuan: "Bích", triet: "Lộ" } as const;

/** Palace with no chinh tinh. */
export const XTD_VO_CHINH_DIEU = "Vô Tượng";

/** Menh / Than tags on the palace that holds them. */
export const XTD_MENH_TAG = "Chủ Thất";
export const XTD_THAN_TAG = "Hậu Thất";

/** Trung Cung row labels for Menh chu / Than chu and the Menh / Than palaces. */
export const XTD_ROW_LABELS = {
  menhChu: "Chủ Đăng",
  thanChu: "Tùy Đăng",
  cungMenh: "Chủ Thất",
  cungThan: "Hậu Thất",
} as const;

/** Relations between palaces (legend + "Khám đang chọn" line). */
export const XTD_RELATION_LABELS = {
  tamHop: "Hợp Chiếu",
  xungChieu: "Đối Khám",
  giapCung: "Giáp Khám",
} as const;

/**
 * Time layers. The PDF gives full names only (Dai Trinh / Nien Trinh); the
 * palace footer is far too narrow for them, so its two-letter abbreviations
 * "DV"/"LN" become the initials "ĐT"/"NT" (initials of the same names — no
 * new term invented).
 */
export const XTD_TIME_LABELS = {
  daiVan: "Đại Trình",
  luuNien: "Niên Trình",
  daiVanShort: "ĐT",
  luuNienShort: "NT",
} as const;

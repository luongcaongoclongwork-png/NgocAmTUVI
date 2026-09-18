import type { PalaceNameVi } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Xuyen Tam Diem (川三焰) display names for the 12 palaces ("kham"), keyed by
 * the canonical PalaceNameVi union — the SAME type VietnamesePalace.name,
 * horoscope.decadal.palaceNameByIndex[i] and horoscope.yearly.palaceNameByIndex[i]
 * all already use, so one lookup covers the natal label AND the Dai Van /
 * Luu Nien re-labeling of the same slot without any extra plumbing.
 *
 * Source: user-provided "XUYEN TAM DIEM (川三焰)" spec, 2026-09-19, section
 * "12 Kham". Display-only — PalaceNameVi itself, and every palace.index /
 * branch it's attached to, is untouched.
 */
export const XUYEN_TAM_DIEM_PALACE_MAP: Record<PalaceNameVi, { display: string; han: string }> = {
  "Mệnh": { display: "Chủ Thất", han: "主室" },
  "Huynh Đệ": { display: "Bình Khám", han: "并龛" },
  "Phu Thê": { display: "Song Phi", han: "双飞" },
  "Tử Tức": { display: "Tử Mẫu", han: "子母" },
  "Tài Bạch": { display: "Đà Đội", han: "驼队" },
  "Tật Ách": { display: "Dược Sư", han: "药师" },
  "Thiên Di": { display: "Tơ Lộ", han: "丝路" },
  "Nô Bộc": { display: "Thương Lữ", han: "商旅" },
  "Quan Lộc": { display: "Kinh Biến", han: "经变" },
  "Điền Trạch": { display: "Già Lam", han: "伽蓝" },
  "Phúc Đức": { display: "Tảo Tỉnh", han: "藻井" },
  "Phụ Mẫu": { display: "Thí Chủ", han: "施主" },
};

/**
 * Accepts `string`, not just `PalaceNameVi`: presentation/ownerViewModel.ts's
 * originPalace/bodyResidence fields are typed as plain string even though
 * every real value is one of the 12 palace names — the lookup itself is
 * still exhaustive over PalaceNameVi, this just avoids an unsafe cast at
 * every call site for a value that's already known-safe at runtime.
 */
export function getXtdPalaceName(name: string): string {
  return XUYEN_TAM_DIEM_PALACE_MAP[name as PalaceNameVi]?.display ?? name;
}

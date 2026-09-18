import type { FourTransformation } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Xuyen Tam Diem (川三焰) display names for Tu Hoa ("bon cua doi nhiet cua
 * dong") — keyed by the canonical FourTransformation union ("Loc"/"Quyen"/
 * "Khoa"/"Ky"), the same value star.transformation / palace.fourTransformations
 * already carry. Which star/palace receives which transformation is computed
 * by rules/fourTransformations.ts and never touched here — display only.
 *
 * Source: user-provided "XUYEN TAM DIEM (川三焰)" spec, 2026-09-19, section
 * "Tu hoa".
 */
export const XUYEN_TAM_DIEM_TU_HOA_MAP: Record<FourTransformation, { display: string; han: string }> = {
  "Lộc": { display: "Bảo Châu", han: "宝珠" },
  "Quyền": { display: "Pháp Luân", han: "法轮" },
  "Khoa": { display: "Bối Diệp", han: "贝叶" },
  "Kỵ": { display: "Ma Kiệt", han: "摩羯" },
};

export function getXtdTuHoaName(t: FourTransformation): string {
  return XUYEN_TAM_DIEM_TU_HOA_MAP[t]?.display ?? t;
}

/**
 * Xuyen Tam Diem (川三焰) display names for vong Truong Sinh ("12 do cua mot
 * ngon den") — keyed by the canonical Vietnamese label palace.changSinh
 * already holds (locale/astronomyNames.vi.ts's CHANG_SINH_VI values). Safe
 * to key by that string directly (unlike vong Thai Sui, see taiSuiCycle.ts):
 * this dictionary's 12 source values were checked 1:1 against the user's
 * spec and match exactly, and CHANG_SINH_VI's 12 values don't collide with
 * any other namespace in this app (boshi/jiangQian/suiQian all have
 * disjoint value sets — verified 2026-09-19).
 *
 * Source: user-provided "XUYEN TAM DIEM (川三焰)" spec, 2026-09-19, section
 * "Vong Truong Sinh". engine/vietnameseAdapter.ts's changSinh computation
 * (which reuses iztro's own changesheng12 positions as-is) is untouched.
 */
export const XUYEN_TAM_DIEM_GROWTH_CYCLE_MAP: Record<string, string> = {
  "Trường Sinh": "Xuất Liên",
  "Mộc Dục": "Quán Đỉnh",
  "Quan Đới": "Thúc Đái",
  "Lâm Quan": "Thụ Ký",
  "Đế Vượng": "Tịnh Độ",
  "Suy": "Thoái Sắc",
  "Bệnh": "Ngọa Khám",
  "Tử": "Niết Bàn",
  "Mộ": "Bảo Tháp",
  "Tuyệt": "Phong Động",
  "Thai": "Thác Thai",
  "Dưỡng": "Nhũ Dưỡng",
};

export function getXtdGrowthCycleName(changSinh: string): string {
  return XUYEN_TAM_DIEM_GROWTH_CYCLE_MAP[changSinh] ?? changSinh;
}

/**
 * Xuyen Tam Diem (川三焰) display names for vong Bac Si ("nguoi lam viec
 * trong hang") — keyed by the Vietnamese label palace.boshi already holds
 * (locale/astronomyNames.vi.ts's BOSHI_VI values). Its own map (not merged
 * with taiSuiCycle.ts): "Tieu Hao", "Dai Hao" and "Benh Phu" are ALSO labels
 * of vong Thai Sui, where they mean a different Xuyen Tam Diem name — the two
 * cycles are only ever applied to their own field (boshi vs suiQian), never
 * through one shared string map.
 *
 * Source: user-provided "Xuyen-Tam-Diem.pdf" (2026-09-21), section "Vong Bac
 * Si". The PDF spells "Hi Than"; the engine's own label is "Hỷ Thần" — same
 * star, keyed by the engine's spelling.
 */
export const XUYEN_TAM_DIEM_BOSHI_MAP: Record<string, string> = {
  "Bác Sĩ": "Họa Sư",
  "Lực Sĩ": "Tạc Công",
  "Thanh Long": "Thụy Vân",
  "Tiểu Hao": "Trích Thủy",
  "Tướng Quân": "Hộ Pháp",
  "Tấu Thư": "Tả Kinh",
  "Phi Liêm": "Phong Thần",
  "Hỷ Thần": "Hoan Hỷ",
  "Bệnh Phù": "Cầu Dược",
  "Đại Hao": "Sa Bạo",
  "Phục Binh": "Mai Phục",
  "Quan Phủ": "Tăng Thống",
};

export function getXtdBoshiName(boshi: string): string {
  return XUYEN_TAM_DIEM_BOSHI_MAP[boshi] ?? boshi;
}

/**
 * Xuyen Tam Diem (川三焰) display names for vong Thai Sui ("ngoai duyen go
 * cua hang") — keyed by the CURRENT Vietnamese label palace.suiQian /
 * horoscope.yearly.suiQianByIndex[i] already hold (locale/astronomyNames.vi.ts's
 * SUI_QIAN_VI values, "trung chau" school), NOT by the user's spec's own
 * source names — the spec's names (Thai Sui, Thieu Duong, Thieu Am, Tu Phu,
 * Tue Pha, Phuc Duc, Truc Phu) are a different, more common Vietnamese-book
 * naming school for the SAME 12-position cycle. Confirmed same cycle
 * 2026-09-19 by cross-referencing iztro's own getYearly12() source (a fixed
 * 12-position sequence starting at the subject branch, walking forward) —
 * 5 of 12 positions (Tang Mon, Quan Phu, Long Duc, Bach Ho, Dieu Khach) have
 * IDENTICAL names in both schools at the SAME position, which cannot be
 * coincidence. The remaining 7 were resolved 1:1 with the user directly
 * (2026-09-19 chat) rather than guessed. Do not add a "Tieu Hao" entry to
 * data/tuvi/xuyen-tam-diem/stars.ts — that string means THIS cycle's
 * position 5 here, not a standalone star (see stars.ts's own header note).
 *
 * engine/vietnameseAdapter.ts's suiQian computation (iztro's own suiqian12
 * positions, untouched) is not touched by this file at all.
 */
export const XUYEN_TAM_DIEM_TAI_SUI_MAP: Record<string, string> = {
  "Tuế Kiến": "Đương Khám", // vi tri 0 = Thai Sui / Tue Kien
  "Hối Khí": "Sơ Nhật", // vi tri 1 = Thieu Duong / Hoi Khi
  "Tang Môn": "Phan Tràng", // vi tri 2 — ten trung nhau ca 2 truong phai
  "Quán Sách": "Tàn Nguyệt", // vi tri 3 = Thieu Am / Quan Sach
  "Quan Phù": "Thẩm Nghiệp", // vi tri 4 — ten trung nhau ca 2 truong phai
  "Tiểu Hao": "Hắc Phan", // vi tri 5 = Tu Phu / Tieu Hao
  "Đại Hao": "Liệt Bích", // vi tri 6 = Tue Pha / Dai Hao
  "Long Đức": "Long Hộ", // vi tri 7 — ten trung nhau ca 2 truong phai
  "Bạch Hổ": "Xả Thân", // vi tri 8 — ten trung nhau ca 2 truong phai
  "Thiên Đức": "Thí Xả", // vi tri 9 = Phuc Duc / Thien Duc
  "Điếu Khách": "Viễn Khấu", // vi tri 10 — ten trung nhau ca 2 truong phai
  "Bệnh Phù": "Trị Nhật", // vi tri 11 = Truc Phu / Benh Phu
};

export function getXtdTaiSuiName(suiQian: string): string {
  return XUYEN_TAM_DIEM_TAI_SUI_MAP[suiQian] ?? suiQian;
}

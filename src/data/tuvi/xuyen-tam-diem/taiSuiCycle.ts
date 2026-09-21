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
/**
 * 2026-09-21: vi tri 1 and 3 follow Xuyen-Tam-Diem.pdf's "Bien the phai Trung
 * Chau" table (Hoi Khi -> Mong Tran, Quan Sach -> Cau Toa), NOT the Nam phai
 * names (Thieu Duong -> So Nhat, Thieu Am -> Tan Nguyet) an earlier chat had
 * picked — the engine runs iztro in "zhongzhou" mode (iztroAdapter.ts), so
 * "Hoi Khi"/"Quan Sach" are exactly the labels it emits and the PDF gives
 * them their own Trung Chau names. User confirmed "lam vong Thai Tue nhu
 * file moi" the same day. The 4 other Trung Chau labels (Tue Kien, Tieu Hao,
 * Thien Duc, Benh Phu) have no separate name in the PDF, so they keep the
 * Nam phai position names below.
 */
export const XUYEN_TAM_DIEM_TAI_SUI_MAP: Record<string, string> = {
  "Tuế Kiến": "Đương Khám", // vi tri 0 = Thai Sui / Tue Kien
  "Hối Khí": "Mông Trần", // vi tri 1 = Thieu Duong / Hoi Khi — PDF "bien the Trung Chau"
  "Tang Môn": "Phan Tràng", // vi tri 2 — ten trung nhau ca 2 truong phai
  "Quán Sách": "Câu Tỏa", // vi tri 3 = Thieu Am / Quan Sach — PDF "bien the Trung Chau"
  "Quan Phù": "Thẩm Nghiệp", // vi tri 4 — ten trung nhau ca 2 truong phai
  "Tiểu Hao": "Hắc Phan", // vi tri 5 = Tu Phu / Tieu Hao
  // vi tri 6 = Tue Pha / Dai Hao. The engine runs iztro in "zhongzhou" mode,
  // whose label here is "Tue Pha" (SUI_QIAN_VI's "岁破"), NOT "Dai Hao" —
  // the "Dai Hao" key is only what iztro's default (non-zhongzhou) mode
  // would emit, kept so either variant translates.
  "Tuế Phá": "Liệt Bích",
  "Đại Hao": "Liệt Bích",
  "Long Đức": "Long Hộ", // vi tri 7 — ten trung nhau ca 2 truong phai
  "Bạch Hổ": "Xả Thân", // vi tri 8 — ten trung nhau ca 2 truong phai
  "Thiên Đức": "Thí Xả", // vi tri 9 = Phuc Duc / Thien Duc
  "Điếu Khách": "Viễn Khấu", // vi tri 10 — ten trung nhau ca 2 truong phai
  "Bệnh Phù": "Trị Nhật", // vi tri 11 = Truc Phu / Benh Phu
};

export function getXtdTaiSuiName(suiQian: string): string {
  return XUYEN_TAM_DIEM_TAI_SUI_MAP[suiQian] ?? suiQian;
}

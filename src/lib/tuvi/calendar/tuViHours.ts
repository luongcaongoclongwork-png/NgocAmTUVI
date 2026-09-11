/**
 * The 12 classical Tu Vi double-hours, for the quick-select grid in
 * BirthForm. Each `value` is a representative "HH:mm" that — unchanged —
 * feeds the existing `timeIndexFromHHmm()` in engine/iztroAdapter.ts, so
 * picking a quick button never bypasses or duplicates that mapping.
 *
 * Ty spans the day boundary (23:00-00:59); 23:30 is used as its
 * representative value so it resolves to iztro's "late Ty" (timeIndex 12)
 * half of that range — the free time input remains available for the
 * "early Ty" (00:00-00:59, timeIndex 0) half.
 */
export interface TuViHour {
  key: string;
  label: string;
  range: string;
  /** Representative HH:mm fed into the existing time input / timeIndexFromHHmm. */
  value: string;
}

export const TU_VI_HOURS: TuViHour[] = [
  { key: "ty", label: "Tý", range: "23:00–00:59", value: "23:30" },
  { key: "suu", label: "Sửu", range: "01:00–02:59", value: "02:00" },
  { key: "dan", label: "Dần", range: "03:00–04:59", value: "04:00" },
  { key: "mao", label: "Mão", range: "05:00–06:59", value: "06:00" },
  { key: "thin", label: "Thìn", range: "07:00–08:59", value: "08:00" },
  { key: "ti", label: "Tỵ", range: "09:00–10:59", value: "10:00" },
  { key: "ngo", label: "Ngọ", range: "11:00–12:59", value: "12:00" },
  { key: "mui", label: "Mùi", range: "13:00–14:59", value: "14:00" },
  { key: "than", label: "Thân", range: "15:00–16:59", value: "16:00" },
  { key: "dau", label: "Dậu", range: "17:00–18:59", value: "18:00" },
  { key: "tuat", label: "Tuất", range: "19:00–20:59", value: "20:00" },
  { key: "hoi", label: "Hợi", range: "21:00–22:59", value: "22:00" },
];

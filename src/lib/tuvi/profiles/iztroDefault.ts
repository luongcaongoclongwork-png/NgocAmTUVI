import type { ChartProfile } from "../engine/vietnameseAdapter";

/**
 * Passthrough profile: keeps iztro's own Khoi/Viet placement and its own
 * (7-level, collapsed to 5 for display) brightness. Exists only so
 * tests/vietnameseChart.test.ts can prove the Vietnamese adapter actually
 * changes something (rule R) — never used for real chart rendering.
 */
export const iztroDefaultProfile: ChartProfile = {
  id: "iztro-default",
  khoiViet: null,
  useVietnameseBrightness: false,
  useZhongzhouMenhChu: false,
  fixHuoLingDirection: false,
};

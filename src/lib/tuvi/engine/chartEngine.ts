import { generateVietnameseChart } from "./vietnameseAdapter";
import { generateVietnameseHoroscope } from "./horoscopeAdapter";
import { ngocAmProfile } from "../profiles/ngocAm";
import { vietnamTanBienProfile } from "../profiles/vietnamTanBien";
import { iztroDefaultProfile } from "../profiles/iztroDefault";
import type { BirthInput, VietnameseChartDTO, VietnameseHoroscopeDTO } from "../types/VietnameseChart";

/**
 * "ngoc-am" is the only profile any route ever requests — it's the site's
 * one real house style. "vietnam-tan-bien" and "iztro-default" exist purely
 * so tests can diff ngoc-am's output against iztro's un-overridden defaults
 * (vietnameseChart.test.ts) and prove the Khoi-Viet/brightness overrides
 * actually fire; they are not user-facing alternatives and there is no
 * profile-switcher UI to build here (confirmed 2026-09-14 — see
 * profiles/ngocAm.ts).
 */
const PROFILES = {
  "ngoc-am": ngocAmProfile,
  "vietnam-tan-bien": vietnamTanBienProfile,
  "iztro-default": iztroDefaultProfile,
} as const;

/**
 * Public entry point for the whole module. Components/pages should only ever
 * call this (or read its return value) — never import engine/* or the
 * `iztro` package directly. Defaults to the "ngoc-am" house profile.
 */
export function generateChart(
  input: BirthInput,
  profileId: keyof typeof PROFILES = "ngoc-am",
): VietnameseChartDTO {
  return generateVietnameseChart(input, PROFILES[profileId]);
}

/**
 * Lưu Niên (annual transit) overlay for a chart already produced by
 * `generateChart` — must be called with the SAME `profileId` or the
 * overlay will silently desync from the chart (see horoscopeAdapter.ts).
 */
export function generateHoroscope(
  input: BirthInput,
  targetYear: number,
  profileId: keyof typeof PROFILES = "ngoc-am",
): VietnameseHoroscopeDTO {
  return generateVietnameseHoroscope(input, PROFILES[profileId], targetYear);
}

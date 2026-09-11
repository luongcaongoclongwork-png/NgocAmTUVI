import { generateVietnameseChart } from "./vietnameseAdapter";
import { ngocAmProfile } from "../profiles/ngocAm";
import { vietnamTanBienProfile } from "../profiles/vietnamTanBien";
import { iztroDefaultProfile } from "../profiles/iztroDefault";
import type { BirthInput, VietnameseChartDTO } from "../types/VietnameseChart";

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

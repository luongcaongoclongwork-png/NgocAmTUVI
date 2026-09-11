import type { EarthlyBranchVi } from "../types/VietnameseChart";

export * from "./astronomyNames.vi";
export * from "./palaceNames.vi";
export * from "./starNames.vi";

/**
 * Palace-index anchor used throughout this module: index 0 = Dan, matching
 * iztro's own internal palace.index convention 1:1 (verified against
 * node_modules/iztro@2.6.1/lib/astro/astro.js — `earthlyBranchOfPalace =
 * EARTHLY_BRANCHES[fixIndex(2 + i)]`, i.e. iztro already anchors its palace
 * loop at Dan). This is also exactly the grid order spec section K asks for,
 * so no remapping is needed between iztro's palace.index and the Vietnamese
 * layout grid — see rules/palaces.ts.
 */
export const BRANCH_ORDER: EarthlyBranchVi[] = [
  "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi",
  "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu",
];

export function branchIndex(branch: EarthlyBranchVi): number {
  return BRANCH_ORDER.indexOf(branch);
}

export function branchAt(index: number): EarthlyBranchVi {
  return BRANCH_ORDER[((index % 12) + 12) % 12];
}

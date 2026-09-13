import { MAJOR_STAR_BRIGHTNESS_VI, MINOR_STAR_BRIGHTNESS_VI } from "@/data/tuvi/vietnamese-brightness";
import type { EarthlyBranchVi, VietnameseBrightness } from "../types/VietnameseChart";

export interface BrightnessLookup {
  brightness?: VietnameseBrightness;
  sourceNeeded: boolean;
}

/**
 * Vietnamese brightness lookup — deliberately independent of whatever
 * brightness iztro itself computed for this star (rule F / X.4). The 14
 * major stars are fully source-verified (see MAJOR_STAR_BRIGHTNESS_VI); the
 * 6 sat tinh + Van Xuong/Van Khuc are verified only for the specific branches
 * checked so far (see MINOR_STAR_BRIGHTNESS_VI) — every other (star, branch)
 * pair returns `sourceNeeded: true` with no invented value.
 */
export function lookupBrightness(starId: string, branch: EarthlyBranchVi): BrightnessLookup {
  const row = MAJOR_STAR_BRIGHTNESS_VI[starId] ?? MINOR_STAR_BRIGHTNESS_VI[starId];
  if (!row) return { sourceNeeded: true };
  const brightness = row[branch];
  if (!brightness) return { sourceNeeded: true };
  return { brightness, sourceNeeded: false };
}

export const BRIGHTNESS_VERIFIED_STAR_IDS = new Set([
  ...Object.keys(MAJOR_STAR_BRIGHTNESS_VI),
  ...Object.keys(MINOR_STAR_BRIGHTNESS_VI),
]);

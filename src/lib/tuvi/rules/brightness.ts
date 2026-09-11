import { MAJOR_STAR_BRIGHTNESS_VI } from "@/data/tuvi/vietnamese-brightness";
import type { EarthlyBranchVi, VietnameseBrightness } from "../types/VietnameseChart";

export interface BrightnessLookup {
  brightness?: VietnameseBrightness;
  sourceNeeded: boolean;
}

/**
 * Vietnamese brightness lookup — deliberately independent of whatever
 * brightness iztro itself computed for this star (rule F / X.4). Only the 14
 * major stars are source-verified today (see data/tuvi/vietnamese-brightness.ts);
 * every other star id returns `sourceNeeded: true` with no invented value.
 */
export function lookupBrightness(starId: string, branch: EarthlyBranchVi): BrightnessLookup {
  const row = MAJOR_STAR_BRIGHTNESS_VI[starId];
  if (!row) return { sourceNeeded: true };
  const brightness = row[branch];
  if (!brightness) return { sourceNeeded: true };
  return { brightness, sourceNeeded: false };
}

export const BRIGHTNESS_VERIFIED_STAR_IDS = new Set(Object.keys(MAJOR_STAR_BRIGHTNESS_VI));

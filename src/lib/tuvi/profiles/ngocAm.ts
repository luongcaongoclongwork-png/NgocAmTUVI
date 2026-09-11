import type { ChartProfile } from "../engine/vietnameseAdapter";
import { vietnamTanBienProfile } from "./vietnamTanBien";

/**
 * Ngoc Am's own house profile. Currently inherits vietnam-tan-bien entirely
 * (per spec: "Hien tai ngoc-am ke thua vietnam-tan-bien") — this is the
 * default profile for the website (chartEngine.ts).
 */
export const ngocAmProfile: ChartProfile = {
  ...vietnamTanBienProfile,
  id: "ngoc-am",
};

import type { ChartProfile } from "../engine/vietnameseAdapter";
import { vietnamTanBienProfile } from "./vietnamTanBien";

/**
 * Ngoc Am's house profile. "Ngoc Am" is a BRAND, not a distinct astrology
 * school — this profile inherits vietnam-tan-bien entirely and is not a
 * stub waiting to diverge (confirmed 2026-09-14). There is no independent
 * "Nam Phai" ruleset behind this id; the site follows the Tan Bien /
 * Van Dang Thai Thu Lang tradition and always will unless that decision is
 * explicitly revisited. Do not build a profile switcher UI around this —
 * see chartEngine.ts for why iztro-default/vietnam-tan-bien stay
 * test-only.
 */
export const ngocAmProfile: ChartProfile = {
  ...vietnamTanBienProfile,
  id: "ngoc-am",
};

/**
 * Presentation-only density score for one palace cell. This has nothing to
 * do with Tu Vi meaning — it only counts how many text items PalaceCell is
 * about to render, so the CSS can shrink type/spacing a notch on crowded
 * palaces instead of overflowing. Never used to decide star placement,
 * brightness, or any astrology fact.
 */
export type PalaceDensity = "airy" | "normal" | "dense" | "packed";

export function getPalaceDensity({
  majorCount,
  minorCount,
  adjectiveCount,
  annualCount,
}: {
  majorCount: number;
  minorCount: number;
  adjectiveCount: number;
  annualCount: number;
}): PalaceDensity {
  // adjectiveCount weight raised from 0.55 — every palace now always carries
  // 2 more items here (natal suiQian/jiangQian, see PalaceCell.tsx), so the
  // old weight under-counted real crowding on cells that were already
  // adjective-heavy (e.g. No Boc content touching the Dai Van footer,
  // "chạm đại vận" feedback 2026-09-13).
  const score = majorCount * 2.4 + minorCount + adjectiveCount * 0.7 + annualCount * 0.65;

  if (score <= 8) return "airy";
  if (score <= 13) return "normal";
  if (score <= 18) return "dense";
  return "packed";
}

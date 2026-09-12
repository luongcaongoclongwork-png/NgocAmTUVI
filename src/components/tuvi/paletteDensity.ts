/**
 * Presentation-only density score for one palace cell. This has nothing to
 * do with Tu Vi meaning — it only counts how many text items PalaceCell is
 * about to render, so the CSS can shrink type/spacing a notch on crowded
 * palaces instead of overflowing. Never used to decide star placement,
 * brightness, or any astrology fact.
 */
export type PalaceVisualDensity = "airy" | "normal" | "dense" | "packed";

export function getPalaceVisualDensity({
  majorCount,
  minorCount,
  extraCount = 0,
}: {
  majorCount: number;
  minorCount: number;
  extraCount?: number;
}): PalaceVisualDensity {
  const score = majorCount * 2.2 + minorCount + extraCount * 0.75;

  if (score <= 7) return "airy";
  if (score <= 11) return "normal";
  if (score <= 15) return "dense";
  return "packed";
}

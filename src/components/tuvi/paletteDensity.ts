/**
 * Presentation-only density score for one palace cell. This has nothing to
 * do with Tu Vi meaning — it only counts how many text items PalaceCell is
 * about to render, so the CSS can shrink type/spacing a notch on crowded
 * palaces instead of overflowing. Never used to decide star placement,
 * brightness, or any astrology fact.
 */
export type PalaceDensity = "airy" | "normal" | "dense" | "packed";

export interface PalaceContentCounts {
  majorCount: number;
  minorCount: number;
  adjectiveCount: number;
  annualCount: number;
}

// adjectiveCount weight raised from 0.55 — every palace now always carries
// 1 more item here (natal suiQian, see PalaceCell.tsx — jiangQian was
// removed 2026-09-19, see locale/astronomyNames.vi.ts), so the
// old weight under-counted real crowding on cells that were already
// adjective-heavy (e.g. No Boc content touching the Dai Van footer,
// "chạm đại vận" feedback 2026-09-13).
//
// annualCount weight raised from 0.65 to 0.8 (now closer to
// adjectiveCount's own 0.7) — palace-luu-stars renders as a 2-column grid
// now (same layout as palace-adjective-stars, see PalaceCell.tsx), so an
// annual item costs roughly the same vertical space as an adjective one;
// 0.65 was calibrated back when it was one joined text line and
// under-weighted palaces like Dien Trach, whose Luu Nien block kept
// touching the footer even after that layout change ("sao lưu... đè lên
// số" feedback 2026-09-15). Only affects palaces with an active "nam
// xem" overlay (annualCount is 0 otherwise).
//
// Exported (not just used internally) so chartRowLayout.ts can reallocate
// grid ROW height using the exact same weighting instead of a second,
// independently-drifting magic-number formula — see that file's header
// comment for why row height needed its own pass on top of this.
//
// majorCount is floored at 1 for SCORING purposes only (never for the real
// star data/rendering) — a palace with 0 real major stars still renders the
// "Vô Chính Diệu" placeholder line in .palace-main-stars, taking real
// vertical space, so literally scoring it as 0 silently underweighted the
// whole palace by a full major-star's worth (2.4). Found 2026-09-15: a real
// chart's Quan Lộc (0 major, 4 minor, 5 adjective, 4 annual = 13 star-like
// items) scored only 10.7 ("normal", no font-shrink) instead of >13
// ("dense") purely because of this, and was overflowing on both print AND
// the live web chart as a result — independent of, and pre-existing
// before, chartRowLayout.ts's row reallocation (confirmed by A/B testing
// with that feature on vs off).
export function getPalaceRawScore({ majorCount, minorCount, adjectiveCount, annualCount }: PalaceContentCounts): number {
  return Math.max(majorCount, 1) * 2.4 + minorCount + adjectiveCount * 0.7 + annualCount * 0.8;
}

export function getPalaceDensity(counts: PalaceContentCounts): PalaceDensity {
  const score = getPalaceRawScore(counts);
  if (score <= 8) return "airy";
  if (score <= 13) return "normal";
  if (score <= 18) return "dense";
  return "packed";
}

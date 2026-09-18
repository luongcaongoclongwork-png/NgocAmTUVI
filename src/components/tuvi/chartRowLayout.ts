import { BRANCH_GRID_POSITION } from "@/lib/tuvi/rules/palaces";
import { getPalaceRawScore } from "./paletteDensity";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Reallocates the chart's 4 grid ROWS unevenly instead of the fixed equal
 * 25/25/25/25 split — the row holding a crowded palace (many Luu Nien stars
 * especially — see paletteDensity.ts's own history of chasing this same
 * class of bug) gets more of the SAME total height, a quiet row gives up
 * the slack it wasn't using. Inspired directly by tuvi.vn's own chart,
 * which renders as a real HTML table whose rows auto-size to content — see
 * docs/tuvi-engine-audit.md for the investigation and the "F + D" plan this
 * implements. Columns stay uniform (4 equal columns); only rows change.
 *
 * This is a pure function of chart + horoscope data, computed once per
 * render before paint — NOT a ResizeObserver/measured-after-layout
 * approach, so it's identical between server and client and costs nothing
 * to run before the print route's own real DOM measurement pass
 * (usePrintOverflowGuard.ts) gets a chance to run: this reallocation is
 * the FIRST line of defense (starts every cell as close to already-fitting
 * as a pure, no-measurement pass can get it), that hook is the safety net
 * underneath it for whatever's still too tall afterward. Now used by print
 * too (re-enabled 2026-09-19 alongside that hook — see this file's own git
 * history / docs/tuvi-engine-audit.md section 7 for why it was print-only
 * disabled from 2026-09-15 until then: on its own it helped one benchmark
 * chart but made a more extreme one worse, which the measurement pass now
 * catches instead).
 *
 * The chart's OUTER footprint is unchanged (desktop keeps its aspect-ratio
 * square, print keeps its fixed 190mm square) — this only redistributes
 * space that already exists between the 4 rows, so callers that don't opt
 * in (the mobile virtual canvas) keep today's exact equal-quarters
 * behavior untouched.
 */

export interface RowLayout {
  /** 4 row heights in %, summing to 100. */
  heights: [number, number, number, number];
  /** Cumulative row boundaries in % (0, after row1, after row2, after row3, 100) — what StructuralGridSVG/AspectOverlay/TuanTrietOverlay need to draw at the real edges instead of assumed uniform quarters. */
  boundaries: [number, number, number, number, number];
}

/** Every row gets at least this much — keeps an all-empty row from collapsing to near-nothing even under extreme skew elsewhere. */
const MIN_ROW_PCT = 19;

/** Flat baseline all 4 rows start from, before content. Kept modest relative to a typical palace's own raw score (~11, see getPalaceRawScore) so content differences actually swing the split — a bigger baseline dilutes them into an almost-flat 25/25/25/25 again, defeating the point. */
const ROW_BASELINE = 5;

/** Extra baseline for rows 2 & 3 only — they also carry the Trung Cung's own fairly constant height need (name/date/cuc/etc fields), which rows 1 & 4 never have to share space with.
 *
 * Kept deliberately small: rows 2 & 3 only ever hold 2 outer palaces each
 * (vs. 4 for rows 1 & 4), so a bigger bonus steals real, needed room from
 * whichever 4-palace row happens to hold this chart's actual densest
 * content. Tuned empirically on print (tighter absolute budget than web,
 * so where this tradeoff shows up first) against the "Trang"
 * 2026-09-15 benchmark, which has one dense row-3 palace (Mệnh, 2 major
 * stars) AND one dense row-4 palace (Huynh Đệ, heavy Lưu Niên) at the same
 * time: bonus=4 fixed Mệnh's row but pushed Huynh Đệ's from -9.5px slack
 * into +17.9px real overflow; bonus=1 leaves both with only single-digit
 * px residual overlap (Mệnh ~11px, Huynh Đệ ~5px) — worse than a perfect
 * fix, clearly better than either extreme. That residual (and any other
 * chart's, however much worse) is now closed for real by
 * usePrintOverflowGuard.ts's per-cell measure-and-shrink pass on top of
 * this row split, not just clipped away under the footer — see that
 * file and docs/tuvi-engine-audit.md section 7 for the full history. */
const CENTER_ROW_BONUS = 1;

const DEFAULT_BOUNDARIES: [number, number, number, number, number] = [0, 25, 50, 75, 100];
export const UNIFORM_ROW_LAYOUT: RowLayout = { heights: [25, 25, 25, 25], boundaries: DEFAULT_BOUNDARIES };

function countsFor(
  palace: VietnameseChartDTO["palaces"][number],
  horoscope: VietnameseHoroscopeDTO | null,
): { majorCount: number; minorCount: number; adjectiveCount: number; annualCount: number } {
  const majorCount = palace.majorStars.length;
  const minorCount = palace.supportStars.length + palace.maleficStars.length;
  const natalCycleCount = palace.suiQian ? 1 : 0;
  const adjectiveCount = palace.adjectiveStars.length + natalCycleCount;
  const annualCount = horoscope
    ? horoscope.yearly.starsByIndex[palace.index].length +
      (horoscope.yearly.suiQianByIndex[palace.index] ? 1 : 0)
    : 0;
  return { majorCount, minorCount, adjectiveCount, annualCount };
}

export function computeRowLayout(chart: VietnameseChartDTO, horoscope: VietnameseHoroscopeDTO | null): RowLayout {
  const rowMaxScore = [0, 0, 0, 0]; // index 0..3 = row 1..4
  for (const palace of chart.palaces) {
    const { row } = BRANCH_GRID_POSITION[palace.branch];
    const score = getPalaceRawScore(countsFor(palace, horoscope));
    if (score > rowMaxScore[row - 1]) rowMaxScore[row - 1] = score;
  }

  const rawWeights = rowMaxScore.map((max, i) => ROW_BASELINE + (i === 1 || i === 2 ? CENTER_ROW_BONUS : 0) + max);
  const total = rawWeights.reduce((a, b) => a + b, 0);
  let heights = rawWeights.map((w) => (w / total) * 100);

  // Floor + renormalize: if any row fell under the minimum, give it the
  // floor and shrink the others proportionally so the total still sums to
  // exactly 100 (grid-template-rows percentages must add up cleanly).
  if (heights.some((h) => h < MIN_ROW_PCT)) {
    const flooredIdx = new Set(heights.map((h, i) => (h < MIN_ROW_PCT ? i : -1)).filter((i) => i >= 0));
    const remaining = 100 - flooredIdx.size * MIN_ROW_PCT;
    const freeTotal = heights.reduce((sum, h, i) => (flooredIdx.has(i) ? sum : sum + h), 0);
    heights = heights.map((h, i) => (flooredIdx.has(i) ? MIN_ROW_PCT : freeTotal > 0 ? (h / freeTotal) * remaining : remaining / (4 - flooredIdx.size)));
  }

  const [h1, h2, h3, h4] = heights as [number, number, number, number];
  const boundaries: [number, number, number, number, number] = [0, h1, h1 + h2, h1 + h2 + h3, 100];
  return { heights: [h1, h2, h3, h4], boundaries };
}

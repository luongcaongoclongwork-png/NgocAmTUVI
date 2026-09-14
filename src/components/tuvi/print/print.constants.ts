/**
 * Presentation-only geometry for the A4 print renderer. No astrology data,
 * no chart calculation — see rule 0 in the task spec this file implements.
 */
export const PRINT_A4 = {
  widthMm: 210,
  heightMm: 297,
  // 7mm (down from 10mm) — user tested this margin on their own printer
  // with no clipping before approving it (2026-09-16).
  pageMarginMm: 7,
  safeWidthMm: 196,
  safeHeightMm: 283,
  chartSizeMm: 190,
} as const;

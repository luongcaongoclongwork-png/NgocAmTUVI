/**
 * Presentation-only geometry for the A4 print renderer. No astrology data,
 * no chart calculation — see rule 0 in the task spec this file implements.
 */
export const PRINT_A4 = {
  widthMm: 210,
  heightMm: 297,
  pageMarginMm: 10,
  safeWidthMm: 190,
  safeHeightMm: 277,
  chartSizeMm: 184,
} as const;

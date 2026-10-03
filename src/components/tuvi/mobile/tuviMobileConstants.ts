/**
 * Presentation-only virtual canvas the mobile chart experience renders at
 * full size, then CSS-scales down to fit the viewport (see
 * MobileScaleViewport.tsx). Never touched by engine/calculation code — this
 * is purely a layout constant so 747/1240 isn't repeated across files (1032
 * until 2026-10-03, when the stars on a phone got one larger size).
 */
export const MOBILE_TUVI_CANVAS = {
  width: 747,
  height: 1240,
  columns: 4,
  rows: 4,
} as const;

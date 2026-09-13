/**
 * Presentation-only virtual canvas the mobile chart experience renders at
 * full size, then CSS-scales down to fit the viewport (see
 * MobileScaleViewport.tsx). Never touched by engine/calculation code — this
 * is purely a layout constant so 747/1032 isn't repeated across files.
 */
export const MOBILE_TUVI_CANVAS = {
  width: 747,
  height: 1032,
  columns: 4,
  rows: 4,
} as const;

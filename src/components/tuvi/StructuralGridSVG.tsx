/**
 * The ONE owner of every grid line on the chart (outer frame + the 4x4
 * cross with the 2x2 Trung Cung hole). PalaceCell no longer draws its own
 * border-right/border-bottom — two adjacent cells drawing their own edges
 * used to occasionally double up or gap by a subpixel at certain zoom
 * levels; a single vector-effect="non-scaling-stroke" SVG removes that
 * class of bug entirely. Purely decorative (aria-hidden) — no data, no
 * palace positions computed here (those still come from
 * rules/palaces.ts / BRANCH_GRID_POSITION, used only by PalaceCell/
 * TuViChartGrid for actual content placement).
 *
 * Columns are always uniform quarters (25/50/75), so the 2 vertical lines
 * stay hardcoded. Rows are NOT always uniform once a caller opts into
 * chartRowLayout.ts's content-weighted reallocation (see
 * TuViChartGrid.tsx) — `rowBoundaries` carries the real 4 row edges
 * (defaults to the plain 0/25/50/75/100 quarters for every caller that
 * doesn't, i.e. the mobile virtual canvas, unchanged from before).
 */
export default function StructuralGridSVG({
  rowBoundaries = [0, 25, 50, 75, 100],
}: {
  rowBoundaries?: [number, number, number, number, number];
}) {
  const [, r1, r2, r3] = rowBoundaries;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="tuvi-structural-grid" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" fill="none" className="tuvi-structural-grid__frame" vectorEffect="non-scaling-stroke" />

      {/* Vertical lines: x=25 and x=75 run the full height; x=50 breaks across the Trung Cung (row edges r1-r3). */}
      <line x1="25" y1="0" x2="25" y2="100" vectorEffect="non-scaling-stroke" />
      <line x1="75" y1="0" x2="75" y2="100" vectorEffect="non-scaling-stroke" />
      <line x1="50" y1="0" x2="50" y2={r1} vectorEffect="non-scaling-stroke" />
      <line x1="50" y1={r3} x2="50" y2="100" vectorEffect="non-scaling-stroke" />

      {/* Horizontal lines: same pattern, at the real row edges. */}
      <line x1="0" y1={r1} x2="100" y2={r1} vectorEffect="non-scaling-stroke" />
      <line x1="0" y1={r3} x2="100" y2={r3} vectorEffect="non-scaling-stroke" />
      <line x1="0" y1={r2} x2="25" y2={r2} vectorEffect="non-scaling-stroke" />
      <line x1="75" y1={r2} x2="100" y2={r2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

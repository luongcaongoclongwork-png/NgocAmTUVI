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
 */
export default function StructuralGridSVG() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="tuvi-structural-grid" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" fill="none" className="tuvi-structural-grid__frame" vectorEffect="non-scaling-stroke" />

      {/* Vertical lines: x=25 and x=75 run the full height; x=50 breaks across the Trung Cung (25-75). */}
      <line x1="25" y1="0" x2="25" y2="100" vectorEffect="non-scaling-stroke" />
      <line x1="75" y1="0" x2="75" y2="100" vectorEffect="non-scaling-stroke" />
      <line x1="50" y1="0" x2="50" y2="25" vectorEffect="non-scaling-stroke" />
      <line x1="50" y1="75" x2="50" y2="100" vectorEffect="non-scaling-stroke" />

      {/* Horizontal lines: same pattern. */}
      <line x1="0" y1="25" x2="100" y2="25" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="75" x2="100" y2="75" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="50" x2="25" y2="50" vectorEffect="non-scaling-stroke" />
      <line x1="75" y1="50" x2="100" y2="50" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

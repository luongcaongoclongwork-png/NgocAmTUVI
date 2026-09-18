import { BRANCH_GRID_POSITION } from "@/lib/tuvi/rules/palaces";
import type { EarthlyBranchVi, TuanTrietZone } from "@/lib/tuvi/types/VietnameseChart";

/** Row/column edges default to plain uniform quarters for callers that don't opt into a non-uniform layout (chartRowLayout.ts for rows; PrintChart.tsx's narrower Trung Cung for columns — see print.css's comment on `.ngoc-am-grid`). */
const DEFAULT_ROW_BOUNDARIES: [number, number, number, number, number] = [0, 25, 50, 75, 100];
const DEFAULT_COLUMN_BOUNDARIES: [number, number, number, number, number] = [0, 25, 50, 75, 100];

function rowCenterPct(row: number, rowBoundaries: readonly number[]): number {
  return (rowBoundaries[row - 1] + rowBoundaries[row]) / 2;
}

function colCenterPct(col: number, columnBoundaries: readonly number[]): number {
  return (columnBoundaries[col - 1] + columnBoundaries[col]) / 2;
}

/** How far along the shared boundary (0 = its start, 1 = its end) a zone
 * label sits, instead of the row/column's exact center — see the 2 offset
 * constants below for why these two specific values. */
function edgeOffsetPct(index: number, boundaries: readonly number[], t: number): number {
  return boundaries[index - 1] + t * (boundaries[index] - boundaries[index - 1]);
}

/** Two consecutive branches (any Tuan/Triet zone) are always either same-
 * row (a shared VERTICAL boundary, spanning that row's full height) or
 * same-column (a shared HORIZONTAL boundary, spanning that column's full
 * width) — verified against all 12 branches' BRANCH_GRID_POSITION, no
 * diagonal case exists. The label used to sit at that boundary's exact
 * midpoint, which is also where a palace's own centered main-stars (or,
 * for the 2-column phụ tinh/lưu niên grids, either edge) most often has
 * real text — measured live 2026-09-19 across 9 web charts (15 zone
 * labels): only 47% landed collision-free at the midpoint. Moving along
 * the SAME boundary (not off it — still visually reads as "this edge")
 * to a row-relative 20% (near the row's own top/header, which only ever
 * holds a short branch letter + 1-2 digit index) or a column-relative
 * 85% (near a column's right edge — phụ tinh/lưu niên text is
 * left-aligned within its cell, so the right side stays clearest) raised
 * that to 100% on the web sample, cross-checked live on the mobile
 * virtual canvas too (same shared component, no separate fix needed).
 *
 * Print does NOT reuse the row offset unchanged — its own measurement
 * (6 print charts, same day) found 20% only collision-free 40% of the
 * time there, because print's per-row proportions (narrower Trung Cung
 * columns, mm-based type/padding scale) sit differently than web's;
 * 90% measured 80-100% collision-free on print instead. Print DOES reuse
 * the 85% column offset (checked separately, held up there too) — see
 * DEFAULT_ROW_EDGE_OFFSET vs PRINT_ROW_EDGE_OFFSET below and
 * PrintChart.tsx, which is the only caller overriding it. Picked ONE
 * fixed offset per orientation per surface on purpose, not a per-chart
 * measured position — every chart on a given surface places its
 * Tuan/Triet labels the same relative way, so nothing "jumps around"
 * between charts. */
export const DEFAULT_ROW_EDGE_OFFSET = 0.2;
export const PRINT_ROW_EDGE_OFFSET = 0.9;
const COLUMN_EDGE_OFFSET = 0.85;

function midpoint(
  a: EarthlyBranchVi,
  b: EarthlyBranchVi,
  rowBoundaries: readonly number[],
  columnBoundaries: readonly number[],
  rowEdgeOffset: number,
) {
  const pa = BRANCH_GRID_POSITION[a];
  const pb = BRANCH_GRID_POSITION[b];
  if (pa.row === pb.row) {
    return {
      xPct: (colCenterPct(pa.col, columnBoundaries) + colCenterPct(pb.col, columnBoundaries)) / 2,
      yPct: edgeOffsetPct(pa.row, rowBoundaries, rowEdgeOffset),
    };
  }
  return {
    xPct: edgeOffsetPct(pa.col, columnBoundaries, COLUMN_EDGE_OFFSET),
    yPct: (rowCenterPct(pa.row, rowBoundaries) + rowCenterPct(pb.row, rowBoundaries)) / 2,
  };
}

/** Same 2-branch span regardless of array order (e.g. Tuan=[Than,Dau] vs Triet=[Dau,Than] still "dong cung"). */
function sameZone(a: TuanTrietZone, b: TuanTrietZone): boolean {
  const [a0, a1] = a.branches;
  const [b0, b1] = b.branches;
  return (a0 === b0 && a1 === b1) || (a0 === b1 && a1 === b0);
}

function ZoneLabel({
  label,
  zone,
  className,
  rowBoundaries,
  columnBoundaries,
  rowEdgeOffset,
}: {
  label: string;
  zone: TuanTrietZone;
  className: string;
  rowBoundaries: readonly number[];
  columnBoundaries: readonly number[];
  rowEdgeOffset: number;
}) {
  const { xPct, yPct } = midpoint(zone.branches[0], zone.branches[1], rowBoundaries, columnBoundaries, rowEdgeOffset);
  return (
    <span
      className={`tracking-label pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border px-1 text-[9px] font-semibold uppercase ${className}`}
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
    >
      {label}
    </span>
  );
}

export default function TuanTrietOverlay({
  tuan,
  triet,
  rowBoundaries = DEFAULT_ROW_BOUNDARIES,
  columnBoundaries = DEFAULT_COLUMN_BOUNDARIES,
  rowEdgeOffset = DEFAULT_ROW_EDGE_OFFSET,
}: {
  tuan: TuanTrietZone;
  triet: TuanTrietZone;
  /** Real row edges (0-100) from chartRowLayout.ts — defaults to plain uniform quarters for callers that don't opt in (mobile virtual canvas). */
  rowBoundaries?: [number, number, number, number, number];
  /** Real column edges (0-100) — see TuViChartGrid.tsx / PrintChart.tsx. Defaults to plain uniform quarters for every caller except print. */
  columnBoundaries?: [number, number, number, number, number];
  /** Where a same-row zone label sits along its row (0-1) — see DEFAULT_ROW_EDGE_OFFSET/PRINT_ROW_EDGE_OFFSET above. Only PrintChart.tsx overrides this; every other caller keeps the web-tuned default. */
  rowEdgeOffset?: number;
}) {
  // "Tuan Triet dong cung" (e.g. a Giap Tuat year: both fall on Than-Dau) —
  // the two zone labels would sit at the exact same xPct/yPct and the DOM's
  // later element (Triet) would paint over the earlier one (Tuan), making
  // Tuan silently disappear even though chart.tuan is computed correctly.
  // Render one combined pill instead of two coincident ones so both stay
  // legible. Purely a rendering fix — tuan/triet are still whatever
  // rules/tuanTriet.ts (unchanged) computed.
  if (sameZone(tuan, triet)) {
    const { xPct, yPct } = midpoint(tuan.branches[0], tuan.branches[1], rowBoundaries, columnBoundaries, rowEdgeOffset);
    return (
      <div className="pointer-events-none absolute inset-0 z-10">
        <span
          className="tracking-label pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-walnut/40 bg-ivory px-1 text-[9px] font-semibold uppercase"
          style={{ left: `${xPct}%`, top: `${yPct}%` }}
        >
          <span className="text-sage">Tuần</span>
          <span className="text-walnut/50"> · </span>
          <span className="text-lacquer">Triệt</span>
        </span>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <ZoneLabel label="Tuần" zone={tuan} className="border-sage/50 bg-ivory text-sage" rowBoundaries={rowBoundaries} columnBoundaries={columnBoundaries} rowEdgeOffset={rowEdgeOffset} />
      <ZoneLabel label="Triệt" zone={triet} className="border-lacquer/50 bg-ivory text-lacquer" rowBoundaries={rowBoundaries} columnBoundaries={columnBoundaries} rowEdgeOffset={rowEdgeOffset} />
    </div>
  );
}

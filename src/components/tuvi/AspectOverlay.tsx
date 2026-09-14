import { BRANCH_GRID_POSITION } from "@/lib/tuvi/rules/palaces";
import { tamHopIndices, xungChieuIndex, giapCungIndices } from "@/lib/tuvi/rules/aspects";
import type { VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Design tokens for the three relation-line styles (spec section M) — very
 * light so they read as a quiet indicator, not a graphic element. Each
 * relation gets its own dash PATTERN, not just its own color, so the
 * distinction still reads for colorblind viewers: tam hợp = long dashes,
 * xung chiếu = solid, giáp cung = dots.
 */
// Coordinates moved from a 0-4 to a 0-100 viewBox (see rectOf/COL_EDGES
// below — needed so row edges from chartRowLayout.ts, already expressed as
// 0-100 percentages, can be used directly without a second unit
// conversion) — width/dasharray scaled up 25x (100/4) to keep the exact
// same rendered thickness as before.
const LINE_STYLE = {
  tamHop: { stroke: "var(--color-gold)", dasharray: "0.875 1.125", width: 0.175 },
  xungChieu: { stroke: "var(--color-lacquer)", dasharray: undefined, width: 0.2 },
  giapCung: { stroke: "#45684c", dasharray: "0.15 0.5", width: 0.175 },
};

interface Point {
  x: number;
  y: number;
}

interface Rect {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

/** Columns are always uniform quarters; only row edges vary (see chartRowLayout.ts). Everything below is expressed on a shared 0-100 scale on both axes (not 0-4) so row/col math can mix freely. */
const COL_EDGES = [0, 25, 50, 75, 100];

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

function rectOf(palace: VietnamesePalace, rowBoundaries: readonly number[]): Rect {
  const { row, col } = BRANCH_GRID_POSITION[palace.branch];
  return { xmin: COL_EDGES[col - 1], xmax: COL_EDGES[col], ymin: rowBoundaries[row - 1], ymax: rowBoundaries[row] };
}

/**
 * The point where a palace's cell touches the Trung Cung rectangle (its
 * shared edge midpoint, or shared corner for the 4 corner palaces). Because
 * this point sits exactly on the (convex) Trung Cung boundary, any straight
 * line drawn between two such points never leaves the Trung Cung — so rays
 * can never visually cross another palace's cell.
 */
function centerAnchor(rect: Rect, centerRect: Rect): Point {
  const cx = clamp((rect.xmin + rect.xmax) / 2, centerRect.xmin, centerRect.xmax);
  const cy = clamp((rect.ymin + rect.ymax) / 2, centerRect.ymin, centerRect.ymax);
  if (rect.ymax <= centerRect.ymin) return { x: cx, y: centerRect.ymin }; // above
  if (rect.ymin >= centerRect.ymax) return { x: cx, y: centerRect.ymax }; // below
  if (rect.xmax <= centerRect.xmin) return { x: centerRect.xmin, y: cy }; // left
  return { x: centerRect.xmax, y: cy }; // right
}

export default function AspectOverlay({
  palaces,
  selectedIndex,
  rowBoundaries = [0, 25, 50, 75, 100],
}: {
  palaces: VietnamesePalace[];
  selectedIndex: number | null;
  /** Real row edges (0-100) from chartRowLayout.ts — defaults to plain uniform quarters for callers that don't opt in (mobile virtual canvas). */
  rowBoundaries?: [number, number, number, number, number];
}) {
  if (selectedIndex === null) return null;

  const selected = palaces.find((p) => p.index === selectedIndex);
  if (!selected) return null;

  /** Trung Cung occupies grid lines 2/2/4/4 — see rules/palaces.ts CENTER_GRID_AREA — i.e. rows 2-3, cols 2-3 on the real (possibly non-uniform) edges. */
  const centerRect: Rect = { xmin: COL_EDGES[1], xmax: COL_EDGES[3], ymin: rowBoundaries[1], ymax: rowBoundaries[3] };

  const [tamHopA, tamHopB] = tamHopIndices(selectedIndex);
  const xungChieu = xungChieuIndex(selectedIndex);
  const [giapA, giapB] = giapCungIndices(selectedIndex);

  // A single shared origin for every ray (rule: "cac tia chieu bat dau tu 1 diem").
  const origin = centerAnchor(rectOf(selected, rowBoundaries), centerRect);

  const lines = [
    { to: palaces.find((p) => p.index === tamHopA), style: LINE_STYLE.tamHop },
    { to: palaces.find((p) => p.index === tamHopB), style: LINE_STYLE.tamHop },
    { to: palaces.find((p) => p.index === xungChieu), style: LINE_STYLE.xungChieu },
    { to: palaces.find((p) => p.index === giapA), style: LINE_STYLE.giapCung },
    { to: palaces.find((p) => p.index === giapB), style: LINE_STYLE.giapCung },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {lines.map((line, i) => {
        if (!line.to) return null;
        const end = centerAnchor(rectOf(line.to, rowBoundaries), centerRect);
        return (
          <line
            key={i}
            x1={origin.x}
            y1={origin.y}
            x2={end.x}
            y2={end.y}
            stroke={line.style.stroke}
            strokeWidth={line.style.width}
            strokeDasharray={line.style.dasharray}
            strokeLinecap="round"
            opacity={0.55}
          />
        );
      })}
    </svg>
  );
}

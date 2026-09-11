import { BRANCH_GRID_POSITION } from "@/lib/tuvi/rules/palaces";
import { tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import type { VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";

/** Design tokens for the two relation-line styles (spec section M) — very light so they read as a quiet indicator, not a graphic element. */
const LINE_STYLE = {
  tamHop: { stroke: "var(--color-gold)", dasharray: "0.035 0.045", width: 0.007 },
  xungChieu: { stroke: "var(--color-lacquer)", dasharray: undefined, width: 0.008 },
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

/** Trung Cung occupies grid lines 2/2/4/4 — see rules/palaces.ts CENTER_GRID_AREA. */
const CENTER_RECT: Rect = { xmin: 1, xmax: 3, ymin: 1, ymax: 3 };

function rectOf(palace: VietnamesePalace): Rect {
  const { row, col } = BRANCH_GRID_POSITION[palace.branch];
  return { xmin: col - 1, xmax: col, ymin: row - 1, ymax: row };
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

/**
 * The point where a palace's cell touches the Trung Cung rectangle (its
 * shared edge midpoint, or shared corner for the 4 corner palaces). Because
 * this point sits exactly on the (convex) Trung Cung boundary, any straight
 * line drawn between two such points never leaves the Trung Cung — so rays
 * can never visually cross another palace's cell.
 */
function centerAnchor(rect: Rect): Point {
  const cx = clamp((rect.xmin + rect.xmax) / 2, CENTER_RECT.xmin, CENTER_RECT.xmax);
  const cy = clamp((rect.ymin + rect.ymax) / 2, CENTER_RECT.ymin, CENTER_RECT.ymax);
  if (rect.ymax <= CENTER_RECT.ymin) return { x: cx, y: CENTER_RECT.ymin }; // above
  if (rect.ymin >= CENTER_RECT.ymax) return { x: cx, y: CENTER_RECT.ymax }; // below
  if (rect.xmax <= CENTER_RECT.xmin) return { x: CENTER_RECT.xmin, y: cy }; // left
  return { x: CENTER_RECT.xmax, y: cy }; // right
}

export default function AspectOverlay({
  palaces,
  selectedIndex,
}: {
  palaces: VietnamesePalace[];
  selectedIndex: number | null;
}) {
  if (selectedIndex === null) return null;

  const selected = palaces.find((p) => p.index === selectedIndex);
  if (!selected) return null;

  const [tamHopA, tamHopB] = tamHopIndices(selectedIndex);
  const xungChieu = xungChieuIndex(selectedIndex);

  // A single shared origin for every ray (rule: "cac tia chieu bat dau tu 1 diem").
  const origin = centerAnchor(rectOf(selected));

  const lines = [
    { to: palaces.find((p) => p.index === tamHopA), style: LINE_STYLE.tamHop },
    { to: palaces.find((p) => p.index === tamHopB), style: LINE_STYLE.tamHop },
    { to: palaces.find((p) => p.index === xungChieu), style: LINE_STYLE.xungChieu },
  ];

  return (
    <svg
      viewBox="0 0 4 4"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {lines.map((line, i) => {
        if (!line.to) return null;
        const end = centerAnchor(rectOf(line.to));
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

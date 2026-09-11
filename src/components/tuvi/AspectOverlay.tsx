import { BRANCH_GRID_POSITION } from "@/lib/tuvi/rules/palaces";
import { tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import type { VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";

/** Design tokens for the two relation-line styles (spec section M). */
const LINE_STYLE = {
  tamHop: { stroke: "var(--color-gold)", dasharray: "0.06 0.06", width: 0.025 },
  xungChieu: { stroke: "var(--color-lacquer)", dasharray: undefined, width: 0.03 },
};

function centerOf(palace: VietnamesePalace) {
  const { row, col } = BRANCH_GRID_POSITION[palace.branch];
  return { x: col - 0.5, y: row - 0.5 };
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
  const from = centerOf(selected);

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
      {lines.map(
        (line, i) =>
          line.to && (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={centerOf(line.to).x}
              y2={centerOf(line.to).y}
              stroke={line.style.stroke}
              strokeWidth={line.style.width}
              strokeDasharray={line.style.dasharray}
              strokeLinecap="round"
              opacity={0.75}
            />
          ),
      )}
    </svg>
  );
}

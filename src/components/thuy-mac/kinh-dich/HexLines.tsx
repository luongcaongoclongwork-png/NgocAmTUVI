/**
 * Six Nấc Thê drawn as ink strokes, bottom first; moving lines carry a vermilion seal dot.
 * `from` (the Hiện Bích's lines) makes each changed line show its change: a solid line parts in the middle,
 * a broken one closes, and the seal dot fades, so the eye sees Hiện Bích turn into Hóa Bích.
 */
export default function HexLines({ lines, moving = [], small = false, label, from }: { lines: number[]; moving?: number[]; small?: boolean; label: string; from?: number[] }) {
  const W = 120, H = 13, G = 9;
  const rows = [...lines.keys()].reverse();
  return (
    <svg className={`kdLines ${small ? "kdLines--small" : ""}`} viewBox={`0 0 ${W + 24} ${6 * H + 5 * G}`} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
      {rows.map((i, r) => {
        const y = r * (H + G);
        const changed = !!from && from[i] !== lines[i];
        return (
          <g key={i} className="kdLine" style={{ ["--i" as string]: i }}>
            {lines[i] && !changed ? (
              <rect x="0" y={y} width={W} height={H} rx="2" />
            ) : (
              <>
                <rect x="0" y={y} width={W * 0.43} height={H} rx="2" />
                <rect x={W * 0.57} y={y} width={W * 0.43} height={H} rx="2" />
              </>
            )}
            {changed && (
              <>
                {/* the middle of the line closes (âm → dương) or parts (dương → âm) */}
                <rect className={`kdBridge ${lines[i] ? "kdBridge--close" : "kdBridge--open"}`} x={W * 0.43 - 1} y={y} width={W * 0.14 + 2} height={H} />
                <circle className="kdSeal kdSeal--fade" cx={W + 14} cy={y + H / 2} r="4.5" />
              </>
            )}
            {moving.includes(i + 1) && <circle className="kdSeal" cx={W + 14} cy={y + H / 2} r="4.5" />}
          </g>
        );
      })}
    </svg>
  );
}

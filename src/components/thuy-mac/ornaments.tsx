/**
 * Draft ornaments for the v2 directions: Dunhuang-style cloud scrolls (tường
 * vân) and engraved Cửu Đỉnh-style landscape lines. Stroke-only, currentColor,
 * so each direction colours them with its own tokens (light and dark).
 *
 * These are generated sketches to judge layout and mood. The final artwork
 * should be redrawn by an illustrator from the actual Cửu Đỉnh engravings.
 */

type P = { className?: string };

/** Points along a shrinking spiral, as an SVG path. */
function spiral(cx: number, cy: number, r0: number, turns: number, dir: 1 | -1, start = 0): string {
  const steps = Math.round(turns * 36);
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + dir * t * turns * Math.PI * 2;
    const r = r0 * (1 - 0.82 * t);
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/** One tường vân unit, 160 × 48. */
function cloudUnit(ox: number): string[] {
  return [
    spiral(ox + 40, 24, 15, 1.5, 1, Math.PI / 2),
    spiral(ox + 80, 19, 10, 1.4, -1, Math.PI / 2),
    spiral(ox + 112, 26, 8, 1.3, 1, Math.PI / 2),
    `M${ox} 42 C${ox + 24} 42 ${ox + 30} 39 ${ox + 40} 39 S${ox + 70} 44 ${ox + 90} 38 S${ox + 130} 36 ${ox + 160} 42`,
  ];
}

/** A horizontal band of cloud scrolls; tiles across any width. */
export function CloudBand({ className, id = "vân" }: P & { id?: string }) {
  const pid = `cloud-${id}`;
  return (
    <svg className={className} aria-hidden="true" width="100%" height="48" preserveAspectRatio="none">
      <defs>
        <pattern id={pid} width="160" height="48" patternUnits="userSpaceOnUse">
          {cloudUnit(0).map((d, i) => (
            <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="48" fill={`url(#${pid})`} />
    </svg>
  );
}

/** A single cloud scroll for corners. */
export function CloudMark({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 160 48" aria-hidden="true">
      {cloudUnit(0).map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" pathLength={1} className="draw" />
      ))}
    </svg>
  );
}

/** Rounded hump, the way the urns carve a mountain. */
function hump(x: number, base: number, w: number, h: number): string {
  const r = (n: number) => n.toFixed(1);
  return `M${r(x - w / 2)} ${base} C${r(x - w * 0.3)} ${r(base - h * 0.62)} ${r(x - w * 0.17)} ${r(base - h)} ${r(x)} ${r(base - h)} C${r(x + w * 0.17)} ${r(base - h)} ${r(x + w * 0.3)} ${r(base - h * 0.62)} ${r(x + w / 2)} ${base}`;
}

// x, width, height per range; back range first so nearer ranges cover it
const RANGES: { base: number; peaks: [number, number, number][] }[] = [
  { base: 262, peaks: [[90, 220, 120], [260, 280, 170], [450, 240, 130], [640, 320, 200], [840, 260, 140], [1030, 300, 175], [1180, 200, 110]] },
  { base: 292, peaks: [[170, 240, 110], [420, 300, 125], [700, 260, 105], [960, 320, 120]] },
  { base: 314, peaks: [[60, 200, 60], [330, 260, 70], [620, 220, 55], [880, 280, 72], [1140, 240, 62]] },
];

/**
 * Mountains, sun, clouds and water in engraved single-weight line. viewBox
 * 1200 × 400. Each mountain is filled with --orn-fill (set it to the
 * background colour) so nearer ranges hide the lines behind them.
 */
export function CuuDinhLandscape({ className }: P) {
  const water: string[] = [];
  for (let row = 0; row < 5; row++) {
    const y = 330 + row * 16;
    let d = "";
    for (let x = (row % 2) * 14 - 28; x < 1200; x += 28) d += `M${x} ${y} a14 12 0 0 1 28 0`;
    water.push(d);
  }
  return (
    <svg className={className} viewBox="0 0 1200 400" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <g strokeWidth="1.2">
        <circle cx="760" cy="70" r="30" pathLength={1} className="draw" />
        <circle cx="760" cy="70" r="42" strokeDasharray="2 7" />
      </g>
      <g strokeWidth="1" opacity="0.85">
        {[...cloudUnit(40), ...cloudUnit(900)].map((d, i) => (
          <path key={i} d={d} transform={`translate(0 ${i < 4 ? 40 : 18})`} pathLength={1} className="draw" />
        ))}
      </g>
      {RANGES.map((range, ri) => (
        <g key={ri} strokeWidth={1.4 - ri * 0.1}>
          {range.peaks.map(([x, w, h], pi) => (
            <g key={pi}>
              <path d={hump(x, range.base, w, h)} fill="var(--orn-fill, none)" pathLength={1} className="draw" />
              {[0.74, 0.5, 0.28].map((k) => (
                <path key={k} d={hump(x + w * 0.04, range.base, w * k, h * (k + 0.12))} opacity={0.75} pathLength={1} className="draw" />
              ))}
            </g>
          ))}
        </g>
      ))}
      <path d="M0 318 C200 310 400 326 600 318 S1000 310 1200 318" strokeWidth="1.2" pathLength={1} className="draw" />
      <g strokeWidth="0.9" opacity="0.6">
        {water.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  );
}

/** Tử Vi: the 12-palace chart frame (4 × 4, open centre) with a small flame — Diệm Bản. */
export function IconTuVi({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="6" y="6" width="52" height="52" />
      <path d="M19 6v52M45 6v52M6 19h52M6 45h52" />
      <rect x="19" y="19" width="26" height="26" fill="var(--icon-bg, transparent)" />
      <path d="M32 39c-5 0-7-4-5-8 1-2 3-3 3-6 3 2 6 5 6 9 0 3-2 5-4 5z" />
    </svg>
  );
}

/** Phong Thuỷ: sơn thuỷ — a mountain over water. */
export function IconPhongThuy({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M6 42 Q18 30 26 16 Q34 30 44 26 Q52 34 58 42" />
      <path d="M18 42 Q24 32 26 24 M34 30 Q38 36 40 42" />
      <path d="M6 50 q6-4 12 0 t12 0 t12 0 t12 0 M10 57 q6-4 12 0 t12 0 t12 0" />
    </svg>
  );
}

/** Đại Chủ Sự: a đỉnh (tripod urn) — the vessel that holds the whole. */
export function IconDaiChuSu({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M22 10h20l-2 5H24z" />
      <path d="M14 20h36c0 14-7 24-18 24S14 34 14 20z" />
      <path d="M14 22c-5 0-7 3-7 6s3 5 7 4M50 22c5 0 7 3 7 6s-3 5-7 4" />
      <path d="M22 41l-4 14M32 44v12M42 41l4 14" />
      <path d="M20 28h24M22 33h20" opacity="0.7" />
    </svg>
  );
}

export const PATH_ICONS = { "tu-vi": IconTuVi, "phong-thuy": IconPhongThuy, "dai-chu-su": IconDaiChuSu } as const;

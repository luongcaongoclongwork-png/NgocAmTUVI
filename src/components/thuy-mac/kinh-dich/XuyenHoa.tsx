"use client";
/* eslint-disable @next/next/no-img-element -- the flame layers are inline SVG data URIs; next/image has nothing to optimise */

import { useState } from "react";
import { castLine, type Cast } from "@/lib/kinh-dich";
import { rnd } from "./KinhDichTool";

/**
 * Xuyên Hỏa Thành Thê: a flame of light (Diệm 焰) with three tongues (tham, sân, si) stands between the two rails of a
 * ladder. Each of the six presses sends three bronze needles across it at the next rung: a needle that goes
 * through counts as one mặt lưng (the three coins of the classical cast). The rung it leaves stands dark against
 * the light, as a ladder before a lamp. When the sixth is set the flame draws back into one ember.
 */
const NAC = ["thứ nhất", "thứ hai", "thứ ba", "thứ tư", "thứ năm", "thứ sáu"];
const PIERCE_MS = 720;
const rungY = (k: number) => 272 - k * 34;
// the flame: a wide body whose three tongues rise past the sixth rung
const FLAME = "M100 314 C42 314 28 252 38 204 C46 164 58 142 60 92 C70 124 79 156 85 178 C84 120 91 74 100 30 C109 74 116 120 115 178 C121 156 130 124 140 92 C142 142 154 164 162 204 C172 252 158 314 100 314 Z";
// nội diệm in three tongues of its own: the brightest light, each rising from the shared root
const INNER = [
  "M64 300 C56 262 60 214 72 150 C80 196 92 246 96 300 Z",
  "M80 304 C78 236 88 160 100 78 C112 160 122 236 120 304 Z",
  "M104 300 C108 246 120 196 128 150 C140 214 144 262 136 300 Z",
];

const svg = (body: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 340">${body}</svg>`)}`;
/** The three layers of Diệm: ngoại diệm (a faint amber envelope with a ragged edge), nội diệm (the brightest,
 * gold to near white) with diệm tâm (a darker heart at the root), and the halo the flame throws on the paper. */
const LAYERS = {
  halo: svg(`<defs><radialGradient id="h" cx="50%" cy="62%" r="50%"><stop offset="0" stop-color="#f0c47a" stop-opacity="0.55"/><stop offset="1" stop-color="#f0c47a" stop-opacity="0"/></radialGradient></defs><ellipse cx="100" cy="200" rx="98" ry="150" fill="url(#h)"/>`),
  outer: svg(`<defs><filter id="r" x="-25%" y="-15%" width="150%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.055" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="10"/><feGaussianBlur stdDeviation="3.2"/></filter><linearGradient id="o" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c2541f" stop-opacity="0.75"/><stop offset="0.55" stop-color="#d9822b" stop-opacity="0.55"/><stop offset="1" stop-color="#e9a94e" stop-opacity="0.2"/></linearGradient></defs><path d="${FLAME}" fill="url(#o)" filter="url(#r)"/>`),
  inner: svg(`<defs><filter id="g" x="-30%" y="-20%" width="160%" height="140%"><feGaussianBlur stdDeviation="2.6"/></filter><filter id="gt" x="-60%" y="-40%" width="220%" height="180%"><feGaussianBlur stdDeviation="5"/></filter><linearGradient id="i" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f3bb58"/><stop offset="0.45" stop-color="#fbe1a0"/><stop offset="1" stop-color="#fff6df" stop-opacity="0.5"/></linearGradient><radialGradient id="t" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#8a2a1a" stop-opacity="0.8"/><stop offset="1" stop-color="#a8231f" stop-opacity="0"/></radialGradient></defs><g fill="url(#i)" filter="url(#g)">${INNER.map((d) => `<path d="${d}"/>`).join("")}</g><ellipse cx="100" cy="288" rx="17" ry="24" fill="url(#t)" filter="url(#gt)"/>`),
};

type Anim = { level: number; through: boolean[]; key: number };

export default function XuyenHoa({ casts, onCast }: { casts: Cast[]; onCast: (c: Cast) => void }) {
  const [anim, setAnim] = useState<Anim | null>(null);
  const n = casts.length;
  const done = n === 6;
  const last = casts[n - 1];

  const pierce = () => {
    if (anim || done) return;
    const c = castLine(rnd);
    // which of the three needles go through: as many as the backs, in a random order
    const through = [0, 1, 2].map((i) => i < c.lung).sort(() => rnd() - 0.5);
    setAnim({ level: n, through, key: n });
    setTimeout(() => onCast(c), PIERCE_MS * 0.45);
    setTimeout(() => setAnim(null), PIERCE_MS);
  };

  return (
    <div className="xh">
      <button
        type="button"
        data-focus
        className={`xhFire ${done ? "is-done" : ""}`}
        style={{ ["--calm" as string]: n / 6 }}
        onClick={pierce}
        disabled={done}
        aria-busy={!!anim}
        aria-label={done ? "Sáu nấc đã thành" : `Xuyên nấc ${NAC[n]}, nấc ${n + 1} trên 6`}
      >
        <span className="xhStage">
        {/* Diệm 焰 is the bright, rising part of fire, in three layers (see LAYERS). Each is an image drawn once,
            so moving it is pure compositing: the filters never run again while the flame flickers. */}
        <span className="xhFlame" aria-hidden="true">
          <img className="xhLayer xhHalo" src={LAYERS.halo} alt="" />
          <img className="xhLayer xhOuter" src={LAYERS.outer} alt="" />
          <img className="xhLayer xhInner" src={LAYERS.inner} alt="" />
        </span>
        <svg className="xhMarks" viewBox="0 0 200 340" aria-hidden="true">
          <defs>
            <linearGradient id="xhTrail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#c9a25a" stopOpacity="0" />
              <stop offset="1" stopColor="#c9a25a" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* the two rails of the ladder */}
          <g className="xhRails">
            <line x1="46" x2="46" y1="296" y2="86" />
            <line x1="154" x2="154" y1="296" y2="86" />
          </g>

          <circle className="xhEmber" cx="100" cy="306" r="5" />

          {/* the rungs: backlit by the flame, they stand dark against its light */}
          {casts.map((c, k) => {
            const y = rungY(k) - 4;
            return (
              <g key={k} className="xhRung" style={{ ["--k" as string]: k }}>
                {c.hao ? <rect x="52" y={y} width="96" height="8" rx="1" /> : <><rect x="52" y={y} width="41" height="8" rx="1" /><rect x="107" y={y} width="41" height="8" rx="1" /></>}
                {c.dong && <circle className="xhSeal" cx="166" cy={y + 4} r="3.6" />}
              </g>
            );
          })}

          {/* the three needles of this press, a hair apart in height */}
          {anim && (
            <g key={anim.key}>
              {anim.through.map((t, i) => (
                // the outer group places the needle at its rung; the inner one moves (a CSS transform would replace the attribute)
                <g key={i} transform={`translate(0 ${rungY(anim.level) + (i - 1) * 5})`} style={{ ["--d" as string]: `${i * 80}ms` }}>
                  {t && <line className="xhThread" x1="10" x2="190" y1="0" y2="0" />}
                  <g className={`xhNeedle ${t ? "is-through" : "is-stopped"}`}>
                    <rect x="-130" y="-0.9" width="96" height="1.8" fill="url(#xhTrail)" />
                    <path d="M-36 -1.2 L-4 -1.2 L2 0 L-4 1.2 L-36 1.2 Z" />
                  </g>
                </g>
              ))}
            </g>
          )}
        </svg>
        </span>
        {!done && <span className="xhCta">{n ? `Ấn để xuyên nấc ${NAC[n]}` : "Ấn vào ngọn lửa"}</span>}
      </button>

      <p className="ctBeat-text" aria-live="polite">
        {done ? "Sáu nấc đã thành. Ngọn lửa đã lặng." : last ? `Nấc ${NAC[n - 1]}: ${last.lung} ngọn bị xuyên, ${last.hao ? "dương" : "âm"}${last.dong ? ", Động Diệm" : ""}.` : "Ba cây châm xuyên ba ngọn lửa trong tâm: tham, sân, si. Sáu lần xuyên, sáu Nấc Thê."}
      </p>
    </div>
  );
}

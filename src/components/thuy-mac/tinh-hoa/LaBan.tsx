"use client";

import { HUONG, laKey, laTen, type Huong, type La } from "@/lib/tinh-hoa";
import LaBai from "./LaBai";
import "./la-ban.css";

/**
 * La bàn Tịnh Hoá (owner-approved 2026-10-28): the bronze la kinh of the Khâm Thiên Giám, Đông at the top (Thầy Tịnh's
 * way), every character upright for that view. Bands from the rim inward: engraving, degrees, the 24 sơn (子 at Bắc),
 * the 8 quẻ Hậu Thiên, the 8 cung holding the cards, the logo at the heart (the original file, never moved or recoloured).
 * The red thread (Thiên tâm thập đạo) marks the cung in hand. With `tinh`, the thread makes one slow turn to Đông and a
 * line of light runs clockwise from Đông, lighting each cung as it passes.
 */
export const QUAI: Record<Huong, string> = { dong: "震", "dong-nam": "巽", nam: "離", "tay-nam": "坤", tay: "兌", "tay-bac": "乾", bac: "坎", "dong-bac": "艮" };
export const QUAI_TEN: Record<Huong, string> = { dong: "Chấn", "dong-nam": "Tốn", nam: "Ly", "tay-nam": "Khôn", tay: "Đoài", "tay-bac": "Càn", bac: "Khảm", "dong-bac": "Cấn" };
// 24 sơn clockwise from 壬; 子 sits exactly on Bắc (270° on this dial, Đông at the top).
export const SON = "壬子癸丑艮寅甲卯乙辰巽巳丙午丁未坤申庚酉辛戌乾亥".split("");

export type LaBanProps = {
  la: Partial<Record<Huong, La>>;
  chon?: Huong | null;
  kim: number; // the thread's angle, 0 = Đông
  tinh?: boolean;
  ten?: string;
  onCham: (h: Huong) => void;
  cungRef?: (h: Huong, el: HTMLButtonElement | null) => void;
  label: (h: (typeof HUONG)[number], l: La | undefined) => string;
};

export default function LaBan({ la, chon, kim, tinh, ten, onCham, cungRef, label }: LaBanProps) {
  return (
    <div className={`lb-dial ${tinh ? "is-tinh" : ""}`} role="group" aria-label="La bàn tám hướng">
      <svg className="lb-rings" viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          {/* blued steel: a cold navy with the hard light bands of polished metal */}
          <linearGradient id="lbBrass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7C8EA6" />
            <stop offset=".18" stopColor="#23344C" />
            <stop offset=".42" stopColor="#4A5E7A" />
            <stop offset=".6" stopColor="#141F31" />
            <stop offset=".82" stopColor="#3A4C66" />
            <stop offset="1" stopColor="#0B1320" />
          </linearGradient>
          <radialGradient id="lbFace" cx="38%" cy="30%" r="78%">
            <stop offset="0" stopColor="#2C4060" />
            <stop offset=".55" stopColor="#18263C" />
            <stop offset="1" stopColor="#0E1828" />
          </radialGradient>
          <linearGradient id="lbSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#DCE6F2" stopOpacity="0" />
            <stop offset=".3" stopColor="#DCE6F2" stopOpacity=".16" />
            <stop offset=".38" stopColor="#DCE6F2" stopOpacity="0" />
            <stop offset=".66" stopColor="#DCE6F2" stopOpacity="0" />
            <stop offset=".72" stopColor="#DCE6F2" stopOpacity=".08" />
            <stop offset=".8" stopColor="#DCE6F2" stopOpacity="0" />
          </linearGradient>
          <path id="lbRim" d="M200,200 m-190,0 a190,190 0 1,1 380,0 a190,190 0 1,1 -380,0" />
        </defs>
        {/* bands (viewBox units): engraving 186–199 · độ 178–186 · 24 sơn 156–178 · 8 quẻ 134–156 · 8 cung 54–134 · logo < 54 */}
        <circle cx="200" cy="200" r="199" fill="url(#lbBrass)" />
        <circle cx="200" cy="200" r="186" fill="url(#lbFace)" />
        <circle cx="200" cy="200" r="186" fill="url(#lbSheen)" />
        <circle cx="200" cy="200" r="198.4" fill="none" stroke="#C9D3DF" strokeOpacity=".7" strokeWidth=".8" />
        <circle cx="200" cy="200" r="186.4" fill="none" stroke="#0A111C" strokeWidth="1.2" />
        <text className="lb-engrave" dy="0.3em"><textPath href="#lbRim" startOffset="25%">{`Bản Đồ Tịnh Hoá${ten ? ` · Gia chủ ${ten}` : ""} · Phong Thuỷ Là Tịnh`}</textPath></text>
        <g className="lb-ring">
          {Array.from({ length: 120 }, (_, i) => (
            <line key={i} x1="200" y1="14" x2="200" y2={i % 5 === 0 ? 22 : 18} transform={`rotate(${i * 3} 200 200)`} />
          ))}
          <circle cx="200" cy="200" r="178" />
        </g>
        <g className="lb-ring lb-ring--son">
          {SON.map((s, i) => (
            <g key={i} transform={`rotate(${255 + i * 15} 200 200)`}>
              <line x1="200" y1="22" x2="200" y2="44" transform="rotate(7.5 200 200)" />
              <text x="200" y="33" dy="0.35em" transform={`rotate(${-(255 + i * 15)} 200 33)`} className={i % 3 === 1 ? "is-chinh" : ""}>{s}</text>
            </g>
          ))}
          <circle cx="200" cy="200" r="156" />
        </g>
        <g className="lb-ring lb-ring--quai">
          {HUONG.map((h) => (
            <g key={h.id} transform={`rotate(${h.goc} 200 200)`}>
              <line x1="200" y1="44" x2="200" y2="66" transform="rotate(22.5 200 200)" />
              <text x="200" y="55" dy="0.35em" transform={`rotate(${-h.goc} 200 55)`}>{QUAI[h.id]}</text>
            </g>
          ))}
          <circle cx="200" cy="200" r="134" />
        </g>
        <g className="lb-ring">
          {HUONG.map((h) => <line key={h.id} x1="200" y1="66" x2="200" y2="146" transform={`rotate(${h.goc + 22.5} 200 200)`} />)}
          <circle cx="200" cy="200" r="54" />
        </g>
        <g className="lb-thread" style={{ ["--n" as string]: `${kim}deg` }}>
          {/* the cung in hand: its sector of the quẻ and sơn rings lit like polished steel, a vermilion mark on the rim */}
          <path className="lb-sector" d="M131.9,35.55 A178,178 0 0,1 268.1,35.55 L251.28,76.2 A134,134 0 0,0 148.72,76.2 Z" />
          <polygon className="lb-blade-tip" points="200,23 205.5,14 194.5,14" />
        </g>
        <circle className="lb-light" cx="200" cy="200" r="137" pathLength={1} transform="rotate(-90 200 200)" />
      </svg>

      {HUONG.map((h, i) => {
        const l = la[h.id];
        return (
          <button
            key={h.id}
            ref={cungRef ? (el) => cungRef(h.id, el) : undefined}
            type="button"
            className={`lb-cung ${chon === h.id ? "is-chon" : ""}`}
            style={{ ["--a" as string]: `${h.goc}deg`, ["--k" as string]: i }}
            onClick={() => onCham(h.id)}
            aria-pressed={chon === h.id}
            aria-label={label(h, l)}
          >
            <span className="lb-cung-ten">{h.ten}</span>
            <span className="lb-flip" key={l ? laKey(l) : "up"}><LaBai la={l ?? null} size="sm" label={l ? laTen(l) : undefined} /></span>
          </button>
        );
      })}

      <div className="lb-heart">
        {/* eslint-disable-next-line @next/next/no-img-element -- the logo's own SVG file, shown as it is */}
        <img src="/images/logo/ngoc-am-symbol-color.svg" alt="Ngọc Âm" width={96} height={96} />
      </div>
    </div>
  );
}

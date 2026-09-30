"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloudBand, CuuDinhLandscape, PATH_ICONS } from "../ornaments";
import { createInk } from "./inkShader";
import Compass from "./Compass";

export type Branch = { id: "tu-vi" | "phong-thuy" | "dai-chu-su"; name: string; line: string; href: string; from: string };

const PAINTING = "/images/06-thuy-mac-song-huong.webp";
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Branch ends in the river drawing (viewBox 1000 × 600), used for the label positions too. */
const BRANCH_PATHS: Record<Branch["id"], string> = {
  "tu-vi": "M500 600 C500 520 492 450 480 400 C440 320 300 260 170 170",
  "phong-thuy": "M500 600 C500 520 492 450 480 400 C486 320 510 220 500 130",
  "dai-chu-su": "M500 600 C500 520 492 450 480 400 C560 320 700 260 830 170",
};

/**
 * Prototype of scenes 1–3 of "Thuỷ Mặc Sống": one continuous ink painting
 * the visitor scrolls into. The scroll position drives everything through
 * CSS variables (--s1, --s2, --s3 for each scene's own 0→1 progress) and
 * the WebGL painting's uniforms.
 */
export default function InkHome({ branches, lineage }: { branches: Branch[]; lineage: { title: string; quote: string } }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // pending: paper only, waiting for the painting · ink: WebGL is drawing · still: plain image fallback
  const [mode, setMode] = useState<"pending" | "ink" | "still">("pending");
  const [intro, setIntro] = useState(false);
  const [hot, setHot] = useState<Branch["id"] | null>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const track = trackRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t0: number | null = null;
    let ink: ReturnType<typeof createInk> = null;
    try {
      ink = reduced
        ? null
        : createInk(canvasRef.current!, PAINTING, () => {
            t0 = performance.now();
            setMode("ink");
          });
    } catch (err) {
      console.error("Thuỷ mặc: WebGL unavailable, showing the still painting.", err);
      ink = null;
    }
    const fallback = () => {
      setMode("still");
      setIntro(true);
    };
    if (!ink) fallback();
    // a painting that never arrives must not leave a blank page
    const giveUp = window.setTimeout(() => {
      if (t0 === null) fallback();
    }, 5000);

    const mouse: [number, number] = [0.5, 0.5];
    let mouseAmt = 0;
    const onMove = (e: PointerEvent) => {
      mouse[0] = e.clientX / window.innerWidth;
      mouse[1] = e.clientY / window.innerHeight;
      mouseAmt = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let introShown = !ink;
    let raf = 0;
    const frame = (now: number) => {
      const r = track.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
      const s1 = clamp01(p / 0.3);
      const s2 = clamp01((p - 0.3) / 0.36);
      const s3 = clamp01((p - 0.66) / 0.3);
      root.style.setProperty("--p", p.toFixed(4));
      root.style.setProperty("--s1", s1.toFixed(4));
      root.style.setProperty("--s2", s2.toFixed(4));
      root.style.setProperty("--s2b", Math.sin(Math.PI * s2).toFixed(4));
      root.style.setProperty("--s2d", clamp01(s2 * 1.5).toFixed(4));
      root.style.setProperty("--s3", s3.toFixed(4));
      root.style.setProperty("--s3d", clamp01(s3 * 1.4).toFixed(4));
      root.dataset.scene = p < 0.3 ? "1" : p < 0.66 ? "2" : "3";

      // ease-in-out over ~4s, so the drop visibly spreads before it fills the page
      const rt = t0 === null ? 0 : clamp01((now - t0 - 400) / 4200);
      const reveal = rt < 0.5 ? 4 * rt * rt * rt : 1 - Math.pow(-2 * rt + 2, 3) / 2;
      if (!introShown && reveal > 0.35) {
        introShown = true;
        setIntro(true);
      }
      mouseAmt *= 0.965;
      ink?.draw({
        reveal,
        time: now / 1000,
        zoom: 1 + 0.55 * smooth(0, 0.55, p),
        fog: smooth(0.24, 0.42, p) * 0.86 + smooth(0.6, 0.72, p) * 0.12,
        mouse,
        mouseAmt,
        focusX: window.innerWidth < 700 ? 0.74 : 0.5,
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(giveUp);
      window.removeEventListener("pointermove", onMove);
      ink?.destroy();
    };
  }, []);

  const hotBranch = branches.find((b) => b.id === hot);

  return (
    <div ref={rootRef} className={`eInk ${intro ? "is-intro" : ""}`} data-mode={mode} data-scene="1">
      <Link href="/thu-nghiem/e" className="eBrand">
        <Image src="/images/logo-mark.png" alt="" width={34} height={34} />
        <span>Ngọc Âm</span>
      </Link>
      <Compass branches={branches} />

      <div ref={trackRef} className="eTrack">
        <div className="eStage">
          <Image src={PAINTING} alt="Tranh thuỷ mặc sông Hương: con thuyền nhỏ, núi mờ sương, lầu cổ bên bờ, cành thông" fill priority sizes="100vw" className="eStill" />
          <canvas ref={canvasRef} className="eCanvas" aria-hidden="true" />

          {/* Scene 1 — the drop of ink, and three hanging boards */}
          <section className="eScene eS1" aria-label="Mở đầu">
            <div className="eS1-head">
              <h1 className="eBoards">
                <span className="eBoard"><span>Hiểu</span><span>mình</span></span>
                <span className="eBoard"><span>Thuận</span><span>thế</span></span>
                <span className="eBoard"><span>Vững</span><span>bước</span></span>
              </h1>
              <p className="eS1-sub">Tử Vi và Phong Thuỷ của hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn.</p>
            </div>
            <p className="eHint" aria-hidden="true"><span />Cuộn để đi vào tranh</p>
          </section>

          {/* Scene 2 — through the clouds, the urn engravings carve themselves */}
          <div className="eClouds" aria-hidden="true">
            <CloudBand id="e1" className="eCloud eCloud--1" />
            <CloudBand id="e2" className="eCloud eCloud--2" />
            <CloudBand id="e3" className="eCloud eCloud--3" />
          </div>
          <section className="eScene eS2" aria-labelledby="eS2-h">
            <CuuDinhLandscape className="eEngrave" />
            <div className="eS2-text">
              <h2 id="eS2-h">{lineage.title}</h2>
              <p>{lineage.quote}</p>
            </div>
          </section>

          {/* Scene 3 — the river forks into three paths */}
          <section className="eScene eS3" aria-labelledby="eS3-h">
            <h2 id="eS3-h" className="eS3-h">Một dòng sông, ba nhánh chảy</h2>
            <div className="eRiver">
              <svg viewBox="0 0 1000 600" className="eRiver-svg" aria-hidden="true" fill="none" strokeLinecap="round">
                {branches.map((b) => (
                  <g key={b.id} className={`eBranch ${hot === b.id ? "is-hot" : ""}`}>
                    <path d={BRANCH_PATHS[b.id]} pathLength={1} className="eBranch-wash" />
                    <path d={BRANCH_PATHS[b.id]} pathLength={1} className="eBranch-line" />
                  </g>
                ))}
              </svg>
              <ul className="eForks">
                {branches.map((b) => {
                  const Icon = PATH_ICONS[b.id];
                  return (
                    <li key={b.id} className={`eFork eFork--${b.id}`}>
                      <Link href={b.href} onPointerEnter={() => setHot(b.id)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(b.id)} onBlur={() => setHot(null)}>
                        <span className="eBlot" aria-hidden="true" />
                        <Icon className="eFork-icon" />
                        <b>{b.name}</b>
                        <span>{b.line}</span>
                        <small>từ {b.from}</small>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <section className="eNext">
        <p className="eNext-kicker">Bản mẫu dừng ở cảnh 3</p>
        <h2>Tiếp theo: tờ lịch trôi trên mặt nước, thư phòng của Xuyên giả, và giọt mực thành nút đặt lịch.</h2>
        <p>
          <Link href="/thu-nghiem/d" className="eLink">Xem lại phần tờ lịch và câu hỏi (Hướng D)</Link>
        </p>
      </section>

      <Link href={hotBranch ? `/lien-he?topic=${hotBranch.id}` : "/lien-he"} className="ePill">
        <span className="ePill-dot" aria-hidden="true" />
        {hotBranch ? `Đặt lịch ${hotBranch.name}` : "Đặt lịch Xuyên vấn"}
      </Link>
    </div>
  );
}

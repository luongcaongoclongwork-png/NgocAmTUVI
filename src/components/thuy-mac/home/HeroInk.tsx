"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createInk } from "../inkShader";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Phones on save-data, few cores or little memory get the still painting: the page must feel light first. */
function canAffordInk(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;
  return true;
}

/** The painting is 16:9. */
const PAINTING_ASPECT = 16 / 9;

/**
 * Where the canvas centres the painting, as a share of its width. An upright screen shows only a slice of it, and
 * the pavilion is on the right, so the slice is moved the same way the still image's object-position is in
 * type.css (80% on a phone, 97% on a tablet). The centre is kept far enough from the edge that the slice never
 * runs past the painting.
 */
function heroFocusX(canvas: HTMLCanvasElement): number {
  const w = window.innerWidth;
  const position = w < 640 ? 0.8 : w < 1024 ? 0.97 : 0.5;
  const half = Math.min(0.5, canvas.clientWidth / Math.max(1, canvas.clientHeight) / PAINTING_ASPECT / 2);
  return half + (1 - 2 * half) * position;
}

/**
 * The home's opening painting (v1's Huế pavilion): a drop of ink spreads into
 * it in about a second, once. Nothing runs after that, so an idle tab costs
 * nothing (v1's lightness). The ripple that used to follow the pointer was
 * removed (owner, 2026-10-02): phones and weaker machines never saw it.
 */
export default function HeroInk({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"pending" | "ink" | "still">("pending");

  useEffect(() => {
    const canvas = canvasRef.current!;
    let ink: ReturnType<typeof createInk> = null;
    let t0: number | null = null;
    let raf = 0;
    let visible = true;

    const still = () => setMode("still");
    if (!canAffordInk()) {
      still();
      return;
    }

    const frame = (now: number) => {
      raf = 0;
      if (!ink || t0 === null || !visible) return;
      const rt = clamp01((now - t0) / 1200);
      const reveal = rt < 0.5 ? 4 * rt * rt * rt : 1 - Math.pow(-2 * rt + 2, 3) / 2;
      ink.draw({ reveal, time: now / 1000, zoom: 1, fog: 0, mouse: [0.5, 0.5], mouseAmt: 0, focusX: heroFocusX(canvas) });
      // keep drawing only until the ink has finished spreading
      if (rt < 1) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    try {
      ink = createInk(canvas, { painting: src, layers: [] }, () => {
        t0 = performance.now();
        setMode("ink");
        kick();
      });
    } catch (err) {
      console.error("Thuỷ mặc: WebGL unavailable, showing the still painting.", err);
      ink = null;
    }
    if (!ink) {
      still();
      return;
    }
    // a painting that is slow to arrive must not leave a blank hero
    const giveUp = window.setTimeout(() => {
      if (t0 === null) still();
    }, 1500);

    const host = canvas.parentElement!;
    const onResize = () => kick();
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(giveUp);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      ink?.destroy();
    };
  }, [src]);

  return (
    <div className="hHero-paint" data-mode={mode}>
      <Image src={src} alt={alt} fill priority sizes="100vw" className="hHero-still" />
      <canvas ref={canvasRef} className="hHero-canvas" aria-hidden="true" />
    </div>
  );
}

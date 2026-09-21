"use client";

import { useEffect, useRef } from "react";
import { lanternDurationMs, ringSteps } from "./xtdMotion";

/**
 * "Ngon den Nien Trinh": a small lantern that marks this year's Menh palace
 * (the Nien Trinh "Chu That") and, when the viewing year changes, walks along
 * the chart's border palace by palace to the new one (the Menh moves exactly
 * one palace per year). Only `transform` is animated; positions come from the
 * grid's own cell centres (in % of the grid), turned into px at move time so
 * it stays right at any chart size, including the scaled phone canvas (layout
 * units, not scaled rects). A ResizeObserver re-seats it when the chart is
 * resized while it is at rest.
 *
 * Web charts only: XtdTuViChartGrid renders it when `lantern` is passed —
 * never in the print tree — and it is `data-html2canvas-ignore`d so image
 * export does not carry a UI marker.
 */
export default function XtdLantern({
  targetIndex,
  centers,
}: {
  targetIndex: number;
  /** Cell centre per palace index, in % of the grid box (must be referentially stable per layout). */
  centers: Record<number, { x: number; y: number }>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prevIndex = useRef<number | null>(null);
  const moving = useRef(false);
  const targetRef = useRef(targetIndex);
  const centersRef = useRef(centers);

  // Keep the latest values readable from the ResizeObserver callback (refs are updated in an effect, not during render).
  useEffect(() => {
    targetRef.current = targetIndex;
    centersRef.current = centers;
  });

  const seat = (el: HTMLElement, box: HTMLElement, i: number) => {
    const c = centersRef.current[i];
    if (!c) return;
    el.classList.add("xtd-lantern--seated");
    el.style.transform = `translate(${((c.x / 100) * box.offsetWidth).toFixed(1)}px, ${((c.y / 100) * box.offsetHeight).toFixed(1)}px)`;
  };

  useEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;

    const at = (i: number) => {
      const c = centers[i];
      return `translate(${((c.x / 100) * box.offsetWidth).toFixed(1)}px, ${((c.y / 100) * box.offsetHeight).toFixed(1)}px)`;
    };

    const from = prevIndex.current;
    prevIndex.current = targetIndex;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // First placement, no change, or reduced motion: just be there.
    if (from === null || from === targetIndex || reduce || !centers[from] || !centers[targetIndex]) {
      seat(el, box, targetIndex);
      return;
    }

    const steps = ringSteps(from, targetIndex);
    const frames = [from, ...steps].map((i) => ({ transform: at(i) }));
    moving.current = true;
    const anim = el.animate(frames, {
      duration: lanternDurationMs(steps.length),
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "both",
    });
    let cancelled = false;
    anim.finished
      .then(() => {
        if (cancelled) return;
        el.style.transform = at(targetIndex);
        anim.cancel();
        moving.current = false;
      })
      .catch(() => {
        // cancelled by a newer move
      });
    return () => {
      cancelled = true;
      // Retarget mid-flight: freeze at the current spot so the next move starts from it.
      const current = getComputedStyle(el).transform;
      anim.cancel();
      if (current && current !== "none") el.style.transform = current;
      moving.current = false;
    };
  }, [targetIndex, centers]);

  useEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (!moving.current) seat(el, box, targetRef.current);
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="xtd-lantern" data-html2canvas-ignore="true" aria-hidden="true" />;
}

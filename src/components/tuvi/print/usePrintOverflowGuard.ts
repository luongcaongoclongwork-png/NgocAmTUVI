"use client";

import { useEffect, type RefObject } from "react";

/** How much --pz-scale drops per shrink step, and the floor it won't go past (a scale this low is still legible — ~78% of the print chart's already-tested max-safe sizes — but any lower risks the fonts becoming the actual problem instead of the fix). */
const SCALE_STEP = 0.04;
const MIN_SCALE = 0.78;
const MAX_ITERATIONS = Math.ceil((1 - MIN_SCALE) / SCALE_STEP) + 1;

/**
 * Print's own last-resort safety net on top of paletteDensity.ts's 4-tier
 * sizing table and chartRowLayout.ts's row reallocation (see
 * print.css's own comment on the `--pz-scale` custom property): after the
 * chart has actually laid out with real fonts, measure every palace
 * cell's true content height (`scrollHeight`) against its fixed print box
 * (`clientHeight`, since `.tuvi-palace` clips overflow) and, for any cell
 * that's still too tall, shrink ONLY that cell in small steps by raising
 * its own `--pz-scale` until it fits or a legibility floor is hit —
 * instead of silently losing whatever `overflow:hidden` clips away (the
 * "sao lưu biến mất" bug this exists to close, 2026-09-19).
 *
 * Deliberately a one-shot effect, not a ResizeObserver — this is a static
 * print page (one render, then straight to `window.print()`/export), not
 * a live-resizing surface. Waits for `document.fonts.ready` first so the
 * very first measurement already reflects real glyph metrics instead of
 * a fallback font that's about to reflow out from under it.
 */
export function usePrintOverflowGuard(containerRef: RefObject<HTMLElement | null>, deps: React.DependencyList, onSettled?: () => void) {
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // Fall through and measure with whatever's loaded — better than
          // never settling (autoprint is gated on this callback firing).
        }
      }
      if (cancelled) return;

      const container = containerRef.current;
      if (!container) {
        onSettled?.();
        return;
      }

      const cells = container.querySelectorAll<HTMLElement>(".tuvi-palace");
      for (const cell of cells) {
        cell.style.removeProperty("--pz-scale");
        let scale = 1;
        let iterations = 0;
        // Reading scrollHeight/clientHeight forces a synchronous reflow —
        // fine here (12 cells, at most MAX_ITERATIONS reads each, once
        // per print render, not a hot path).
        while (cell.scrollHeight > cell.clientHeight && scale > MIN_SCALE && iterations < MAX_ITERATIONS) {
          scale = Math.max(MIN_SCALE, scale - SCALE_STEP);
          cell.style.setProperty("--pz-scale", scale.toFixed(2));
          iterations++;
        }
      }

      if (!cancelled) onSettled?.();
    }

    run();
    return () => {
      cancelled = true;
    };
    // deps is the caller's explicit re-run trigger (chart/horoscope identity) — the hook itself has no other reactive inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

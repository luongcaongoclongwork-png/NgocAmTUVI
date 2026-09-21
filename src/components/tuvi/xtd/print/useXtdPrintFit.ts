"use client";

import { useEffect, type RefObject } from "react";
import { flushSync } from "react-dom";
import { solveRowHeights, toRowLayout } from "./solveRowHeights";
import type { RowLayout } from "../../chartRowLayout";

/**
 * Measured fit for the Xuyen Tam Diem PRINT chart — replaces the one-knob
 * shrink of print/usePrintOverflowGuard.ts (kept unchanged for the traditional
 * print). Runs once after fonts are ready, in this order:
 *
 *  0. GLOBAL SIZE (only when `maxScale` > 1): the biggest uniform type scale
 *     at which the whole chart still fits (binary search over real
 *     measurements, minus SAFETY), capped at `maxScale`. Charts with spare room
 *     get bigger text instead of leaving the space empty; charts that are
 *     already full stay at 1.
 *  1. MEASURE every palace cell's natural height at that scale: the bottom of
 *     its last in-flow section + the footer zone it must clear. Layout
 *     (offset*) units, so it is independent of any CSS transform.
 *  2. RE-SPLIT the 4 grid rows with that data (solveRowHeights): rows get what
 *     their fullest cell needs instead of a guess from star counts, Trung Cung
 *     keeps at least what its own text needs plus an art band. A shortfall is
 *     shared by all rows in the same ratio.
 *  3. Per cell, only for what is still too tall: squeeze SPACING first
 *     (`--pz-space`), then shrink type in 2% steps (`--pz-scale`) down to
 *     PRINT_MIN_SCALE, and only as a last resort down to EMERGENCY_SCALE
 *     (with a console warning) rather than let a star be clipped away.
 *
 * Why this order: text size is what the reader sees; row height and spacing
 * cost nothing. Cell width never changes (columns are fixed), so a cell's
 * natural height is the same before and after step 2 — the pass is one-shot
 * and idempotent (React StrictMode's double effect gives the same result).
 * `onSettled` fires after all of it so auto-print / PDF export wait for it.
 */
const SPACE_STEPS = [1, 0.75, 0.5, 0.35, 0.2];
const SCALE_STEP = 0.02;
export const PRINT_MIN_SCALE = 0.8;
/**
 * Cap for the automatic scale-up (chosen 2026-09-21 from the live comparison:
 * sparse charts reach 104-108%, full ones stay at 100%).
 */
export const XTD_PRINT_MAX_SCALE = 1.08;
/** Last resort only — below this a star would have to be clipped instead. */
export const EMERGENCY_SCALE = 0.72;
const CLEARANCE_PX = 2;
/** Least art (scroll/mountains) left under Trung Cung's last text row. */
const CENTER_ART_BAND_PX = 55;
const MIN_ROW_FRACTION = 0.19;
/** The scale-up search stops this far short of the exact limit. */
const SAFETY = 0.985;

type Rows4 = [number, number, number, number];

export interface XtdPrintFitOptions {
  /** Cap for the automatic scale-up (1 = never enlarge). */
  maxScale?: number;
}

function inFlowBottom(el: HTMLElement, skip?: Element | null): number {
  let bottom = 0;
  for (const child of Array.from(el.children)) {
    if (child === skip || !(child instanceof HTMLElement)) continue;
    if (getComputedStyle(child).position === "absolute") continue;
    if (child.offsetHeight > 0) bottom = Math.max(bottom, child.offsetTop + child.offsetHeight);
  }
  return bottom;
}

function cellNeed(cell: HTMLElement): number {
  const footer = cell.querySelector<HTMLElement>(".palace-footer-zone");
  const reserve = footer ? cell.offsetHeight - footer.offsetTop : 0;
  return inFlowBottom(cell, footer) + reserve + CLEARANCE_PX;
}

function overflowPx(cell: HTMLElement): number {
  const footer = cell.querySelector<HTMLElement>(".palace-footer-zone");
  const limit = (footer ? footer.offsetTop : cell.offsetHeight) - CLEARANCE_PX;
  return inFlowBottom(cell, footer) - limit;
}

function rowOf(cell: HTMLElement): number {
  return parseInt(getComputedStyle(cell.parentElement as HTMLElement).gridRowStart, 10);
}

function measureRows(cells: HTMLElement[]): Rows4 {
  const needs: Rows4 = [0, 0, 0, 0];
  for (const cell of cells) {
    const row = rowOf(cell);
    if (row >= 1 && row <= 4) needs[row - 1] = Math.max(needs[row - 1], cellNeed(cell));
  }
  return needs;
}

/** Can the 4 rows (and Trung Cung) all get what they need at once? */
function fits(needs: Rows4, centerMin: number, total: number, minRow: number): boolean {
  const n = needs.map((v) => Math.max(v, minRow));
  return Math.max(n[1] + n[2], centerMin) + n[0] + n[3] <= total;
}

function setAllScale(cells: HTMLElement[], scale: number) {
  for (const cell of cells) {
    cell.style.removeProperty("--pz-space");
    if (scale === 1) cell.style.removeProperty("--pz-scale");
    else cell.style.setProperty("--pz-scale", scale.toFixed(3));
  }
}

/** Largest uniform scale in [1, maxScale] that still fits, or 1. */
function pickGlobalScale(cells: HTMLElement[], centerMin: number, total: number, minRow: number, maxScale: number): number {
  const ok = (s: number) => {
    setAllScale(cells, s);
    return fits(measureRows(cells), centerMin, total, minRow);
  };
  if (maxScale <= 1 || !ok(1)) return 1;
  // The cap itself is used as-is when the chart would still fit a little ABOVE it
  // (i.e. the cap already leaves the safety margin); only a limit found by the
  // search is backed off by SAFETY.
  if (ok(Math.min(maxScale / SAFETY, 1.4))) return maxScale;
  let lo = 1;
  let hi = maxScale;
  for (let i = 0; i < 10; i++) {
    const mid = (lo + hi) / 2;
    if (ok(mid)) lo = mid;
    else hi = mid;
  }
  return Math.max(1, Math.floor(lo * SAFETY * 100) / 100);
}

function fitCell(cell: HTMLElement, base: number): void {
  const setScale = (s: number) => {
    if (s === 1) cell.style.removeProperty("--pz-scale");
    else cell.style.setProperty("--pz-scale", s.toFixed(3));
  };
  cell.style.removeProperty("--pz-space");
  setScale(base);
  if (overflowPx(cell) <= 0) return;

  for (const s of SPACE_STEPS.slice(1)) {
    cell.style.setProperty("--pz-space", String(s));
    if (overflowPx(cell) <= 0) return;
  }

  let scale = base;
  while (scale > EMERGENCY_SCALE) {
    scale = Math.max(EMERGENCY_SCALE, Math.round((scale - SCALE_STEP) * 100) / 100);
    setScale(scale);
    if (overflowPx(cell) <= 0) {
      if (scale < PRINT_MIN_SCALE) {
        cell.dataset.fitEmergency = String(scale);
        console.warn(`[xtd-print] "${cell.querySelector(".palace-name")?.textContent}" needed emergency scale ${scale} (< ${PRINT_MIN_SCALE})`);
      }
      return;
    }
  }
  cell.dataset.fitOverflow = String(Math.round(overflowPx(cell)));
  console.warn(`[xtd-print] "${cell.querySelector(".palace-name")?.textContent}" still overflows by ${cell.dataset.fitOverflow}px at scale ${scale} — a star may be clipped`);
}

export function useXtdPrintFit(
  containerRef: RefObject<HTMLElement | null>,
  deps: React.DependencyList,
  onRows: (rows: RowLayout) => void,
  onSettled?: () => void,
  options: XtdPrintFitOptions = {},
) {
  const maxScale = options.maxScale ?? 1;
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // measure with whatever is loaded — never block auto-print forever
        }
      }
      if (cancelled) return;
      const container = containerRef.current;
      if (!container) {
        onSettled?.();
        return;
      }

      const grid = container.querySelector<HTMLElement>(".ngoc-am-grid");
      const cells = Array.from(container.querySelectorAll<HTMLElement>(".tuvi-palace"));
      const center = container.querySelector<HTMLElement>(".center-palace");

      for (const cell of cells) {
        cell.style.removeProperty("--pz-space");
        cell.style.removeProperty("--pz-scale");
        delete cell.dataset.fitOverflow;
        delete cell.dataset.fitEmergency;
      }

      let base = 1;
      if (grid) {
        const total = grid.clientHeight;
        const minRow = total * MIN_ROW_FRACTION;
        const centerPad = center ? parseFloat(getComputedStyle(center).paddingBottom) || 0 : 0;
        const centerMin = center ? inFlowBottom(center) + centerPad + CENTER_ART_BAND_PX : 0;

        // 0. global size (scale-up when there is room)
        base = pickGlobalScale(cells, centerMin, total, minRow, maxScale);
        setAllScale(cells, base);

        // 1 + 2. measure at that size, re-split the rows
        const px = solveRowHeights({ needs: measureRows(cells), centerMin, total, minRow });
        flushSync(() => onRows(toRowLayout(px)));
      }
      if (cancelled) return;

      // 3. per-cell squeeze for whatever is still too tall
      for (const cell of cells) fitCell(cell, base);

      if (!cancelled) onSettled?.();
    }

    run();
    return () => {
      cancelled = true;
    };
    // deps is the caller's explicit re-run trigger (chart/horoscope identity).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, maxScale]);
}

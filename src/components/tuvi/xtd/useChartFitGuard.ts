"use client";

import { useEffect, type RefObject } from "react";

/**
 * Web counterpart of print/usePrintOverflowGuard.ts, for the Xuyen Tam Diem
 * chart: after layout, measure every palace cell's real content against the
 * top of its footer zone and, for any cell whose stars run into it, fit them
 * WITHOUT hiding a single star and keeping the type as large as possible —
 * in this order:
 *
 *  1. squeeze spacing only (`--pz-space` 1 -> 0: group margins, row gaps,
 *     column gaps), font sizes untouched;
 *  2. only if that isn't enough, shrink the star text (`--pz-scale`) in fine
 *     2% steps and stop at the first step that fits — never lower than
 *     MIN_SCALE.
 *
 * Both are per-cell CSS custom properties read by ngocAmChart.css (unset =
 * 1, so the traditional chart and the mobile canvas never see a change).
 * Unlike print (a one-shot static page) the web chart is live-resizing —
 * its height follows the container width — so the fit is redone whenever
 * the chart's size changes. The variables live on the cells, so image
 * export (html2canvas of this same tree) gets the fitted result too.
 */
const SPACE_STEPS = [1, 0.75, 0.5, 0.25, 0];
const SCALE_STEP = 0.02;
export const MIN_SCALE = 0.84;
/** Keep the last line at least this far above the footer's top border. */
const CLEARANCE_PX = 1;

/**
 * Layout (offset*) units, not getBoundingClientRect: the phone canvas is scaled
 * down with a CSS transform (and can be measured before that scale settles),
 * which would skew or zero the rects. Direct children of the cell are offset
 * against the cell itself (it is position:relative).
 */
function contentOverflowPx(cell: HTMLElement): number {
  const footer = cell.querySelector<HTMLElement>(".palace-footer-zone");
  const limit = (footer ? footer.offsetTop : cell.offsetHeight) - CLEARANCE_PX;
  let bottom = -Infinity;
  for (const child of Array.from(cell.children)) {
    if (child === footer || !(child instanceof HTMLElement)) continue;
    if (getComputedStyle(child).position === "absolute") continue;
    if (child.offsetHeight > 0) bottom = Math.max(bottom, child.offsetTop + child.offsetHeight);
  }
  return bottom - limit;
}

function fitCell(cell: HTMLElement) {
  cell.style.removeProperty("--pz-space");
  cell.style.removeProperty("--pz-scale");
  delete cell.dataset.fitOverflow;
  if (contentOverflowPx(cell) <= 0) return;

  for (const space of SPACE_STEPS.slice(1)) {
    cell.style.setProperty("--pz-space", String(space));
    if (contentOverflowPx(cell) <= 0) return;
  }

  let scale = 1;
  while (scale > MIN_SCALE) {
    scale = Math.max(MIN_SCALE, Math.round((scale - SCALE_STEP) * 100) / 100);
    cell.style.setProperty("--pz-scale", String(scale));
    if (contentOverflowPx(cell) <= 0) return;
  }

  // Floor reached and still too tall: leave it at the floor and say so.
  cell.dataset.fitOverflow = String(Math.round(contentOverflowPx(cell)));
}

/** The Trung Cung's text is never zoomed below this. */
const MIN_CENTER_ZOOM = 0.8;

/**
 * The Trung Cung has a fixed list of rows but its box follows the two middle
 * grid rows, which shrink when the outer rows are crowded. When the list is
 * taller than the box, every in-flow child is zoomed by one factor (`--cz`, read
 * by ngocAmChart.css) so the last row and the Xuyên giả's name stay inside
 * instead of being cut off by the box's overflow:hidden.
 */
function fitCenter(center: HTMLElement) {
  center.style.removeProperty("--cz");
  const style = getComputedStyle(center);
  const available = center.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  let needed = 0;
  for (const child of Array.from(center.children)) {
    if (!(child instanceof HTMLElement)) continue;
    const cs = getComputedStyle(child);
    if (cs.position === "absolute" || cs.display === "none") continue;
    needed += child.offsetHeight + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
  }
  if (available <= 0 || needed <= available + 0.5) return;
  const zoom = Math.max(MIN_CENTER_ZOOM, Math.floor((available / needed) * 100) / 100);
  center.style.setProperty("--cz", String(zoom));
}

export function useChartFitGuard(containerRef: RefObject<HTMLElement | null>, deps: React.DependencyList, onFirstFit?: () => void) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let frame = 0;

    function run() {
      if (cancelled || !container) return;
      for (const cell of container.querySelectorAll<HTMLElement>(".tuvi-palace")) fitCell(cell);
      for (const center of container.querySelectorAll<HTMLElement>(".center-palace")) fitCenter(center);
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(run);
    }

    // Real glyph metrics first, then again on every size change.
    (async () => {
      try {
        await document.fonts?.ready;
      } catch {
        // measure with whatever is loaded
      }
      if (cancelled) return;
      run();
      onFirstFit?.();
    })();

    const observer = new ResizeObserver(schedule);
    observer.observe(container);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
    // deps is the caller's explicit re-run trigger (chart/horoscope identity).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

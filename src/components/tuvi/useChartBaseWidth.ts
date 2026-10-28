"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

const WIDE_DESKTOP_WIDTH = 1060;
const TABLET_WIDTH = 980;

/**
 * Desktop chart size: 1060px at >=1180px viewport, 980px on tablet
 * (1024-1179px, where the mobile virtual-canvas experience isn't active but
 * 1060 wouldn't comfortably fit). Starts at the tablet size so SSR/first
 * paint is deterministic, then corrects client-side via matchMedia.
 */
export function useChartBaseWidth(): number {
  const [width, setWidth] = useState(TABLET_WIDTH);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1180px)");
    const update = () => setWidth(query.matches ? WIDE_DESKTOP_WIDTH : TABLET_WIDTH);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return width;
}

/** The Xuyên Tam Diệm chart is always laid out at this width, then zoomed to its container. */
export const XTD_CHART_WIDTH = WIDE_DESKTOP_WIDTH;
const MIN_ZOOM = 0.9;
const MAX_ZOOM = 1.21;

/**
 * How much the 1060px chart is zoomed to fit the room its screen gives it. The
 * whole chart is zoomed as one piece (CSS `zoom`), so every star changes by the
 * same factor and no cell is laid out again: a little under 1 on a tablet held
 * sideways (1024px), up to 1.21 on a laptop or desktop. One layout for every
 * wide screen means a chart that fits on one fits on all of them.
 */
export function useChartZoom(containerRef: RefObject<HTMLElement | null>, baseWidth: number): number {
  const [zoom, setZoom] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const fit = Math.floor((el.clientWidth / baseWidth) * 100) / 100;
      setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, fit)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, baseWidth]);

  return zoom;
}

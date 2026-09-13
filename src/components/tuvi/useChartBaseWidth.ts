"use client";

import { useEffect, useState } from "react";

const WIDE_DESKTOP_WIDTH = 1060;
const TABLET_WIDTH = 980;

/**
 * Desktop chart size: 1060px at >=1180px viewport, 980px on tablet
 * (768-1179px, where the mobile virtual-canvas experience isn't active but
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

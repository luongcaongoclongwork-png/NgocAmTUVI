"use client";

import { useEffect, useState } from "react";

/**
 * true below 1024px — the mobile chart experience's own breakpoint: phones and
 * upright tablets, where the 980px desktop grid would not fit (matches the
 * Tailwind `lg` the chart components use to show/hide the desktop grid).
 * Starts `false` so SSR/first paint matches desktop; corrected client-side
 * via matchMedia before the user can interact.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

/**
 * true below 700px — a phone held upright. There the scaled-down grid would
 * leave its text under 9px, so the overview is drawn compact instead
 * (xtd/mobile/XtdMobileCompactOverview.tsx). Starts `false` like useIsMobile.
 */
export function useIsCompactChart(): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 699px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return compact;
}

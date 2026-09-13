"use client";

import { useEffect, useState } from "react";

/**
 * true below 768px — the mobile chart experience's own breakpoint (separate
 * from Tailwind's `lg` used elsewhere on this page for toolbar/legend text).
 * Starts `false` so SSR/first paint matches desktop; corrected client-side
 * via matchMedia before the user can interact.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

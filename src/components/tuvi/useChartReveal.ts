"use client";

import { useEffect, useState } from "react";

/**
 * The chart's entrance (xtd/xtdMotion.css, `data-reveal="run"`): plays once
 * when the chart mounts, like every page's entrance, then switches off so
 * later re-renders (a new target year, a palace selected) never replay it.
 * Reduced motion is handled in the CSS.
 */
export function useChartReveal(): "run" | undefined {
  const [phase, setPhase] = useState<"run" | undefined>("run");
  useEffect(() => {
    const t = setTimeout(() => setPhase(undefined), 2600);
    return () => clearTimeout(t);
  }, []);
  return phase;
}

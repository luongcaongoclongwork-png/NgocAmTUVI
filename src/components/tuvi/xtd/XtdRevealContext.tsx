"use client";

import { createContext, useContext } from "react";

/**
 * Where the chart's one-time reveal is ("Khai mo mot la so"):
 *  - "off":     nothing special — the chart is simply shown (default, reloads,
 *               back-navigation, reduced motion, print/export trees);
 *  - "pending": arrived from the form; every animated part is hidden (opacity
 *               only, no layout change) until fonts + the fit guard have
 *               settled, so nothing jumps while it builds;
 *  - "run":     the reveal plays (CSS, keyed off `data-reveal` in xtdMotion.css).
 */
export type RevealPhase = "off" | "pending" | "run";

export const XtdRevealContext = createContext<RevealPhase>("off");

export function useXtdReveal(): RevealPhase {
  return useContext(XtdRevealContext);
}

import type { CSSProperties } from "react";
import type { VietnameseStar } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Presentation-only: a CSS color swatch per Ngu Hanh element. The
 * star -> element assignment itself is NOT decided here — it already comes
 * from the engine (see locale/starNames.vi.ts, wired through
 * VietnameseStar.element by vietnameseAdapter.ts). This file only answers
 * "what color should the 'Hoa' label paint with", never "is this star Hoa".
 * Tied to the chart's existing --na-* palette rather than inventing new hues.
 */
export const ELEMENT_COLOR: Record<NonNullable<VietnameseStar["element"]>, string> = {
  Kim: "#7d7466",
  Mộc: "#4c7a4f",
  Thủy: "#2f4858",
  Hỏa: "var(--na-cinnabar)",
  Thổ: "var(--na-gold)",
};

export function starColorVar(star: VietnameseStar): CSSProperties | undefined {
  if (!star.element) return undefined;
  return { "--star-color": ELEMENT_COLOR[star.element] } as CSSProperties;
}

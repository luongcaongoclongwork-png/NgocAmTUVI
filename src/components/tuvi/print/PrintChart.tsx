"use client";

import { useRef } from "react";
import TuViChartGrid from "../TuViChartGrid";
import PrintCenterSeal from "./PrintCenterSeal";
import { usePrintOverflowGuard } from "./usePrintOverflowGuard";
import { PRINT_ROW_EDGE_OFFSET } from "../TuanTrietOverlay";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Narrows Trung Cung's own width from a plain uniform quarter (50-25=25%
 * each side) to ~22.75% each, widening the 2 outer columns to ~27.25%
 * each — chosen by hand (not content-measured) 2026-09-15 so the 12
 * outer palaces get more width for their 2-column phu-tinh/luu-tinh
 * grids without Trung Cung's own text needing a smaller font (only its
 * CSS padding/gaps were retuned to fit — see print.css's .center-palace
 * rules). Symmetric on purpose: keeps the vertical divider at the exact
 * midpoint of Trung Cung (x=50) so StructuralGridSVG's line math doesn't
 * need a 3rd column edge.
 */
const PRINT_COLUMN_BOUNDARIES: [number, number, number, number, number] = [0, 27.25, 50, 72.75, 100];

/**
 * The 194x225mm chart area for the A4 print page (deliberately not square
 * — see print.css's own comment on .print-chart). Reuses TuViChartGrid
 * as-is (the exact StructuralGridSVG + PalaceCell x12 + CenterPalace +
 * AspectOverlay + TuanTrietOverlay bundle the live desktop chart and the
 * mobile virtual canvas already share) — print.css overrides its class
 * names for A4 sizing, nothing here computes or re-derives chart data.
 *
 * `useVariableRowHeights` (chartRowLayout.ts) is now ON for print too
 * (re-enabled 2026-09-19 — was deliberately OFF since 2026-09-15, see git
 * history / docs/tuvi-engine-audit.md section 7 for why: it helped one
 * benchmark chart but made a more extreme one worse). What changed: it's
 * no longer print's ONLY line of defense. `usePrintOverflowGuard` below
 * now measures every cell's real rendered content after row reallocation
 * has already done its part, and shrinks (via `--pz-scale`, see
 * print.css) only the specific cell(s) that still overflow — so a chart
 * that row-reallocation alone would have made worse now gets caught by
 * the per-cell guard instead of silently losing content. Re-verify this
 * doesn't regress if either mechanism is ever touched again; both are
 * meant to compose, not substitute for each other.
 *
 * `tuanTrietRowEdgeOffset={PRINT_ROW_EDGE_OFFSET}` — print's own row
 * proportions (narrower Trung Cung columns, mm-based sizing) made the
 * web-tuned default land Tuần/Triệt labels on real text far more often
 * here than on web (measured 2026-09-19: only ~40% collision-free at the
 * web default vs 80-100% at this value) — see TuanTrietOverlay.tsx's own
 * comment for the full picture.
 */
export default function PrintChart({
  chart,
  birthTime,
  horoscope,
  onOverflowGuardSettled,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope: VietnameseHoroscopeDTO | null;
  /** Fires once every palace cell has been measured and (if needed) shrunk to fit — PrintPageClient.tsx gates its autoprint `window.print()` call on this so the OS print dialog never opens on a still-overflowing layout. */
  onOverflowGuardSettled?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  usePrintOverflowGuard(containerRef, [chart, horoscope], onOverflowGuardSettled);

  return (
    <div className="print-chart" ref={containerRef}>
      <TuViChartGrid
        chart={chart}
        birthTime={birthTime}
        horoscope={horoscope}
        selectedIndex={null}
        onSelectPalace={() => {}}
        tabIndexFor={() => -1}
        showAspectOverlay={false}
        useVariableRowHeights
        columnBoundaries={PRINT_COLUMN_BOUNDARIES}
        centerPrintSeal={<PrintCenterSeal />}
        tuanTrietRowEdgeOffset={PRINT_ROW_EDGE_OFFSET}
      />
    </div>
  );
}

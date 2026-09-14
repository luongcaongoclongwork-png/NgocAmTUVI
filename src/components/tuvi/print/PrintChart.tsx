import TuViChartGrid from "../TuViChartGrid";
import PrintCenterSeal from "./PrintCenterSeal";
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
 * Deliberately does NOT pass `useVariableRowHeights` (chartRowLayout.ts) —
 * unlike the live desktop chart (TuViChart.tsx), which does. Tested
 * 2026-09-15 against 2 real charts: it clearly helps the moderate case
 * ("Trang" benchmark: worst overflow 17.5px -> 10.8px) but made a more
 * extreme one worse (targetYear === birth year, unusually Luu-Nien-heavy:
 * worst overflow 24.2px -> 30.1px, and turned 3 previously-safe palaces
 * overflowing too) — that specific chart is ALREADY overflowing under
 * today's plain equal-fourths grid regardless of this flag, from a deeper,
 * separate cause (paletteDensity.ts's tier scoring under-counting a
 * 0-major/high-minor+adjective+luu content mix — see
 * docs/tuvi-engine-audit.md section 7). Print's failure mode (paper, no
 * scrolling) is worse than the live chart's, so it stays on the
 * conservative equal-fourths default until that deeper cause is fixed
 * rather than risk trading one print chart's overflow for another's.
 */
export default function PrintChart({
  chart,
  birthTime,
  horoscope,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope: VietnameseHoroscopeDTO | null;
}) {
  return (
    <div className="print-chart">
      <TuViChartGrid
        chart={chart}
        birthTime={birthTime}
        horoscope={horoscope}
        selectedIndex={null}
        onSelectPalace={() => {}}
        tabIndexFor={() => -1}
        showAspectOverlay={false}
        columnBoundaries={PRINT_COLUMN_BOUNDARIES}
      />
      <PrintCenterSeal />
    </div>
  );
}

import TuViChartGrid from "../TuViChartGrid";
import PrintCenterSeal from "./PrintCenterSeal";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * The 184x184mm chart square for the A4 print page. Reuses TuViChartGrid
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
      />
      <PrintCenterSeal />
    </div>
  );
}

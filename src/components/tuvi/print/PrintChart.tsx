import TuViChartGrid from "../TuViChartGrid";
import PrintCenterSeal from "./PrintCenterSeal";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * The 184x184mm chart square for the A4 print page. Reuses TuViChartGrid
 * as-is (the exact StructuralGridSVG + PalaceCell x12 + CenterPalace +
 * AspectOverlay + TuanTrietOverlay bundle the live desktop chart and the
 * mobile virtual canvas already share) — print.css overrides its class
 * names for A4 sizing, nothing here computes or re-derives chart data.
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

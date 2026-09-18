import PrintHeader from "../../print/PrintHeader";
import XtdPrintChart from "./XtdPrintChart";
import PrintFooter from "../../print/PrintFooter";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";
import "../../ngocAmChart.css";
import "../../print/print.css";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../print/A4TuViPrintRenderer.tsx
 * — only diff is importing XtdPrintChart instead of PrintChart. PrintHeader
 * and PrintFooter are reused UNCHANGED (shared, not duplicated): neither
 * renders any star/palace/cycle name (grepped 2026-09-19 — only the
 * sitewide "XUYÊN TAM DIỆM" brand text, which stays as-is everywhere except
 * the picker option label, per that day's decision).
 */
export default function XtdA4TuViPrintRenderer({
  chart,
  birthTime,
  horoscope,
  onOverflowGuardSettled,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope: VietnameseHoroscopeDTO | null;
  onOverflowGuardSettled?: () => void;
}) {
  return (
    <div id="tuvi-print-root">
      <div className="tuvi-print-page ngoc-am-chart-root">
        <div className="tuvi-print-inner">
          <PrintHeader />
          <div className="print-chart-wrap">
            <XtdPrintChart chart={chart} birthTime={birthTime} horoscope={horoscope} onOverflowGuardSettled={onOverflowGuardSettled} />
          </div>
          <div className="print-bottom-strip">
            <PrintFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

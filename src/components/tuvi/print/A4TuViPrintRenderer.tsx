import PrintHeader from "./PrintHeader";
import PrintChart from "./PrintChart";
import PrintFooter from "./PrintFooter";
import PdfSoftOvals from "./PdfSoftOvals";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";
import "../ngocAmChart.css";
import "./print.css";

/**
 * A4 (210x297mm) print/PDF presentation of a Ngoc Am chart. Reads ONE
 * chartResult (VietnameseChartDTO) plus the optional Luu Nien horoscope
 * overlay for it — the exact same objects TuViChart.tsx already renders on
 * screen, not a second computation. This component and everything under
 * print/ only rename, group, and size — see rule 47.
 */
export default function A4TuViPrintRenderer({
  chart,
  birthTime,
  horoscope,
  onOverflowGuardSettled,
  forPdf = false,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope: VietnameseHoroscopeDTO | null;
  /** Passed straight through to PrintChart — see its own prop comment. */
  onOverflowGuardSettled?: () => void;
  /** The off-screen copy "Xuất PDF" captures: its two soft ovals are drawn on canvas (see PdfSoftOvals). Never set on the printed page. */
  forPdf?: boolean;
}) {
  return (
    <div id="tuvi-print-root">
      <div className={`tuvi-print-page ngoc-am-chart-root${forPdf ? " tuvi-print-page--pdf" : ""}`}>
        {forPdf && <PdfSoftOvals />}
        <div className="tuvi-print-inner">
          <PrintHeader />
          <div className="print-chart-wrap">
            <PrintChart chart={chart} birthTime={birthTime} horoscope={horoscope} onOverflowGuardSettled={onOverflowGuardSettled} />
          </div>
          <div className="print-bottom-strip">
            <PrintFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

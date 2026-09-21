"use client";

import { useRef, useState } from "react";
import XtdTuViChartGrid from "../XtdTuViChartGrid";
import PrintCenterSeal from "../../print/PrintCenterSeal";
import { useXtdPrintFit, XTD_PRINT_MAX_SCALE } from "./useXtdPrintFit";
import type { RowLayout } from "../../chartRowLayout";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../print/PrintChart.tsx — same
 * A4 sizing/column boundaries, only diff is importing XtdTuViChartGrid instead
 * of TuViChartGrid so the print tree's star/palace text goes through the Xtd
 * naming layer too. PrintCenterSeal is reused UNCHANGED (shared, not
 * duplicated) — it renders no star/palace/cycle text.
 *
 * Fit is NOT the traditional print's one-knob usePrintOverflowGuard: it is
 * useXtdPrintFit (auto text size up to XTD_PRINT_MAX_SCALE, measured row split,
 * spacing squeeze, per-cell shrink, last-resort floor). It reports the row
 * split back through `rows`, which the grid (and its SVG grid lines) draws.
 * `onOverflowGuardSettled` fires when all of that is done, so auto-print and
 * the PDF export still wait for a finished layout.
 */
const PRINT_COLUMN_BOUNDARIES: [number, number, number, number, number] = [0, 27.25, 50, 72.75, 100];

export default function XtdPrintChart({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<RowLayout | undefined>(undefined);

  useXtdPrintFit(containerRef, [chart, horoscope], setRows, onOverflowGuardSettled, { maxScale: XTD_PRINT_MAX_SCALE });

  return (
    <div className="print-chart" ref={containerRef}>
      <XtdTuViChartGrid
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
        rowLayoutOverride={rows}
      />
    </div>
  );
}

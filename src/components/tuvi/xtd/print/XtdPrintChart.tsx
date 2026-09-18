"use client";

import { useRef } from "react";
import XtdTuViChartGrid from "../XtdTuViChartGrid";
import PrintCenterSeal from "../../print/PrintCenterSeal";
import { usePrintOverflowGuard } from "../../print/usePrintOverflowGuard";
import { PRINT_ROW_EDGE_OFFSET } from "../../TuanTrietOverlay";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../print/PrintChart.tsx — same
 * A4 sizing/column-boundary/overflow-guard behavior, only diff is importing
 * XtdTuViChartGrid instead of TuViChartGrid so the print tree's star/palace
 * text goes through the Xtd naming layer too. PrintCenterSeal,
 * usePrintOverflowGuard and PRINT_ROW_EDGE_OFFSET are reused UNCHANGED
 * (shared, not duplicated) — none of them render star/palace/cycle text.
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

  usePrintOverflowGuard(containerRef, [chart, horoscope], onOverflowGuardSettled);

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
        tuanTrietRowEdgeOffset={PRINT_ROW_EDGE_OFFSET}
      />
    </div>
  );
}

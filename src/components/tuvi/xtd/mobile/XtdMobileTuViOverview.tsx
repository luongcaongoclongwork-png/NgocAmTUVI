"use client";

import { useRef, type ReactNode } from "react";
import XtdTuViChartGrid from "../XtdTuViChartGrid";
import { MobileScaleViewport } from "../../mobile/MobileScaleViewport";
import { useChartFitGuard } from "../useChartFitGuard";
import { useXtdReveal } from "../XtdRevealContext";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

export type MobileSelection = { kind: "palace"; index: number } | { kind: "center" };

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../mobile/MobileTuViOverview.tsx
 * — only diff is importing XtdTuViChartGrid instead of TuViChartGrid.
 * MobileScaleViewport is reused UNCHANGED (pure scaling wrapper, no text).
 * Also runs the same per-cell fit guard as the desktop chart, so crowded cells
 * never push stars into the footer on phones either.
 */
/**
 * The canvas div + its fit guard live in their own component because
 * MobileScaleViewport only renders its children once the scale is known — a
 * ref/effect in the parent would run while the canvas doesn't exist yet.
 */
function FitCanvas({
  chart,
  horoscope,
  children,
}: {
  chart: VietnameseChartDTO;
  horoscope: VietnameseHoroscopeDTO | null;
  children: ReactNode;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  useChartFitGuard(canvasRef, [chart, horoscope]);
  const reveal = useXtdReveal();
  return (
    <div ref={canvasRef} className="mobile-tuvi-canvas" data-reveal={reveal === "off" ? undefined : reveal}>
      {children}
    </div>
  );
}

export function XtdMobileTuViOverview({
  chart,
  birthTime,
  horoscope,
  selection,
  onSelect,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope: VietnameseHoroscopeDTO | null;
  selection: MobileSelection;
  onSelect: (selection: MobileSelection) => void;
}) {
  return (
    <section className="mobile-tuvi-overview">
      <div className="mobile-chart-hint">Toàn cảnh lá số · Chạm một khám để xem chi tiết</div>

      <MobileScaleViewport>
        <FitCanvas chart={chart} horoscope={horoscope}>
          <XtdTuViChartGrid
            chart={chart}
            birthTime={birthTime}
            horoscope={horoscope}
            selectedIndex={selection.kind === "palace" ? selection.index : null}
            onSelectPalace={(index) => onSelect({ kind: "palace", index })}
            onSelectCenter={() => onSelect({ kind: "center" })}
            centerSelected={selection.kind === "center"}
            showAspectOverlay={selection.kind === "palace"}
            lantern
          />
        </FitCanvas>
      </MobileScaleViewport>
    </section>
  );
}

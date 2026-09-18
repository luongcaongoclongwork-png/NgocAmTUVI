import XtdTuViChartGrid from "../XtdTuViChartGrid";
import { MobileScaleViewport } from "../../mobile/MobileScaleViewport";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

export type MobileSelection = { kind: "palace"; index: number } | { kind: "center" };

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../mobile/MobileTuViOverview.tsx
 * — only diff is importing XtdTuViChartGrid instead of TuViChartGrid.
 * MobileScaleViewport is reused UNCHANGED (pure scaling wrapper, no text).
 */
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
        <div className="mobile-tuvi-canvas">
          <XtdTuViChartGrid
            chart={chart}
            birthTime={birthTime}
            horoscope={horoscope}
            selectedIndex={selection.kind === "palace" ? selection.index : null}
            onSelectPalace={(index) => onSelect({ kind: "palace", index })}
            onSelectCenter={() => onSelect({ kind: "center" })}
            centerSelected={selection.kind === "center"}
            showAspectOverlay={selection.kind === "palace"}
          />
        </div>
      </MobileScaleViewport>
    </section>
  );
}

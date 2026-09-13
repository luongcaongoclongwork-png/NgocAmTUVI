import TuViChartGrid from "../TuViChartGrid";
import { MobileScaleViewport } from "./MobileScaleViewport";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

export type MobileSelection = { kind: "palace"; index: number } | { kind: "center" };

/**
 * "Toan canh la so" — the full 12-cung + Trung Cung chart rendered at the
 * fixed 747x1032 virtual canvas (MOBILE_TUVI_CANVAS) via the SAME
 * TuViChartGrid the desktop chart uses, then scaled down to fit the phone.
 * This is a map: tap a palace (or the center) to drive the detail panel
 * below, not a place to read every star at full size.
 */
export function MobileTuViOverview({
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
      <div className="mobile-chart-hint">Toàn cảnh lá số · Chạm một cung để xem chi tiết</div>

      <MobileScaleViewport>
        <div className="mobile-tuvi-canvas">
          <TuViChartGrid
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

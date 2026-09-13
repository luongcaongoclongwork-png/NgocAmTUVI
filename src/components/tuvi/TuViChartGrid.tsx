import PalaceCell from "./PalaceCell";
import CenterPalace from "./CenterPalace";
import AspectOverlay from "./AspectOverlay";
import TuanTrietOverlay from "./TuanTrietOverlay";
import StructuralGridSVG from "./StructuralGridSVG";
import { BRANCH_GRID_POSITION, CENTER_GRID_AREA } from "@/lib/tuvi/rules/palaces";
import { giapCungIndices, tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import type { PalaceHoroscopeView } from "./PalaceCell";
import type { BirthInput, VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * The 4x4 grid + Trung Cung + relation/Tuan-Triet overlays — the ONE piece
 * of chart markup shared by the desktop chart and the mobile virtual-canvas
 * overview (see mobile/MobileTuViOverview.tsx), so there is exactly one
 * place that renders PalaceCell/CenterPalace against real chart data.
 * Sizing/typography differ only via the CSS class on the parent wrapper
 * (`.ngoc-am-chart` for desktop, `.mobile-tuvi-canvas` for mobile) — this
 * component itself carries no fixed dimensions.
 */

export function buildPalaceHoroscopeView(
  horoscope: VietnameseHoroscopeDTO | null,
  index: number,
): PalaceHoroscopeView | undefined {
  if (!horoscope) return undefined;
  return {
    daiVanPalaceName: horoscope.decadal.palaceNameByIndex[index],
    luuNienPalaceName: horoscope.yearly.palaceNameByIndex[index],
    luuStars: horoscope.yearly.starsByIndex[index],
    suiQian: horoscope.yearly.suiQianByIndex[index],
    jiangQian: horoscope.yearly.jiangQianByIndex[index],
    mutagenByStarId: horoscope.yearly.mutagenByStarId,
  };
}

export interface TuViChartGridProps {
  chart: VietnameseChartDTO;
  birthTime?: string;
  birthInput?: BirthInput;
  horoscope: VietnameseHoroscopeDTO | null;
  selectedIndex: number | null;
  onSelectPalace: (index: number) => void;
  tabIndexFor?: (index: number) => 0 | -1;
  cellRef?: (index: number, el: HTMLButtonElement | null) => void;
  onKeyDownPalace?: (index: number, e: React.KeyboardEvent<HTMLButtonElement>) => void;
  /** When provided, the Trung Cung becomes tappable too (mobile: opens the center detail panel). Desktop doesn't pass this — CenterPalace stays non-interactive there, unchanged. */
  onSelectCenter?: () => void;
  centerSelected?: boolean;
  /** Desktop always shows tam hop/xung chieu/giap cung lines; mobile overview can skip them to keep the map reading clean. Defaults to true. */
  showAspectOverlay?: boolean;
}

export default function TuViChartGrid({
  chart,
  birthTime,
  horoscope,
  selectedIndex,
  onSelectPalace,
  tabIndexFor,
  cellRef,
  onKeyDownPalace,
  onSelectCenter,
  centerSelected,
  showAspectOverlay = true,
}: TuViChartGridProps) {
  const giapIndices: number[] = selectedIndex === null ? [] : giapCungIndices(selectedIndex);
  const tamHop: number[] = selectedIndex === null ? [] : tamHopIndices(selectedIndex);
  const xungChieu = selectedIndex === null ? -1 : xungChieuIndex(selectedIndex);

  function emphasisFor(index: number): "tam-hop" | "xung-chieu" | "giap-cung" | undefined {
    if (selectedIndex === null || index === selectedIndex) return undefined;
    if (index === xungChieu) return "xung-chieu";
    if (tamHop.includes(index)) return "tam-hop";
    if (giapIndices.includes(index)) return "giap-cung";
    return undefined;
  }

  const center = (
    <div style={{ gridArea: CENTER_GRID_AREA }}>
      <CenterPalace chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} />
    </div>
  );

  return (
    <>
      <StructuralGridSVG />
      <div className="ngoc-am-grid">
        {chart.palaces.map((p) => {
          const palaceHoroscope = buildPalaceHoroscopeView(horoscope, p.index);
          return (
            <div key={p.index} style={{ gridArea: `${BRANCH_GRID_POSITION[p.branch].row} / ${BRANCH_GRID_POSITION[p.branch].col} / span 1 / span 1` }}>
              <PalaceCell
                palace={p}
                selected={selectedIndex === p.index}
                emphasis={emphasisFor(p.index)}
                horoscope={palaceHoroscope}
                tabIndex={tabIndexFor ? tabIndexFor(p.index) : 0}
                cellRef={cellRef ? (el) => cellRef(p.index, el) : undefined}
                onKeyDown={onKeyDownPalace ? (e) => onKeyDownPalace(p.index, e) : undefined}
                onSelect={() => onSelectPalace(p.index)}
              />
            </div>
          );
        })}

        {onSelectCenter ? (
          <button
            type="button"
            onClick={onSelectCenter}
            aria-pressed={centerSelected}
            aria-label="Trung cung — thông tin lá số. Chạm để xem chi tiết."
            data-selected={centerSelected || undefined}
            className="center-palace-trigger"
            style={{ gridArea: CENTER_GRID_AREA }}
          >
            <CenterPalace chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} />
          </button>
        ) : (
          center
        )}
      </div>

      {showAspectOverlay && <AspectOverlay palaces={chart.palaces} selectedIndex={selectedIndex} />}
      <TuanTrietOverlay tuan={chart.tuan} triet={chart.triet} />
    </>
  );
}

import XtdPalaceCell from "./XtdPalaceCell";
import XtdCenterPalace from "./XtdCenterPalace";
import AspectOverlay from "../AspectOverlay";
import StructuralGridSVG from "../StructuralGridSVG";
import { computeRowLayout, UNIFORM_ROW_LAYOUT } from "../chartRowLayout";
import { BRANCH_GRID_POSITION, CENTER_GRID_AREA } from "@/lib/tuvi/rules/palaces";
import { giapCungIndices, tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import { buildPalaceHoroscopeView } from "../TuViChartGrid";
import type { PalaceHoroscopeView } from "./XtdPalaceCell";
import type { BirthInput, VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";
import type { CSSProperties } from "react";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../TuViChartGrid.tsx — identical
 * grid/overlay layout and prop contract; the only diff is importing
 * XtdPalaceCell/XtdCenterPalace instead of the originals, so every star/
 * palace name painted inside this grid goes through the Xtd naming layer.
 * Tuan/Triet are NOT drawn with the shared floating TuanTrietOverlay here:
 * XtdPalaceCell renders them as an in-flow badge line at the bottom of each
 * covered cell (so they can never sit on other text) and this grid tells
 * computeRowLayout to weigh that extra line.
 * buildPalaceHoroscopeView is reused from the original file too — it's a
 * pure data mapper with no rendered text, nothing to translate.
 */

export interface XtdTuViChartGridProps {
  chart: VietnameseChartDTO;
  birthTime?: string;
  birthInput?: BirthInput;
  horoscope: VietnameseHoroscopeDTO | null;
  selectedIndex: number | null;
  onSelectPalace: (index: number) => void;
  tabIndexFor?: (index: number) => 0 | -1;
  cellRef?: (index: number, el: HTMLButtonElement | null) => void;
  onKeyDownPalace?: (index: number, e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onSelectCenter?: () => void;
  centerSelected?: boolean;
  showAspectOverlay?: boolean;
  useVariableRowHeights?: boolean;
  columnBoundaries?: [number, number, number, number, number];
  centerPrintSeal?: React.ReactNode;
}

const UNIFORM_COLUMN_BOUNDARIES: [number, number, number, number, number] = [0, 25, 50, 75, 100];

export default function XtdTuViChartGrid({
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
  useVariableRowHeights = false,
  columnBoundaries,
  centerPrintSeal,
}: XtdTuViChartGridProps) {
  const giapIndices: number[] = selectedIndex === null ? [] : giapCungIndices(selectedIndex);
  const tamHop: number[] = selectedIndex === null ? [] : tamHopIndices(selectedIndex);
  const xungChieu = selectedIndex === null ? -1 : xungChieuIndex(selectedIndex);

  const rowLayout = useVariableRowHeights ? computeRowLayout(chart, horoscope ?? null, { zoneBadge: true }) : UNIFORM_ROW_LAYOUT;
  const resolvedColumnBoundaries = columnBoundaries ?? UNIFORM_COLUMN_BOUNDARIES;

  function emphasisFor(index: number): "tam-hop" | "xung-chieu" | "giap-cung" | undefined {
    if (selectedIndex === null || index === selectedIndex) return undefined;
    if (index === xungChieu) return "xung-chieu";
    if (tamHop.includes(index)) return "tam-hop";
    if (giapIndices.includes(index)) return "giap-cung";
    return undefined;
  }

  const center = (
    <div style={{ gridArea: CENTER_GRID_AREA }}>
      <XtdCenterPalace chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} printSeal={centerPrintSeal} />
    </div>
  );

  const gridStyle: CSSProperties = {};
  if (useVariableRowHeights) gridStyle.gridTemplateRows = rowLayout.heights.map((h) => `${h}%`).join(" ");
  if (columnBoundaries) {
    const [c0, c1, c2, c3, c4] = columnBoundaries;
    gridStyle.gridTemplateColumns = [c1 - c0, c2 - c1, c3 - c2, c4 - c3].map((w) => `${w}%`).join(" ");
  }

  return (
    <>
      <StructuralGridSVG rowBoundaries={rowLayout.boundaries} columnBoundaries={resolvedColumnBoundaries} />
      <div
        className="ngoc-am-grid"
        style={Object.keys(gridStyle).length > 0 ? gridStyle : undefined}
      >
        {chart.palaces.map((p) => {
          const palaceHoroscope: PalaceHoroscopeView | undefined = buildPalaceHoroscopeView(horoscope, p.index);
          return (
            <div key={p.index} style={{ gridArea: `${BRANCH_GRID_POSITION[p.branch].row} / ${BRANCH_GRID_POSITION[p.branch].col} / span 1 / span 1` }}>
              <XtdPalaceCell
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
            <XtdCenterPalace chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} printSeal={centerPrintSeal} />
          </button>
        ) : (
          center
        )}
      </div>

      {showAspectOverlay && (
        <AspectOverlay palaces={chart.palaces} selectedIndex={selectedIndex} rowBoundaries={rowLayout.boundaries} />
      )}
    </>
  );
}

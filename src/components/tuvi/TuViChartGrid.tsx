import PalaceCell from "./PalaceCell";
import CenterPalace from "./CenterPalace";
import AspectOverlay from "./AspectOverlay";
import TuanTrietOverlay from "./TuanTrietOverlay";
import StructuralGridSVG from "./StructuralGridSVG";
import { computeRowLayout, UNIFORM_ROW_LAYOUT } from "./chartRowLayout";
import { BRANCH_GRID_POSITION, CENTER_GRID_AREA } from "@/lib/tuvi/rules/palaces";
import { giapCungIndices, tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import type { PalaceHoroscopeView } from "./PalaceCell";
import type { BirthInput, VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";
import type { CSSProperties } from "react";

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
  /**
   * Reallocate the 4 grid rows by real content weight (chartRowLayout.ts)
   * instead of a fixed equal 25/25/25/25 split — see
   * docs/tuvi-engine-audit.md section 7's "F + D" plan. Off by default so
   * the mobile virtual canvas (MOBILE_TUVI_CANVAS's own tuned 747x1032
   * fixed proportions) is completely unaffected; desktop and print opt in.
   */
  useVariableRowHeights?: boolean;
  /**
   * Column edges (0-100), narrowing Trung Cung's width and widening the
   * outer columns — a fixed hand-chosen split, not content-computed like
   * rowLayout above. Only PrintChart.tsx passes this (see print.css's own
   * comment on `.ngoc-am-grid`); every other caller keeps uniform quarters.
   */
  columnBoundaries?: [number, number, number, number, number];
  /** Print-only red seal, passed straight through to CenterPalace so it
   * renders inside Trung Cung's own box. Only PrintChart.tsx passes this. */
  centerPrintSeal?: React.ReactNode;
  /** Passed straight through to TuanTrietOverlay — see its own prop comment (PRINT_ROW_EDGE_OFFSET vs the default). Only PrintChart.tsx overrides this. */
  tuanTrietRowEdgeOffset?: number;
}

const UNIFORM_COLUMN_BOUNDARIES: [number, number, number, number, number] = [0, 25, 50, 75, 100];

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
  useVariableRowHeights = false,
  columnBoundaries,
  centerPrintSeal,
  tuanTrietRowEdgeOffset,
}: TuViChartGridProps) {
  const giapIndices: number[] = selectedIndex === null ? [] : giapCungIndices(selectedIndex);
  const tamHop: number[] = selectedIndex === null ? [] : tamHopIndices(selectedIndex);
  const xungChieu = selectedIndex === null ? -1 : xungChieuIndex(selectedIndex);

  const rowLayout = useVariableRowHeights ? computeRowLayout(chart, horoscope ?? null) : UNIFORM_ROW_LAYOUT;
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
      <CenterPalace chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} printSeal={centerPrintSeal} />
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
            <CenterPalace chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} printSeal={centerPrintSeal} />
          </button>
        ) : (
          center
        )}
      </div>

      {showAspectOverlay && (
        <AspectOverlay palaces={chart.palaces} selectedIndex={selectedIndex} rowBoundaries={rowLayout.boundaries} />
      )}
      <TuanTrietOverlay
        tuan={chart.tuan}
        triet={chart.triet}
        rowBoundaries={rowLayout.boundaries}
        columnBoundaries={resolvedColumnBoundaries}
        rowEdgeOffset={tuanTrietRowEdgeOffset}
      />
    </>
  );
}

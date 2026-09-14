"use client";

import { useMemo, useRef, useState } from "react";
import TuViChartGrid from "./TuViChartGrid";
import { MobileTuViExperience } from "./mobile/MobileTuViExperience";
import { useIsMobile } from "./mobile/useIsMobile";
import { useChartBaseWidth } from "./useChartBaseWidth";
import { BRANCH_GRID_POSITION } from "@/lib/tuvi/rules/palaces";
import { giapCungIndices, tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import { exportChartAsImage } from "@/lib/tuvi/export/chartExport";
import { generateHoroscope } from "@/lib/tuvi/engine/chartEngine";
import type { BirthInput, VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";
import "./ngocAmChart.css";
import "./mobile/tuviMobile.css";

function exportFileBaseName(chart: VietnameseChartDTO): string {
  const namePart = chart.name?.trim().replace(/\s+/g, "-") || "la-so";
  const datePart = chart.solarDate.replace(/[^0-9]/g, "-");
  return `ngoc-am-${namePart}-${datePart}`;
}

export default function TuViChart({
  chart,
  birthTime,
  birthInput,
  targetYear,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  /** When provided (together with `targetYear`), enables the Luu Nien (annual transit) overlay — see engine/horoscopeAdapter.ts. */
  birthInput?: BirthInput;
  /** "Năm xem" — the stepper for this lives in BirthForm's "Thông tin lá số" card, not here. */
  targetYear?: number;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [exporting, setExporting] = useState<"image" | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const exportRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const isMobile = useIsMobile();
  const baseWidth = useChartBaseWidth();

  /** Roving tabindex 2D navigation (spec: ArrowLeft/Right/Up/Down move between the 12 palaces). Desktop-only — the mobile experience doesn't use a branch-ring grid. */
  function handlePalaceKeyDown(index: number, e: React.KeyboardEvent<HTMLButtonElement>) {
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
    };
    const delta = deltas[e.key];
    if (!delta) return;
    e.preventDefault();
    const from = chart.palaces.find((p) => p.index === index);
    if (!from) return;
    const { row, col } = BRANCH_GRID_POSITION[from.branch];
    const [dRow, dCol] = delta;
    let targetRow = row + dRow;
    let targetCol = col + dCol;
    // The grid has a 2x2 hole in the center (Trung Cung) — step past it instead of landing on nothing.
    for (let guard = 0; guard < 4; guard++) {
      const target = chart.palaces.find((p) => {
        const pos = BRANCH_GRID_POSITION[p.branch];
        return pos.row === targetRow && pos.col === targetCol;
      });
      if (target) {
        setFocusedIndex(target.index);
        cellRefs.current.get(target.index)?.focus();
        return;
      }
      targetRow += dRow;
      targetCol += dCol;
      if (targetRow < 1 || targetRow > 4 || targetCol < 1 || targetCol > 4) return;
    }
  }

  // Computed once here and shared, as the same `horoscope` object, by both
  // the desktop chart and the mobile experience below — neither recomputes
  // it, and switching between mobile/desktop (resize, rotate) never
  // re-triggers this (only birthInput/targetYear/profile do).
  const horoscope = useMemo(() => {
    if (!birthInput || targetYear === undefined) return null;
    try {
      return generateHoroscope(birthInput, targetYear, chart.profile);
    } catch (err) {
      console.error("Horoscope overlay failed:", err);
      return null;
    }
  }, [birthInput, targetYear, chart.profile]);

  const giapIndices: number[] = selectedIndex === null ? [] : giapCungIndices(selectedIndex);
  const tamHop: number[] = selectedIndex === null ? [] : tamHopIndices(selectedIndex);
  const xungChieu = selectedIndex === null ? -1 : xungChieuIndex(selectedIndex);

  async function handleExportImage() {
    if (!exportRef.current || exporting) return;
    setExporting("image");
    try {
      const baseName = exportFileBaseName(chart);
      await exportChartAsImage(exportRef.current, `${baseName}.png`);
    } catch (err) {
      console.error("Chart export failed:", err);
      window.alert("Không thể xuất lá số lúc này. Vui lòng thử lại.");
    } finally {
      setExporting(null);
    }
  }

  /** Opens the dedicated A4 print/PDF route in a new tab — sessionStorage
   * (read by /la-so/print via loadChartInput()) is only copied to a tab
   * opened this way (a same-origin script-initiated window.open), not to
   * one opened with noopener/noreferrer or a manually typed URL, so this
   * intentionally omits those. Re-derives the SAME chart via the SAME
   * generateChart() call, not a screenshot of this one — see
   * components/tuvi/print/.
   *
   * "Xuất PDF" and "In lá số" are two independent entry points into the
   * SAME print-ready page, not one button doing double duty: this one just
   * opens the page (the user saves it as PDF themselves from the browser's
   * own print dialog, or via the "In lá số" button below). The
   * `?autoprint=1` flag is what PrintPageClient.tsx checks to decide
   * whether to fire window.print() on load — this call omits it on
   * purpose. */
  function handleExportPdf() {
    window.open("/la-so/print", "_blank");
  }

  /** Same destination as "Xuất PDF" above, but flagged to auto-open the
   * print dialog immediately — a dedicated, independent print action
   * rather than something that happens as a side effect of exporting a
   * PDF. */
  function handlePrint() {
    window.open("/la-so/print?autoprint=1", "_blank");
  }

  const selectedPalace = chart.palaces.find((p) => p.index === selectedIndex);
  const relationText = (() => {
    if (!selectedPalace) return null;
    const names = (indices: number[]) => indices.map((i) => chart.palaces.find((p) => p.index === i)?.name).filter(Boolean).join(", ");
    return {
      current: selectedPalace.name,
      tamHop: names(tamHop),
      xungChieu: names([xungChieu]),
      giapCung: names(giapIndices),
    };
  })();

  return (
    <div className="ngoc-am-chart-root flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="hidden text-[13px] text-walnut/70 md:block">
          Chạm vào một cung để xem tam hợp (viền vàng, nét đứt), xung chiếu (viền đỏ, nét liền) và giáp cung (viền lục, nét chấm).
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[13px] tracking-[0.04em] text-walnut/70">
            <button
              type="button"
              title="Xuất ảnh"
              onClick={handleExportImage}
              disabled={exporting !== null}
              className="flex h-10 items-center border border-walnut/30 bg-transparent px-3 uppercase tracking-[0.08em] hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:opacity-50"
            >
              {exporting === "image" ? "Đang xuất…" : "Xuất ảnh"}
            </button>
            <button
              type="button"
              title="Xuất PDF"
              onClick={handleExportPdf}
              className="flex h-10 items-center border border-walnut/30 bg-transparent px-3 uppercase tracking-[0.08em] hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Xuất PDF
            </button>
            <button
              type="button"
              title="In lá số"
              onClick={handlePrint}
              className="flex h-10 items-center border border-walnut/30 bg-transparent px-3 uppercase tracking-[0.08em] hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              In lá số
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Mobile (<768px): scaled virtual-canvas overview + dropdown + full-width detail panel. Only mounted while actually mobile — see useIsMobile.ts; the desktop tree below stays mounted regardless (unaffected by this), so Xuat anh/PDF always captures the real 980x980 chart. ---------- */}
      {isMobile && <MobileTuViExperience chart={chart} birthTime={birthTime} horoscope={horoscope} />}

      {/* ---------- Desktop (>=768px): traditional 4x4 chart, unchanged. Visually
          collapsed (not display:none) below md so `exportRef` still captures the
          full traditional chart for Xuất ảnh/PDF regardless of viewport. ---------- */}
      <div className="h-0 overflow-hidden opacity-0 md:h-auto md:overflow-visible md:opacity-100">
        <div className="ngoc-am-chart-scroll">
          <div ref={exportRef} className="relative mx-auto" style={{ width: `${baseWidth}px` }}>
            <section className="ngoc-am-chart">
              <TuViChartGrid
                chart={chart}
                birthTime={birthTime}
                horoscope={horoscope}
                selectedIndex={selectedIndex}
                onSelectPalace={(index) => {
                  setSelectedIndex((cur) => (cur === index ? null : index));
                  setFocusedIndex(index);
                }}
                tabIndexFor={(index) => (focusedIndex === index ? 0 : -1)}
                cellRef={(index, el) => {
                  if (el) cellRefs.current.set(index, el);
                  else cellRefs.current.delete(index);
                }}
                onKeyDownPalace={handlePalaceKeyDown}
              />
            </section>

            <div className="chart-legend">
              <div className="chart-legend-group">
                <span className="chart-legend-group__title">Tương quan</span>
                <span className="flex items-center gap-1.5">
                  <svg width="20" height="2" aria-hidden="true"><line x1="0" y1="1" x2="20" y2="1" stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="4 3" /></svg>
                  Tam hợp
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="20" height="2" aria-hidden="true"><line x1="0" y1="1" x2="20" y2="1" stroke="var(--color-lacquer)" strokeWidth="2" /></svg>
                  Xung chiếu
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="20" height="2" aria-hidden="true"><line x1="0" y1="1" x2="20" y2="1" stroke="#45684c" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" /></svg>
                  Giáp cung
                </span>
              </div>
              <div className="chart-legend-group">
                <span className="chart-legend-group__title">Trạng thái</span>
                <span>
                  <b>M</b> Miếu · <b>V</b> Vượng · <b>Đ</b> Đắc · <b>B</b> Bình · <b>H</b> Hãm
                </span>
              </div>
              <div className="chart-legend-group">
                <span className="chart-legend-group__title">Ngũ hành</span>
                <span>Kim · Mộc · Thủy · Hỏa · Thổ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPalace && relationText && (
        <p aria-live="polite" className="hidden text-[13px] leading-[1.6] text-walnut/75 md:block">
          Cung đang chọn: <strong className="text-ink">{relationText.current}</strong>
          {relationText.tamHop && <> · Tam hợp: {relationText.tamHop}</>}
          {relationText.xungChieu && <> · Xung chiếu: {relationText.xungChieu}</>}
          {relationText.giapCung && <> · Giáp cung: {relationText.giapCung}</>}
        </p>
      )}
    </div>
  );
}

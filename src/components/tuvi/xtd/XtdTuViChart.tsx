"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import XtdTuViChartGrid from "./XtdTuViChartGrid";
import { XtdMobileTuViExperience } from "./mobile/XtdMobileTuViExperience";
import { useIsMobile } from "../mobile/useIsMobile";
import { useChartBaseWidth } from "../useChartBaseWidth";
import { useChartFitGuard } from "./useChartFitGuard";
import { XtdRevealContext, type RevealPhase } from "./XtdRevealContext";
import { BRANCH_GRID_POSITION } from "@/lib/tuvi/rules/palaces";
import { giapCungIndices, tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import { exportChartAsImage, exportChartAsPdf } from "@/lib/tuvi/export/chartExport";
import { generateHoroscope } from "@/lib/tuvi/engine/chartEngine";
import XtdA4TuViPrintRenderer from "./print/XtdA4TuViPrintRenderer";
import { getXtdPalaceName, XTD_RELATION_LABELS, XUYEN_TAM_DIEM_BRIGHTNESS_LABEL } from "@/data/tuvi/xuyen-tam-diem";
import type { BirthInput, VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";
import "../ngocAmChart.css";
import "../mobile/tuviMobile.css";
import "./xtdMotion.css";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../TuViChart.tsx — the top-level
 * chart component (desktop grid + mobile experience + hidden print-export
 * tree + Xuat anh/Xuat PDF/In la so buttons), all identical to the original
 * except: imports XtdTuViChartGrid/XtdMobileTuViExperience/
 * XtdA4TuViPrintRenderer instead of the originals, "In lá số" opens
 * /la-so/print/xuyen-tam-diem instead of /la-so/print, and the "Cung đang
 * chọn" relation line below the chart uses Xtd palace names. Every hook,
 * ref, keyboard-nav, and export call is otherwise byte-identical to the
 * original — see that file's own comments for what each one does.
 */

function exportFileBaseName(chart: VietnameseChartDTO): string {
  const namePart = chart.name?.trim().replace(/\s+/g, "-") || "la-so";
  const datePart = chart.solarDate.replace(/[^0-9]/g, "-");
  return `ngoc-am-xuyen-tam-diem-${namePart}-${datePart}`;
}

export default function XtdTuViChart({
  chart,
  birthTime,
  birthInput,
  targetYear,
  reveal = false,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  birthInput?: BirthInput;
  targetYear?: number;
  /** Arrived from the form: play the one-time "Khai mo" reveal (skipped for reduced motion). */
  reveal?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [exporting, setExporting] = useState<"image" | "pdf" | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const exportRef = useRef<HTMLDivElement>(null);
  const printExportRef = useRef<HTMLDivElement>(null);
  const chartSectionRef = useRef<HTMLElement>(null);
  const cellRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const printOverflowGuardSettledRef = useRef(false);
  const isMobile = useIsMobile();
  const baseWidth = useChartBaseWidth();

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

  const horoscope = useMemo(() => {
    if (!birthInput || targetYear === undefined) return null;
    try {
      return generateHoroscope(birthInput, targetYear, chart.profile);
    } catch (err) {
      console.error("Horoscope overlay failed:", err);
      return null;
    }
  }, [birthInput, targetYear, chart.profile]);

  // One-time reveal: hidden ("pending") until fonts + the fit guard settle, then it plays ("run"), then it is switched off.
  const [revealPhase, setRevealPhase] = useState<RevealPhase>(() =>
    reveal && typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "pending" : "off",
  );
  useEffect(() => {
    if (revealPhase !== "pending") return;
    // Safety net: never leave the chart hidden if the fit guard never reports.
    const t = setTimeout(() => setRevealPhase((p) => (p === "pending" ? "run" : p)), 3000);
    return () => clearTimeout(t);
  }, [revealPhase]);
  useEffect(() => {
    if (revealPhase !== "run") return;
    const t = setTimeout(() => setRevealPhase("off"), 2000);
    return () => clearTimeout(t);
  }, [revealPhase]);

  useChartFitGuard(chartSectionRef, [chart, horoscope], () =>
    requestAnimationFrame(() => setRevealPhase((p) => (p === "pending" ? "run" : p))),
  );

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

  async function handleExportPdf() {
    if (!printExportRef.current || exporting) return;
    setExporting("pdf");
    try {
      await document.fonts.ready;
      const guardDeadline = Date.now() + 3000;
      while (!printOverflowGuardSettledRef.current && Date.now() < guardDeadline) {
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      const baseName = exportFileBaseName(chart);
      await exportChartAsPdf(printExportRef.current, `${baseName}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      window.alert("Không thể xuất PDF lúc này. Vui lòng thử lại.");
    } finally {
      setExporting(null);
    }
  }

  function handlePrint() {
    window.open("/la-so/print/xuyen-tam-diem?autoprint=1", "_blank");
  }

  const selectedPalace = chart.palaces.find((p) => p.index === selectedIndex);
  const relationText = (() => {
    if (!selectedPalace) return null;
    const names = (indices: number[]) =>
      indices.map((i) => chart.palaces.find((p) => p.index === i)?.name).filter(Boolean).map((n) => getXtdPalaceName(n!)).join(", ");
    return {
      current: getXtdPalaceName(selectedPalace.name),
      tamHop: names(tamHop),
      xungChieu: names([xungChieu]),
      giapCung: names(giapIndices),
    };
  })();

  return (
    <XtdRevealContext.Provider value={revealPhase}>
    <div className="ngoc-am-chart-root flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="hidden text-[13px] text-walnut/70 md:block">
          Chạm vào một khám để xem {XTD_RELATION_LABELS.tamHop} (viền vàng, nét đứt), {XTD_RELATION_LABELS.xungChieu} (viền đỏ, nét liền) và {XTD_RELATION_LABELS.giapCung} (viền lục, nét chấm).
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[13px] tracking-[0.04em] text-walnut/70">
            <button
              type="button"
              title="Xuất ảnh"
              onClick={handleExportImage}
              disabled={exporting !== null || revealPhase !== "off"}
              className="flex h-10 items-center border border-walnut/30 bg-transparent px-3 uppercase tracking-[0.08em] hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:opacity-50"
            >
              {exporting === "image" ? "Đang xuất…" : "Xuất ảnh"}
            </button>
            <button
              type="button"
              title="Xuất PDF"
              onClick={handleExportPdf}
              disabled={exporting !== null}
              className="flex h-10 items-center border border-walnut/30 bg-transparent px-3 uppercase tracking-[0.08em] hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:opacity-50"
            >
              {exporting === "pdf" ? "Đang xuất…" : "Xuất PDF"}
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

      {isMobile && <XtdMobileTuViExperience chart={chart} birthTime={birthTime} horoscope={horoscope} />}

      <div aria-hidden="true" className="pointer-events-none fixed left-[-9999px] top-0">
        <div ref={printExportRef}>
          <XtdA4TuViPrintRenderer
            chart={chart}
            birthTime={birthTime}
            horoscope={horoscope}
            onOverflowGuardSettled={() => {
              printOverflowGuardSettledRef.current = true;
            }}
          />
        </div>
      </div>

      <div className="h-0 overflow-hidden opacity-0 md:h-auto md:overflow-visible md:opacity-100">
        <div className="ngoc-am-chart-scroll">
          <div ref={exportRef} className="relative mx-auto" style={{ width: `${baseWidth}px` }}>
            <section ref={chartSectionRef} className="ngoc-am-chart" data-reveal={revealPhase === "off" ? undefined : revealPhase}>
              <XtdTuViChartGrid
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
                useVariableRowHeights
                lantern
              />
            </section>

            <div className="chart-legend">
              <div className="chart-legend-group">
                <span className="chart-legend-group__title">Tương quan</span>
                <span className="flex items-center gap-1.5">
                  <svg width="20" height="2" aria-hidden="true"><line x1="0" y1="1" x2="20" y2="1" stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="4 3" /></svg>
                  {XTD_RELATION_LABELS.tamHop}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="20" height="2" aria-hidden="true"><line x1="0" y1="1" x2="20" y2="1" stroke="var(--color-lacquer)" strokeWidth="2" /></svg>
                  {XTD_RELATION_LABELS.xungChieu}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="20" height="2" aria-hidden="true"><line x1="0" y1="1" x2="20" y2="1" stroke="#45684c" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" /></svg>
                  {XTD_RELATION_LABELS.giapCung}
                </span>
              </div>
              <div className="chart-legend-group">
                <span className="chart-legend-group__title">Trạng thái</span>
                <span>
                  {Object.values(XUYEN_TAM_DIEM_BRIGHTNESS_LABEL).join(" · ")}
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
          Khám đang chọn: <strong className="text-ink">{relationText.current}</strong>
          {relationText.tamHop && <> · {XTD_RELATION_LABELS.tamHop}: {relationText.tamHop}</>}
          {relationText.xungChieu && <> · {XTD_RELATION_LABELS.xungChieu}: {relationText.xungChieu}</>}
          {relationText.giapCung && <> · {XTD_RELATION_LABELS.giapCung}: {relationText.giapCung}</>}
        </p>
      )}
    </div>
    </XtdRevealContext.Provider>
  );
}

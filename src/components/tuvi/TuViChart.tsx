"use client";

import { useState } from "react";
import PalaceCell from "./PalaceCell";
import CenterPalace from "./CenterPalace";
import AspectOverlay from "./AspectOverlay";
import TuanTrietOverlay from "./TuanTrietOverlay";
import { BRANCH_GRID_POSITION, CENTER_GRID_AREA } from "@/lib/tuvi/rules/palaces";
import { giapCungIndices, tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";
import "./ngocAmChart.css";

const ZOOM_STEPS = [0.6, 0.8, 1, 1.25, 1.5];
const BASE_WIDTH = 980;

export default function TuViChart({ chart, birthTime }: { chart: VietnameseChartDTO; birthTime?: string }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoomStep, setZoomStep] = useState(2); // index into ZOOM_STEPS, default 1x

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

  return (
    <div className="ngoc-am-chart-root flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-walnut/60">
          Chạm vào một cung để xem tam hợp (viền vàng đứt), xung chiếu (viền đỏ liền) và giáp cung (viền lục).
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoomStep((z) => Math.max(0, z - 1))}
            className="h-7 w-7 border border-walnut/30 text-walnut hover:border-gold hover:text-gold"
            aria-label="Thu nhỏ"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setZoomStep((z) => Math.min(ZOOM_STEPS.length - 1, z + 1))}
            className="h-7 w-7 border border-walnut/30 text-walnut hover:border-gold hover:text-gold"
            aria-label="Phóng to"
          >
            +
          </button>
        </div>
      </div>

      <div className="ngoc-am-chart-scroll">
        <div
          className="relative mx-auto origin-top transition-[width]"
          style={{ width: `${ZOOM_STEPS[zoomStep] * 100}%`, minWidth: `${BASE_WIDTH * ZOOM_STEPS[zoomStep]}px` }}
        >
          <section className="ngoc-am-chart">
            <div className="ngoc-am-grid">
              {chart.palaces.map((p) => (
                <div key={p.index} style={{ gridArea: `${BRANCH_GRID_POSITION[p.branch].row} / ${BRANCH_GRID_POSITION[p.branch].col} / span 1 / span 1` }}>
                  <PalaceCell
                    palace={p}
                    selected={selectedIndex === p.index}
                    emphasis={emphasisFor(p.index)}
                    onSelect={() => setSelectedIndex((cur) => (cur === p.index ? null : p.index))}
                  />
                </div>
              ))}

              <div style={{ gridArea: CENTER_GRID_AREA }}>
                <CenterPalace chart={chart} birthTime={birthTime} />
              </div>
            </div>

            <AspectOverlay palaces={chart.palaces} selectedIndex={selectedIndex} />
            <TuanTrietOverlay tuan={chart.tuan} triet={chart.triet} />
          </section>

          <div className="chart-legend">
            <span>
              <b>M</b> Miếu · <b>V</b> Vượng · <b>Đ</b> Đắc · <b>B</b> Bình · <b>H</b> Hãm
            </span>
            <span>Kim · Mộc · Thủy · Hỏa · Thổ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

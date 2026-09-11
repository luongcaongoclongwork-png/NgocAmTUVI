"use client";

import { useState } from "react";
import PalaceCell from "./PalaceCell";
import CenterPalace from "./CenterPalace";
import AspectOverlay from "./AspectOverlay";
import TuanTrietOverlay from "./TuanTrietOverlay";
import { BRANCH_GRID_POSITION, CENTER_GRID_AREA } from "@/lib/tuvi/rules/palaces";
import { giapCungIndices, tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

const ZOOM_STEPS = [0.6, 0.8, 1, 1.25, 1.5];

export default function TuViChart({ chart }: { chart: VietnameseChartDTO }) {
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
    <div className="flex flex-col gap-3">
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

      <div className="w-full overflow-x-auto pb-2">
        <div
          className="relative mx-auto aspect-square min-w-[640px] max-w-[820px] origin-top transition-[width]"
          style={{ width: `${ZOOM_STEPS[zoomStep] * 100}%`, minWidth: `${640 * ZOOM_STEPS[zoomStep]}px` }}
        >
          <div className="grid h-full w-full grid-cols-4 grid-rows-4 bg-walnut/10">
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
              <CenterPalace chart={chart} />
            </div>
          </div>

          <AspectOverlay palaces={chart.palaces} selectedIndex={selectedIndex} />
          <TuanTrietOverlay tuan={chart.tuan} triet={chart.triet} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import { MobileTuViOverview, type MobileSelection } from "./MobileTuViOverview";
import { MobilePalaceNavigator } from "./MobilePalaceNavigator";
import { MobilePalaceDetail } from "./MobilePalaceDetail";
import { MobileCenterDetail } from "./MobileCenterDetail";
import { buildPalaceHoroscopeView } from "../TuViChartGrid";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Mobile-only chart experience (<768px) — reads the exact same `chart`
 * (and, when active, `horoscope`) TuViChart already computed once; this
 * component never generates or recalculates anything, only presents.
 */
export function MobileTuViExperience({
  chart,
  birthTime,
  horoscope,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope: VietnameseHoroscopeDTO | null;
}) {
  const defaultPalaceIndex = useMemo(() => {
    const soul = chart.palaces.find((p) => p.isSoulPalace);
    return soul?.index ?? chart.palaces[0]?.index ?? 0;
  }, [chart.palaces]);

  const [selection, setSelection] = useState<MobileSelection>({ kind: "palace", index: defaultPalaceIndex });

  const hasAutoScrolledRef = useRef(false);
  const detailRef = useRef<HTMLDivElement>(null);

  function handleSelect(next: MobileSelection) {
    setSelection(next);
    if (!hasAutoScrolledRef.current) {
      hasAutoScrolledRef.current = true;
      requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        detailRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    }
  }

  const selectedPalace = selection.kind === "palace" ? chart.palaces.find((p) => p.index === selection.index) ?? null : null;

  return (
    <div className="mobile-tuvi-experience">
      <MobileTuViOverview chart={chart} birthTime={birthTime} horoscope={horoscope} selection={selection} onSelect={handleSelect} />

      <MobilePalaceNavigator chart={chart} selection={selection} onSelect={handleSelect} />

      <div ref={detailRef}>
        {selection.kind === "center" ? (
          <MobileCenterDetail chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} />
        ) : selectedPalace ? (
          <MobilePalaceDetail palace={selectedPalace} horoscope={buildPalaceHoroscopeView(horoscope, selectedPalace.index)} />
        ) : null}
      </div>
    </div>
  );
}

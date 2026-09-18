"use client";

import { useMemo, useRef, useState } from "react";
import { XtdMobileTuViOverview, type MobileSelection } from "./XtdMobileTuViOverview";
import { XtdMobilePalaceNavigator } from "./XtdMobilePalaceNavigator";
import { XtdMobilePalaceDetail } from "./XtdMobilePalaceDetail";
import { XtdMobileCenterDetail } from "./XtdMobileCenterDetail";
import { buildPalaceHoroscopeView } from "../../TuViChartGrid";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../mobile/MobileTuViExperience.tsx
 * — only diff is importing the Xtd* overview/nav/detail components.
 * buildPalaceHoroscopeView is reused from the original TuViChartGrid.tsx —
 * pure data mapper, no rendered text.
 */
export function XtdMobileTuViExperience({
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
      <XtdMobileTuViOverview chart={chart} birthTime={birthTime} horoscope={horoscope} selection={selection} onSelect={handleSelect} />

      <XtdMobilePalaceNavigator chart={chart} selection={selection} onSelect={handleSelect} />

      <div ref={detailRef}>
        {selection.kind === "center" ? (
          <XtdMobileCenterDetail chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} />
        ) : selectedPalace ? (
          <XtdMobilePalaceDetail palace={selectedPalace} horoscope={buildPalaceHoroscopeView(horoscope, selectedPalace.index)} />
        ) : null}
      </div>
    </div>
  );
}

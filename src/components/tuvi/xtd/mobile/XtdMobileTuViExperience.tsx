"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getXtdPalaceName } from "@/data/tuvi/xuyen-tam-diem";
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
  sheet = false,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope: VietnameseHoroscopeDTO | null;
  /** A tapped khám opens in a large sheet from the bottom, and the Mệnh khám first breathes to show it can be touched (owner, 2026-10-22). */
  sheet?: boolean;
}) {
  const defaultPalaceIndex = useMemo(() => {
    const soul = chart.palaces.find((p) => p.isSoulPalace);
    return soul?.index ?? chart.palaces[0]?.index ?? 0;
  }, [chart.palaces]);

  const [selection, setSelection] = useState<MobileSelection>({ kind: "palace", index: defaultPalaceIndex });

  const hasAutoScrolledRef = useRef(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [coached, setCoached] = useState(false); // the Mệnh khám breathes until the first tap
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!sheetOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);
  // palaces in the order of the twelve branches, for the sheet's previous / next
  const order = useMemo(() => [...chart.palaces].sort((a, b) => a.index - b.index).map((p) => p.index), [chart.palaces]);
  const step = (d: number) => {
    if (selection.kind !== "palace") return;
    const i = order.indexOf(selection.index);
    setSelection({ kind: "palace", index: order[(i + d + order.length) % order.length] });
  };

  function handleSelect(next: MobileSelection) {
    setSelection(next);
    if (sheet) {
      setCoached(true);
      setSheetOpen(true);
      return;
    }
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
    <div className={`mobile-tuvi-experience ${sheet && !coached ? "is-coach" : ""}`}>
      <div className="mobileCoach-wrap">
        <XtdMobileTuViOverview chart={chart} birthTime={birthTime} horoscope={horoscope} selection={selection} onSelect={handleSelect} />
      </div>

      <XtdMobilePalaceNavigator chart={chart} selection={selection} onSelect={handleSelect} />

      {sheet && sheetOpen && (
        <div className="mobileSheet" role="dialog" aria-modal="true" aria-label="Chi tiết khám">
          <button type="button" className="mobileSheet-backdrop" aria-label="Đóng" onClick={() => setSheetOpen(false)} />
          <div className="mobileSheet-panel">
            <div className="mobileSheet-bar">
              {selection.kind === "palace" ? (
                <>
                  <button type="button" className="mobileSheet-step" onClick={() => step(-1)} aria-label="Khám trước">‹</button>
                  <p className="mobileSheet-title">{selectedPalace ? `${getXtdPalaceName(selectedPalace.name)} · ${selectedPalace.branch}` : ""}</p>
                  <button type="button" className="mobileSheet-step" onClick={() => step(1)} aria-label="Khám sau">›</button>
                </>
              ) : (
                <p className="mobileSheet-title">Trung Cung</p>
              )}
              <button ref={closeRef} type="button" className="mobileSheet-close" onClick={() => setSheetOpen(false)}>Đóng</button>
            </div>
            <div className="mobileSheet-body">
              {selection.kind === "center" ? (
                <XtdMobileCenterDetail chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} />
              ) : selectedPalace ? (
                <XtdMobilePalaceDetail palace={selectedPalace} horoscope={buildPalaceHoroscopeView(horoscope, selectedPalace.index)} />
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div ref={detailRef} hidden={sheet || undefined}>
        {selection.kind === "center" ? (
          <XtdMobileCenterDetail chart={chart} birthTime={birthTime} horoscope={horoscope ?? undefined} />
        ) : selectedPalace ? (
          <XtdMobilePalaceDetail palace={selectedPalace} horoscope={buildPalaceHoroscopeView(horoscope, selectedPalace.index)} />
        ) : null}
      </div>
    </div>
  );
}

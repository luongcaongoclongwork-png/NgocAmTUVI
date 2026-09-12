import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "../types/VietnameseChart";

/**
 * READ-ONLY view model for the Trung Cung "owner profile" panel.
 *
 * This file does not calculate any astrology — it only renames, formats, and
 * groups fields that engine/vietnameseAdapter.ts (and, for the "Năm xem" row,
 * engine/horoscopeAdapter.ts) already computed. Every value here traces back
 * to an existing DTO field; nothing is derived, guessed, or hardcoded. Fields
 * the engine does not currently expose (Am Duong, Ban Menh nap am, Menh/Cuc
 * relation, Can Luong) are intentionally left out — see
 * docs/tuvi-engine-audit.md and the 2026-09-13 "Trung Cung" redesign notes.
 */
export interface OwnerChartViewModel {
  name?: string;

  solarYear?: number;
  solarMonth?: number;
  solarDay?: number;
  lunarMonth?: number;
  lunarDay?: number;
  lunarIsLeap?: boolean;

  /** Raw HH:mm as entered on the form — not part of the DTO, passed through separately by the caller. */
  birthTime?: string;

  yearGanzhi: string;
  monthGanzhi: string;
  dayGanzhi: string;
  hourGanzhi: string;

  bureau: string;
  destinyMaster: string;
  bodyMaster: string;

  originPalace?: string;
  destinyPalace: string;
  bodyPalace: string;
  bodyResidence?: string;

  /** Only set when a Luu Nien overlay (a selected "nam xem") is active. */
  viewingYear?: number;
  viewingYearGanzhi?: string;
  viewingAge?: number;
}

function parseSolarDate(solarDate: string): { year?: number; month?: number; day?: number } {
  const match = /^(\d+)-(\d+)-(\d+)$/.exec(solarDate);
  if (!match) return {};
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

function parseLunarDate(lunarDate: string): { day?: number; month?: number; isLeap: boolean } {
  const match = /^(\d+)\/(\d+)(?:\s*\(nhu[aậ]n\))?\/(\d+)/.exec(lunarDate);
  if (!match) return { isLeap: false };
  return { day: Number(match[1]), month: Number(match[2]), isLeap: lunarDate.includes("nhuận") };
}

export function getOwnerChartViewModel(
  chart: VietnameseChartDTO,
  birthTime?: string,
  horoscope?: VietnameseHoroscopeDTO,
): OwnerChartViewModel {
  const solar = parseSolarDate(chart.solarDate);
  const lunar = parseLunarDate(chart.lunarDate);
  const bodyPalace = chart.palaces.find((p) => p.isBodyPalace);

  return {
    name: chart.name,

    solarYear: solar.year,
    solarMonth: solar.month,
    solarDay: solar.day,
    lunarMonth: lunar.month,
    lunarDay: lunar.day,
    lunarIsLeap: lunar.isLeap,

    birthTime,

    yearGanzhi: `${chart.yearStem} ${chart.yearBranch}`,
    monthGanzhi: `${chart.monthStem} ${chart.monthBranch}`,
    dayGanzhi: `${chart.dayStem} ${chart.dayBranch}`,
    hourGanzhi: `${chart.hourStem} ${chart.hourBranch}`,

    bureau: chart.fiveElementsClass,
    destinyMaster: chart.menhChu,
    bodyMaster: chart.thanChu,

    originPalace: chart.laiNhanCung,
    destinyPalace: chart.soulPalaceBranch,
    bodyPalace: chart.bodyPalaceBranch,
    bodyResidence: bodyPalace?.name,

    viewingYear: horoscope?.targetYear,
    viewingYearGanzhi: horoscope ? `${horoscope.yearly.heavenlyStem} ${horoscope.yearly.branch}` : undefined,
    viewingAge: horoscope?.age,
  };
}

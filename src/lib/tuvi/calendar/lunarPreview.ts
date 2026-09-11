/**
 * Thin Vietnamese-facing wrapper around `lunar-lite` (iztro's own calendar
 * dependency, already installed) — used ONLY to render the "ngay tuong ung"
 * preview line and to bound/validate date pickers in BirthForm.
 *
 * Deliberately NOT part of src/lib/tuvi/{engine,rules} — this never touches
 * chart generation. The actual chart still goes through the unchanged
 * engine/iztroAdapter.ts (astro.bySolar / astro.byLunar). No solar<->lunar
 * conversion algorithm is written here; every function below is a direct
 * call into lunar-lite or lunar-typescript (lunar-lite's own conversion
 * dependency — see below).
 *
 * NOTE: lunar-lite@0.2.8's own `lib/days.js` and `lib/leap.js` reference a
 * `constants.LUNAR_INFO` / `constants.SOLAR_MONTH` table that does not exist
 * in the published `lib/constants.js` (verified 2026-09 — calling
 * getTotalDaysOfLunarMonth/getTotalDaysOfSolarMonth/getLeapMonth throws
 * "Cannot read properties of undefined" at runtime; this broke the
 * production build). lunar-lite's OWN working solar2lunar/lunar2solar
 * (lib/convertor.js) do not use that broken table — they delegate entirely
 * to `lunar-typescript`'s Lunar/Solar/LunarYear/LunarMonth classes. Day-count
 * and leap-month lookups below call the same lunar-typescript classes
 * directly instead of the broken lunar-lite wrappers around them.
 */
import { solar2lunar, lunar2solar, getHeavenlyStemAndEarthlyBranchBySolarDate } from "lunar-lite";
import { LunarYear, LunarMonth } from "lunar-typescript";
import { HEAVENLY_STEM_VI, EARTHLY_BRANCH_VI } from "../locale/astronomyNames.vi";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

function inRange(year: number) {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
}

/** Plain Gregorian calendar arithmetic (not a lunar/solar conversion) — always safe. */
export function daysInSolarMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function daysInLunarMonth(year: number, month: number, isLeapMonth: boolean): number {
  if (!inRange(year)) return 30;
  const lunarMonth = LunarMonth.fromYm(year, isLeapMonth ? -month : month);
  return lunarMonth ? lunarMonth.getDayCount() : 29;
}

/** 0 if the lunar year has no leap month; otherwise the leap month number (1-12). */
export function leapMonthOfLunarYear(year: number): number {
  if (!inRange(year)) return 0;
  return LunarYear.fromYear(year).getLeapMonth();
}

function yearCanChi(solarDateStr: string): string | undefined {
  try {
    const { yearly } = getHeavenlyStemAndEarthlyBranchBySolarDate(solarDateStr, 6, { year: "normal" });
    const stem = HEAVENLY_STEM_VI[yearly[0]];
    const branch = EARTHLY_BRANCH_VI[yearly[1]];
    if (!stem || !branch) return undefined;
    return `${stem} ${branch}`;
  } catch {
    return undefined;
  }
}

/** "25 tháng 11 năm Kỷ Mão" for a solar date, or undefined if out of lunar-lite's supported range. */
export function previewLunarFromSolar(day: number, month: number, year: number): string | undefined {
  if (!inRange(year)) return undefined;
  try {
    const dateStr = `${year}-${month}-${day}`;
    const lunar = solar2lunar(dateStr);
    const canChi = yearCanChi(dateStr);
    const leapTag = lunar.isLeap ? " (nhuận)" : "";
    return `${lunar.lunarDay} tháng ${lunar.lunarMonth}${leapTag} năm ${canChi ?? lunar.lunarYear}`;
  } catch {
    return undefined;
  }
}

/** "01 tháng 01 năm 2000" for a lunar date, or undefined if out of range / invalid (e.g. leap requested on a non-leap month). */
export function previewSolarFromLunar(day: number, month: number, year: number, isLeapMonth: boolean): string | undefined {
  if (!inRange(year)) return undefined;
  try {
    const solar = lunar2solar(`${year}-${month}-${day}`, isLeapMonth);
    return `${String(solar.solarDay).padStart(2, "0")} tháng ${String(solar.solarMonth).padStart(2, "0")} năm ${solar.solarYear}`;
  } catch {
    return undefined;
  }
}

/**
 * Used only when the user flips the calendar-type switch, to carry the same
 * real date across (rule 20: convert if a conversion utility exists, which
 * it does here). Returns null if lunar-lite can't convert (out of its
 * 1900-2100 range) — callers should keep the existing day/month/year as-is
 * in that case rather than guessing.
 */
export function convertOnCalendarSwitch(
  to: "solar" | "lunar",
  day: number,
  month: number,
  year: number,
  isLeapMonth: boolean,
): { day: number; month: number; year: number; isLeapMonth: boolean } | null {
  if (!inRange(year)) return null;
  try {
    if (to === "lunar") {
      const lunar = solar2lunar(`${year}-${month}-${day}`);
      return { day: lunar.lunarDay, month: lunar.lunarMonth, year: lunar.lunarYear, isLeapMonth: lunar.isLeap };
    }
    const solar = lunar2solar(`${year}-${month}-${day}`, isLeapMonth);
    return { day: solar.solarDay, month: solar.solarMonth, year: solar.solarYear, isLeapMonth: false };
  } catch {
    return null;
  }
}

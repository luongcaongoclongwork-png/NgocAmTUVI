/**
 * A rare, historically-documented divergence between the official
 * Vietnamese lunar calendar and the Chinese lunar calendar that `iztro`
 * (via its `lunar-lite` -> `lunar-typescript` dependency chain) computes
 * internally. Both calendars derive month boundaries from the same real
 * astronomical events (new moons, solar terms), but the exact clock time
 * of those events is compared against a different civil-time reference:
 * Vietnam uses GMT+7 (kinh tuyen 105 dong), China uses GMT+8 (Beijing,
 * kinh tuyen 120 dong). When an event falls in the 23:00-23:59 GMT+7
 * window, it lands on the NEXT calendar day in GMT+8 — this can cascade
 * into an entire lunar month (or, rarely, a whole leap-month placement)
 * being numbered differently between the two calendars. `lunar-typescript`
 * has no timezone parameter and always computes the Chinese (GMT+8)
 * answer, which `iztro` has no way to correct.
 *
 * Verified case: nam At Suu 1985. Vietnam's Tet fell 21/1/1985; China's
 * fell a full month later, 20/2/1985 (vi.wikipedia.org/wiki/Am_duong_lich,
 * section "Nhung lan Viet Nam va Trung Quoc an Tet lech ngay", example
 * 2.1 — cites exact Soc/Trung-khi timestamps in both timezones). The
 * root cause traces back further than Tet itself: China inserts a leap
 * month (nhuan thang 10) starting 23/11/1984 that Vietnam does not, so
 * the two calendars are already a full month apart for the 2 months
 * BEFORE Tet too (confirmed against lunar-lite's own live output, which
 * says "leap month 10" / "month 11" for exactly this span, and against
 * xemlicham.com's day-by-day table for Nov/Dec 1984). The 1-month gap is
 * finally closed by a leap month Vietnam has that China does not
 * (Vietnam's nhuan thang 2, 21/3-19/4/1985); both calendars agree again
 * from Vietnam's thang 3 (20/4/1985) onward. Full affected span:
 * 23/11/1984 - 19/4/1985.
 *
 * Every boundary date below was independently cross-checked against
 * xemlicham.com's day-by-day lunar calendar table for Nov/Dec 1984 and
 * Jan-Apr 1985 (not just the Wikipedia summary) before being trusted, and
 * the resulting chart (via the patch in engine/iztroAdapter.ts) was
 * verified to reproduce tuvi.vn's actual published chart for a real birth
 * case inside this window (15/3/1985) exactly: Menh at Ngo with Thai
 * Duong, Moc Tam Cuc, Chu Menh Cu Mon — 2026-09-14.
 *
 * Verified case: nam Dinh Hoi 2007. Vietnam's Tet fell 17/2/2007; China's
 * fell 18/2/2007 (same Wikipedia article, example 1). Both calendars
 * already agree again from Vietnam's thang 2 (19/3/2007) onward — cross
 * checked against xemlicham.com and against lunar-lite's own unpatched
 * output for that boundary. Affected span: 17/2/2007 - 18/3/2007.
 *
 * A short, explicit table of known-bad dates, NOT a general timezone
 * patch to lunar-typescript's astronomical algorithm — a general patch
 * was attempted and abandoned (2026-09-14): lunar-typescript's leap-month
 * SELECTION logic (LunarYear.compute() in the lunar-typescript source)
 * decides which month is the leap month via direct comparisons between
 * two Julian-day values it derives the same way (e.g. `hs[13] <= jq[24]`)
 * — shifting every underlying Soc/Trung-khi moment by a constant (the
 * GMT+7 vs GMT+8 hour) leaves such comparisons unchanged by construction,
 * so a uniform shift cannot reproduce Vietnam's actual leap-month choice;
 * verified empirically to produce an internally inconsistent chart (a
 * leap month kept at China's position while Tet's own date moved). Fully
 * reproducing Vietnam's calendar in general would mean reimplementing
 * that ~150-line selection algorithm with correctly localized comparisons
 * throughout and verifying it against many independent reference points —
 * a project of its own, not a safe drive-by patch. This table instead
 * covers every case a reliable source (vi.wikipedia.org/wiki/Am_duong_lich)
 * actually documents between 1960 and 2060 — the article itself states
 * the only other known instances fall in the 2100s+, outside any living
 * person's birth date. A birth date the site's engine gets wrong that
 * ISN'T one of these documented cases would need the same kind of
 * dedicated, source-verified investigation before being added here.
 */

import type { EarthlyBranchVi, HeavenlyStemVi } from "../types/VietnameseChart";

export interface VietnameseLunarDate {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeap: boolean;
}

interface OverrideRange {
  /** Inclusive solar start date. */
  start: { year: number; month: number; day: number };
  /** Inclusive solar end date. */
  end: { year: number; month: number; day: number };
  lunarYear: number;
  lunarMonth: number;
  isLeap: boolean;
  /** Vietnamese lunar day on `start`. */
  startLunarDay: number;
}

const OVERRIDE_RANGES: OverrideRange[] = [
  // Vietnam thang 11 (Giap Ty 1984) -- China calls this "nhuan thang 10" of the same lunar year.
  { start: { year: 1984, month: 11, day: 23 }, end: { year: 1984, month: 12, day: 21 }, lunarYear: 1984, lunarMonth: 11, isLeap: false, startLunarDay: 1 },
  // Vietnam thang 12 (Giap Ty 1984) -- China calls the same span thang 11 (no leap in its own numbering here).
  { start: { year: 1984, month: 12, day: 22 }, end: { year: 1985, month: 1, day: 20 }, lunarYear: 1984, lunarMonth: 12, isLeap: false, startLunarDay: 1 },
  // Vietnam thang Gieng 1985 (Tet) -- China still counts this as thang 12 of Giap Ty 1984.
  { start: { year: 1985, month: 1, day: 21 }, end: { year: 1985, month: 2, day: 19 }, lunarYear: 1985, lunarMonth: 1, isLeap: false, startLunarDay: 1 },
  // Vietnam thang 2 (thuong) 1985 -- China calls the same span thang Gieng of At Suu.
  { start: { year: 1985, month: 2, day: 20 }, end: { year: 1985, month: 3, day: 20 }, lunarYear: 1985, lunarMonth: 2, isLeap: false, startLunarDay: 1 },
  // Vietnam nhuan thang 2 1985 -- China has no leap month here at all (its 1984 was the leap year, thang 10 nhuan).
  { start: { year: 1985, month: 3, day: 21 }, end: { year: 1985, month: 4, day: 19 }, lunarYear: 1985, lunarMonth: 2, isLeap: true, startLunarDay: 1 },
  // Vietnam thang Gieng 2007 (Tet Dinh Hoi, one day earlier than China's) through to where both agree again.
  { start: { year: 2007, month: 2, day: 17 }, end: { year: 2007, month: 3, day: 18 }, lunarYear: 2007, lunarMonth: 1, isLeap: false, startLunarDay: 1 },
];

function toEpochDay(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

/**
 * Returns the correct Vietnamese lunar date for a solar (year, month, day)
 * if it falls inside a known Vietnam/China divergence window, else
 * `undefined` — meaning: trust iztro's own (Chinese) conversion as usual.
 */
export function getVietnameseLunarOverride(year: number, month: number, day: number): VietnameseLunarDate | undefined {
  const target = toEpochDay(year, month, day);
  for (const range of OVERRIDE_RANGES) {
    const startEpoch = toEpochDay(range.start.year, range.start.month, range.start.day);
    const endEpoch = toEpochDay(range.end.year, range.end.month, range.end.day);
    if (target >= startEpoch && target <= endEpoch) {
      return {
        lunarYear: range.lunarYear,
        lunarMonth: range.lunarMonth,
        lunarDay: range.startLunarDay + (target - startEpoch),
        isLeap: range.isLeap,
      };
    }
  }
  return undefined;
}

const STEM_ORDER: HeavenlyStemVi[] = [
  "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý",
];
const BRANCH_FROM_DAN: EarthlyBranchVi[] = [
  "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu",
];
/** hanzi, same index order as STEM_ORDER (stems) and the Ty-anchored branch cycle. */
const STEM_HANZI = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCH_HANZI_FROM_TY = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

/**
 * The lunar YEAR's own can-chi, by the standard 60-year cycle (year 4 AD =
 * Giap Ty, undisputed and identical in both the Vietnamese and Chinese
 * calendars — only the MONTH/day numbering inside a lunar year is what
 * diverges in the override windows above, never the year-cycle assignment
 * itself). Needed because `getHeavenlyStemAndEarthlyBranchBySolarDate`
 * computes the year's ganzhi via a call path independent of
 * `solar2lunar` — for solar dates 21/1-19/2/1985 specifically, Vietnam has
 * already crossed into nam At Suu (Tet 21/1) while China (whose own Tet
 * isn't until 20/2) still reports Giap Ty, so this needs the same kind of
 * correction as the month. Returns hanzi (see STEM_HANZI/BRANCH_HANZI_FROM_TY).
 */
export function getVietnameseYearGanZhiHanzi(lunarYear: number): [string, string] {
  const stemIndex = ((lunarYear - 4) % 10 + 10) % 10;
  const branchIndex = ((lunarYear - 4) % 12 + 12) % 12;
  return [STEM_HANZI[stemIndex], BRANCH_HANZI_FROM_TY[branchIndex]];
}
/** "Nguu ho don nguyet" — thang Gieng's stem by year stem, the classical starting point for every month's ganzhi. */
const FIRST_MONTH_STEM_BY_YEAR_STEM: Record<HeavenlyStemVi, HeavenlyStemVi> = {
  "Giáp": "Bính", "Kỷ": "Bính",
  "Ất": "Mậu", "Canh": "Mậu",
  "Bính": "Canh", "Tân": "Canh",
  "Đinh": "Nhâm", "Nhâm": "Nhâm",
  "Mậu": "Giáp", "Quý": "Giáp",
};

/**
 * The month's own can-chi (thang can chi, shown in the center panel next
 * to "THANG") for a lunar month inside an override window — iztro derives
 * this via a completely separate lunar-typescript call path (month ganzhi
 * by solar term / by Sóc, not through `solar2lunar`), so patching
 * `solar2lunar` alone leaves this field showing China's label. Computed
 * here directly via the standard "nguu ho don nguyet" rule instead, keyed
 * off the corrected lunar month and the (unaffected — years never drift
 * between VN/China the way months do here) lunar year's own stem.
 * Verified: nam At Suu (year stem At) -> thang Gieng = Mau Dan, thang 2 =
 * Ky Mao — matches tuvi.vn's "Thang: 3 (2) Ky Mao" exactly.
 */
export function getVietnameseMonthGanZhi(yearStem: HeavenlyStemVi, lunarMonth: number): { stem: HeavenlyStemVi; branch: EarthlyBranchVi } {
  const firstMonthStem = FIRST_MONTH_STEM_BY_YEAR_STEM[yearStem];
  const stemIndex = (STEM_ORDER.indexOf(firstMonthStem) + (lunarMonth - 1)) % 10;
  const branchIndex = (lunarMonth - 1) % 12;
  return { stem: STEM_ORDER[stemIndex], branch: BRANCH_FROM_DAN[branchIndex] };
}

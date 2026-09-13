import { astro } from "iztro";
import type { IFunctionalAstrolabe } from "iztro/lib/astro/FunctionalAstrolabe";
import type { BirthInput } from "../types/VietnameseChart";
import { getVietnameseLunarOverride, getVietnameseYearGanZhiHanzi } from "../rules/vietnamChinaCalendarOverride";

/**
 * The ONLY file in this module allowed to import from the `iztro` package.
 * Everything downstream (rules/*, engine/vietnameseAdapter.ts, components/tuvi/*)
 * works off `IFunctionalAstrolabe` or, further downstream, `VietnameseChartDTO` —
 * never a raw iztro call. See docs/tuvi-engine-audit.md section C.
 *
 * We always request zh-CN output from iztro (never its own vi-VN locale,
 * which has verified bugs — e.g. "Ta Phu"("Tả Phù") instead of "Tả Phụ",
 * "Bac Sy" instead of "Bác Sĩ", and the brightness key "xian" mistranslated
 * as "Han" instead of "Hãm"). locale/starNames.vi.ts etc. reverse-map the
 * zh-CN hanzi back to our own, independently-sourced Vietnamese labels.
 */

/**
 * `iztro` re-derives the lunar month straight from the solar date on every
 * internal use (Menh/Than palace, Cuc, Ta Phu/Huu Bat, ...) via
 * `lunar-lite`'s `solar2lunar` — there is no way to inject a corrected
 * lunar date through iztro's own public API (`astro.byLunar()` itself just
 * calls `lunar2solar` then re-enters `bySolar`, so it re-derives the same
 * way). The only way to correct the small, known set of Vietnam/China
 * calendar-divergence dates (rules/vietnamChinaCalendarOverride.ts) is to
 * intercept `solar2lunar` itself.
 *
 * `require("lunar-lite").solar2lunar` is a getter-only re-export (from a
 * TS-compiled barrel file) that live-proxies to `lunar-lite/lib/convertor`'s
 * own `solar2lunar` — assigning through the barrel silently no-ops.
 * Patching the convertor module directly works: Node's module cache
 * guarantees iztro's own `require("lunar-lite")` resolves to the exact
 * same singleton, so this patched function runs for every internal iztro
 * call too. Verified empirically 2026-09-14: patched output for 15/3/1985
 * (Nam) reproduced tuvi.vn's real published chart exactly (Menh at Ngo /
 * Thai Duong, Moc Tam Cuc, Chu Menh Cu Mon), where the unpatched chart
 * (Menh at Ty / Vo Chinh Dieu, Kim Tu Cuc) did not.
 *
 * Falls through to the original implementation for every date outside the
 * override table, so this can never change the result for a date this
 * project hasn't explicitly verified. Applied once per process.
 */
let vietnamCalendarPatchApplied = false;
function ensureVietnamCalendarPatchApplied(): void {
  if (vietnamCalendarPatchApplied) return;
  vietnamCalendarPatchApplied = true;
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- must be require(), not import: see doc comment above (the barrel's `import` binding is a read-only getter, the submodule's own exports object is the writable one).
  const convertor = require("lunar-lite/lib/convertor");
  const originalSolar2lunar = convertor.solar2lunar;
  convertor.solar2lunar = function patchedSolar2lunar(dateStr: string) {
    const match = /^(\d+)-(\d+)-(\d+)/.exec(dateStr);
    if (match) {
      const override = getVietnameseLunarOverride(Number(match[1]), Number(match[2]), Number(match[3]));
      if (override) {
        return {
          lunarYear: override.lunarYear,
          lunarMonth: override.lunarMonth,
          lunarDay: override.lunarDay,
          isLeap: override.isLeap,
          toString: (toCnStr?: boolean) =>
            toCnStr
              ? `${override.lunarYear}年${override.lunarMonth}月${override.isLeap ? "闰" : ""}${override.lunarDay}日`
              : `${override.lunarYear}-${override.lunarMonth}-${override.lunarDay}`,
        };
      }
    }
    return originalSolar2lunar(dateStr);
  };

  // The lunar YEAR's own can-chi is computed by a second, fully independent
  // lunar-typescript call path (Solar.fromYmdHms(...).getLunar().getYearGan(),
  // not lunar-lite's solar2lunar) — patching solar2lunar above does not
  // reach it. It only actually needs correcting for solar dates 21/1-19/2/
  // 1985: Vietnam's Tet already fell 21/1, but China's own Tet isn't until
  // 20/2, so this function still reports Giap Ty there instead of At Suu —
  // verified empirically (node repl, 2026-09-14) before adding this. Every
  // other override range already agrees with China on the YEAR (only the
  // month numbering inside it differs), so this patch is a no-op for
  // those, applied uniformly rather than special-cased for simplicity.
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- same reasoning as convertor above: must patch the submodule's own writable exports object, not the read-only barrel re-export.
  const ganzhi = require("lunar-lite/lib/ganzhi");
  const originalGetHeavenlyStemAndEarthlyBranchBySolarDate = ganzhi.getHeavenlyStemAndEarthlyBranchBySolarDate;
  ganzhi.getHeavenlyStemAndEarthlyBranchBySolarDate = function patchedGetHeavenlyStemAndEarthlyBranchBySolarDate(
    dateStr: string,
    timeIndex: number,
    options?: unknown,
  ) {
    const result = originalGetHeavenlyStemAndEarthlyBranchBySolarDate(dateStr, timeIndex, options);
    const match = /^(\d+)-(\d+)-(\d+)/.exec(dateStr);
    if (match) {
      const override = getVietnameseLunarOverride(Number(match[1]), Number(match[2]), Number(match[3]));
      if (override) {
        return { ...result, yearly: getVietnameseYearGanZhiHanzi(override.lunarYear) };
      }
    }
    return result;
  };
}

/** iztro's timeIndex: 0 = early Ty (00:00-01:00) .. 12 = late Ty (23:00-24:00). */
export function timeIndexFromHHmm(time: string): number {
  const [hourStr] = time.split(":");
  const hour = Number(hourStr);
  if (hour === 0) return 0;
  if (hour >= 23) return 12;
  return Math.floor((hour - 1) / 2) + 1;
}

export interface LoadOptions {
  /**
   * Use iztro's "zhongzhou" school setting instead of its "default" one.
   * Only affects: (1) which branch Menh Chu is keyed by, (2) one label swap
   * in the Tue Tien 12-star cycle, (3) a Thien Thuong/Thien Su position swap
   * under specific gender/year-parity combos — verified NOT to touch the 14
   * major star positions, brightness, or Khoi/Viet. See rules/palaces.ts for
   * why the Vietnamese profiles need this for Menh Chu.
   */
  useZhongzhouSchool?: boolean;
}

export function loadRawIztroChart(input: BirthInput, options: LoadOptions = {}): IFunctionalAstrolabe {
  ensureVietnamCalendarPatchApplied();
  const timeIndex = timeIndexFromHHmm(input.time);
  // iztro's GenderName type accepts any locale's gender string (resolved via its
  // internal kot() reverse-lookup) — vi-VN's own "Nam"/"Nữ" work directly, so
  // BirthInput.gender is passed straight through without a Chinese round-trip.
  const dateStr = `${input.year}-${input.month}-${input.day}`;

  astro.config({ algorithm: options.useZhongzhouSchool ? "zhongzhou" : "default" });

  if (input.calendarType === "solar") {
    return astro.bySolar(dateStr, timeIndex, input.gender, true, "zh-CN");
  }
  return astro.byLunar(dateStr, timeIndex, input.gender, Boolean(input.isLeapMonth), true, "zh-CN");
}

export type { IFunctionalAstrolabe };

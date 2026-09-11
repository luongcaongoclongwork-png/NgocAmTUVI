import { astro } from "iztro";
import type { IFunctionalAstrolabe } from "iztro/lib/astro/FunctionalAstrolabe";
import type { BirthInput } from "../types/VietnameseChart";

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

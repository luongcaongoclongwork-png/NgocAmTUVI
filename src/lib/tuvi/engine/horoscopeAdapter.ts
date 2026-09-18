import { loadRawIztroChart, type LoadOptions } from "./iztroAdapter";
import {
  HEAVENLY_STEM_VI,
  EARTHLY_BRANCH_VI,
  PALACE_NAMES_VI,
  SUI_QIAN_VI,
  YEARLY_FLOW_STAR_VI,
} from "../locale/vi-VN";
import { FOUR_TRANSFORMATIONS_VI } from "../rules/fourTransformations";
import type { ChartProfile } from "./vietnameseAdapter";
import type {
  BirthInput,
  EarthlyBranchVi,
  FourTransformation,
  HeavenlyStemVi,
  HoroscopeStar,
  PalaceNameVi,
  VietnameseHoroscopeDTO,
} from "../types/VietnameseChart";

/**
 * Fixed time-of-day used only to satisfy iztro's `horoscope(date, timeIndex)`
 * signature — decadal/yearly/age results don't depend on it (only the
 * `hourly` scope, which this module never reads), so any constant value
 * keeps the call deterministic regardless of when it's actually run.
 */
const HOROSCOPE_TIME_INDEX = 6;

function stemViOf(zh: string): HeavenlyStemVi {
  return HEAVENLY_STEM_VI[zh] ?? (zh as HeavenlyStemVi);
}

function branchViOf(zh: string): EarthlyBranchVi {
  return EARTHLY_BRANCH_VI[zh] ?? (zh as EarthlyBranchVi);
}

function palaceNameByIndex(zhNames: string[]): PalaceNameVi[] {
  return zhNames.map((zh) => PALACE_NAMES_VI[zh] ?? (zh as PalaceNameVi));
}

function translateFlowStar(zh: string): HoroscopeStar {
  const name = YEARLY_FLOW_STAR_VI[zh];
  if (name) return { id: zh, name };
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[tuvi] Untranslated yearly flow star from iztro: "${zh}" — add it to locale/astronomyNames.vi.ts YEARLY_FLOW_STAR_VI`);
  }
  return { id: zh, name: zh };
}

function translateCycleName(table: Record<string, string>, zh: string, label: string): string {
  const vi = table[zh];
  if (vi) return vi;
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[tuvi] Untranslated ${label} from iztro: "${zh}"`);
  }
  return zh;
}

/**
 * Public entry point for the Luu Nien (annual transit) overlay — the "sao
 * lưu theo từng năm" layer, distinct from and layered on top of the natal
 * chart from vietnameseAdapter.ts. Re-derives its own astrolabe from
 * `input` (same `loadRawIztroChart` the natal chart uses) rather than
 * accepting one — cheap and pure, and keeps this module self-contained
 * without threading a raw iztro object through React state.
 *
 * `profile` MUST match whatever profile built the natal chart being
 * overlaid: `useZhongzhouMenhChu` flips iztro's global algorithm setting,
 * which affects both which decade/year a given palace index lands on AND
 * the suiqian12 12-star cycle's dahao/suipo swap (see SUI_QIAN_VI) — a
 * mismatched profile would silently desync the overlay from the chart.
 *
 * Deliberately reuses this project's OWN Tứ Hóa table
 * (rules/fourTransformations.ts) for the year's mutagen, not iztro's own
 * `horoscope().yearly.mutagen` — consistent with how the natal chart never
 * trusts iztro's stem-to-star Tứ Hóa mapping either (see
 * vietnameseAdapter.ts).
 */
export function generateVietnameseHoroscope(
  input: BirthInput,
  profile: ChartProfile,
  targetYear: number,
): VietnameseHoroscopeDTO {
  const loadOptions: LoadOptions = { useZhongzhouSchool: profile.useZhongzhouMenhChu };
  const astrolabe = loadRawIztroChart(input, loadOptions);

  // Mid-year date: keeps us safely clear of the lunar-new-year boundary near
  // Jan/Feb, so `targetYear` always lands in the intended lunar year too.
  const horoscope = astrolabe.horoscope(`${targetYear}-6-15`, HOROSCOPE_TIME_INDEX);

  const decadalPalace = astrolabe.palaces[horoscope.decadal.index];

  const yearlyStem = stemViOf(horoscope.yearly.heavenlyStem);

  const mutagenByStarId: Partial<Record<string, FourTransformation>> = {};
  for (const [transformation, starId] of Object.entries(FOUR_TRANSFORMATIONS_VI[yearlyStem]) as [FourTransformation, string][]) {
    mutagenByStarId[starId] = transformation;
  }

  const starsByIndex: HoroscopeStar[][] = (horoscope.yearly.stars ?? []).map((slot) =>
    slot.map((s) => translateFlowStar(s.name)),
  );

  return {
    targetYear,
    age: horoscope.age.nominalAge,
    decadal: {
      heavenlyStem: stemViOf(horoscope.decadal.heavenlyStem),
      branch: branchViOf(horoscope.decadal.earthlyBranch),
      ageRange: decadalPalace.decadal.range,
      palaceNameByIndex: palaceNameByIndex(horoscope.decadal.palaceNames),
    },
    yearly: {
      year: targetYear,
      heavenlyStem: yearlyStem,
      branch: branchViOf(horoscope.yearly.earthlyBranch),
      palaceNameByIndex: palaceNameByIndex(horoscope.yearly.palaceNames),
      mutagenByStarId,
      starsByIndex,
      suiQianByIndex: horoscope.yearly.yearlyDecStar.suiqian12.map((zh) => translateCycleName(SUI_QIAN_VI, zh, "yearly suiqian12")),
    },
  };
}

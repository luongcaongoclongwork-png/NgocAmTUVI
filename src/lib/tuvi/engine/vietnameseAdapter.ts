import type { IFunctionalAstrolabe } from "./iztroAdapter";
import { loadRawIztroChart } from "./iztroAdapter";
import {
  HEAVENLY_STEM_VI,
  EARTHLY_BRANCH_VI,
  GENDER_VI,
  FIVE_ELEMENTS_CLASS_VI,
  MUTAGEN_VI,
  PALACE_NAMES_VI,
  STAR_NAMES_VI,
  starKeyFromZh,
  SUPERSEDED_BY_OWN_TUAN_TRIET,
  CHANG_SINH_VI,
  BOSHI_VI,
  JIANG_QIAN_VI,
  SUI_QIAN_VI,
} from "../locale/vi-VN";
import { lookupBrightness } from "../rules/brightness";
import { getTuan, getTriet } from "../rules/tuanTriet";
import { FOUR_TRANSFORMATIONS_VI } from "../rules/fourTransformations";
import { getQuocAn, getDuongPhu, getThienGiai, getDiaGiai, getLuuHa } from "../rules/namPhaiStars";
import { getVietnameseLunarOverride, getVietnameseMonthGanZhi } from "../rules/vietnamChinaCalendarOverride";
import type {
  BirthInput,
  EarthlyBranchVi,
  FourTransformation,
  HeavenlyStemVi,
  PalaceNameVi,
  StarCategory,
  VietnameseBrightness,
  VietnameseChartDTO,
  VietnamesePalace,
  VietnameseStar,
} from "../types/VietnameseChart";

export interface ChartProfile {
  id: VietnameseChartDTO["profile"];
  /** null = keep whatever palace iztro itself placed Thien Khoi/Thien Viet in. */
  khoiViet: Record<HeavenlyStemVi, { khoi: EarthlyBranchVi; viet: EarthlyBranchVi }> | null;
  /** false = fall back to iztro's own 7-level brightness (collapsed to 5 levels), for the iztro-default comparison profile only — see rule X.4. */
  useVietnameseBrightness: boolean;
  /** See rules/palaces.ts for why the Vietnamese profiles need this for Menh Chu. */
  useZhongzhouMenhChu: boolean;
}

/** iztro's own 7-level scale, collapsed only for the "iztro-default" comparison profile. Never used for ngoc-am/vietnam-tan-bien. */
const IZTRO_RAW_BRIGHTNESS_ZH: Record<string, VietnameseBrightness> = {
  "庙": "M", "旺": "V", "得": "Đ", "利": "B", "平": "B", "不": "H", "陷": "H",
};

interface RawStarLike {
  name: string;
  brightness?: string;
  mutagen?: string;
}

/**
 * Star categories that can carry a brightness rating at all — the 14 major
 * stars plus the 6 sat tinh ("malefic") and Van Xuong/Van Khuc (both
 * "support", alongside other support stars like Ta Phu/Loc Ton that never
 * carry one). Widening this beyond "major" is safe: lookupBrightness()
 * still only returns a value for the specific (star, branch) pairs verified
 * in MINOR_STAR_BRIGHTNESS_VI — everything else still comes back
 * sourceNeeded and renders no badge, same as before this category was added.
 */
const BRIGHTNESS_ELIGIBLE_CATEGORIES = new Set<StarCategory>(["major", "malefic", "support"]);

function stemBranchFromZh(stem: string, branch: string): { stem: HeavenlyStemVi; branch: EarthlyBranchVi } {
  return { stem: HEAVENLY_STEM_VI[stem], branch: EARTHLY_BRANCH_VI[branch] };
}

export function generateVietnameseChart(input: BirthInput, profile: ChartProfile): VietnameseChartDTO {
  const astrolabe: IFunctionalAstrolabe = loadRawIztroChart(input, {
    useZhongzhouSchool: profile.useZhongzhouMenhChu,
  });

  const { lunarYear, lunarMonth, lunarDay, isLeap } = astrolabe.rawDates.lunarDate;
  // astrolabe.lunarDate itself is iztro's own Chinese-numeral string (e.g. "二〇〇〇年六月初四")
  // — rule X.9 forbids leaking Chinese into the Vietnamese UI, so it is rebuilt here
  // from the raw numeric fields instead of used directly.
  const lunarDate = `${lunarDay}/${lunarMonth}${isLeap ? " (nhuận)" : ""}/${lunarYear} âm lịch`;

  const { yearly, monthly, daily, hourly } = astrolabe.rawDates.chineseDate;
  const year = stemBranchFromZh(yearly[0], yearly[1]);
  const day = stemBranchFromZh(daily[0], daily[1]);
  const hour = stemBranchFromZh(hourly[0], hourly[1]);

  // The month's own can-chi comes from a separate iztro/lunar-typescript
  // call path than lunarDate above (month ganzhi by solar term, not via
  // solar2lunar) — the Vietnam/China calendar-divergence patch in
  // iztroAdapter.ts doesn't reach it, so it's corrected here directly. See
  // rules/vietnamChinaCalendarOverride.ts for the verified formula.
  const monthOverride = input.calendarType === "solar" ? getVietnameseLunarOverride(input.year, input.month, input.day) : undefined;
  const month = monthOverride ? getVietnameseMonthGanZhi(year.stem, monthOverride.lunarMonth) : stemBranchFromZh(monthly[0], monthly[1]);

  const tuan = getTuan(year.stem, year.branch);
  const triet = getTriet(year.stem);
  const fourHoaTable = FOUR_TRANSFORMATIONS_VI[year.stem];
  const transformationByStarId = new Map<string, FourTransformation>(
    (Object.entries(fourHoaTable) as [FourTransformation, string][]).map(([t, starId]) => [starId, t]),
  );

  const unverifiedBrightnessEntries: { starId: string; branch: EarthlyBranchVi }[] = [];

  function convertStar(raw: RawStarLike, branch: EarthlyBranchVi): VietnameseStar | undefined {
    const key = starKeyFromZh(raw.name);
    if (!key) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[tuvi] Untranslated star from iztro: "${raw.name}" — add it to locale/starNames.vi.ts`);
      }
      return { id: raw.name, name: raw.name, category: "auxiliary", sourceNeeded: true };
    }
    if (SUPERSEDED_BY_OWN_TUAN_TRIET.has(key)) return undefined;

    const entry = STAR_NAMES_VI[key];
    const star: VietnameseStar = { id: key, name: entry.name, category: entry.category, element: entry.element };

    if (BRIGHTNESS_ELIGIBLE_CATEGORIES.has(entry.category)) {
      if (profile.useVietnameseBrightness) {
        const { brightness, sourceNeeded } = lookupBrightness(key, branch);
        star.brightness = brightness;
        star.sourceNeeded = sourceNeeded;
        if (sourceNeeded) unverifiedBrightnessEntries.push({ starId: key, branch });
      } else if (raw.brightness) {
        star.brightness = IZTRO_RAW_BRIGHTNESS_ZH[raw.brightness];
      }
    }

    const transformation = transformationByStarId.get(key);
    if (transformation) star.transformation = transformation;

    return star;
  }

  const palaces: VietnamesePalace[] = astrolabe.palaces.map((raw) => {
    const branch = EARTHLY_BRANCH_VI[raw.earthlyBranch];
    const stem = HEAVENLY_STEM_VI[raw.heavenlyStem];
    const name = PALACE_NAMES_VI[raw.name];

    const majorStars: VietnameseStar[] = [];
    const supportStars: VietnameseStar[] = [];
    const maleficStars: VietnameseStar[] = [];
    const adjectiveStars: VietnameseStar[] = [];

    for (const raw2 of raw.majorStars) {
      const star = convertStar(raw2, branch);
      if (star) majorStars.push(star);
    }
    for (const raw2 of raw.minorStars) {
      const star = convertStar(raw2, branch);
      if (!star) continue;
      if (star.category === "malefic") maleficStars.push(star);
      else supportStars.push(star);
    }
    for (const raw2 of raw.adjectiveStars) {
      const star = convertStar(raw2, branch);
      if (star) adjectiveStars.push(star);
    }

    const fourTransformations: FourTransformation[] = [
      ...majorStars, ...supportStars, ...maleficStars, ...adjectiveStars,
    ].filter((s) => s.transformation).map((s) => s.transformation as FourTransformation);

    return {
      index: raw.index,
      branch,
      heavenlyStem: stem,
      name,
      isBodyPalace: raw.isBodyPalace,
      isSoulPalace: name === "Mệnh",
      majorStars,
      supportStars,
      maleficStars,
      adjectiveStars,
      fourTransformations,
      changSinh: CHANG_SINH_VI[raw.changsheng12] ?? raw.changsheng12,
      boshi: BOSHI_VI[raw.boshi12] ?? raw.boshi12,
      jiangQian: JIANG_QIAN_VI[raw.jiangqian12] ?? raw.jiangqian12,
      suiQian: SUI_QIAN_VI[raw.suiqian12] ?? raw.suiqian12,
      tuan: tuan.branches.includes(branch) ? true : undefined,
      triet: triet.branches.includes(branch) ? true : undefined,
      daiVan: (() => {
        const d = stemBranchFromZh(raw.decadal.heavenlyStem, raw.decadal.earthlyBranch);
        return { heavenlyStem: d.stem, branch: d.branch, startAge: raw.decadal.range[0], endAge: raw.decadal.range[1] };
      })(),
      tieuHan: raw.ages.map((age) => ({ branch, age })),
    } satisfies VietnamesePalace;
  });

  if (profile.khoiViet) {
    const { khoi, viet } = profile.khoiViet[year.stem];
    const khoiEntry = STAR_NAMES_VI.tiankuiMin;
    const vietEntry = STAR_NAMES_VI.tianyueMin;
    for (const palace of palaces) {
      // Strip out wherever iztro itself placed Khoi/Viet — we always re-place them below.
      palace.supportStars = palace.supportStars.filter((s) => s.id !== "tiankuiMin" && s.id !== "tianyueMin");
      if (palace.branch === khoi) {
        palace.supportStars.push({ id: "tiankuiMin", name: khoiEntry.name, category: "support" });
      }
      if (palace.branch === viet) {
        palace.supportStars.push({ id: "tianyueMin", name: vietEntry.name, category: "support" });
      }
    }
  }

  // Nam Phai auxiliary stars iztro never computes on its own — see
  // rules/namPhaiStars.ts for the formulas and their verification. Derived
  // from wherever iztro already placed Loc Ton / Thien Dieu (never
  // recomputed here), then merged into adjectiveStars like any other
  // tap tinh — same shape iztro's own stars already take.
  function findPalaceByStarId(starId: string): VietnamesePalace | undefined {
    return palaces.find(
      (p) =>
        p.majorStars.some((s) => s.id === starId) ||
        p.supportStars.some((s) => s.id === starId) ||
        p.maleficStars.some((s) => s.id === starId) ||
        p.adjectiveStars.some((s) => s.id === starId),
    );
  }

  const locTonPalace = findPalaceByStarId("lucunMin");
  const thienDieuPalace = findPalaceByStarId("tianyao");

  const namPhaiStars: { id: string; name: string; branch: EarthlyBranchVi }[] = [
    { id: "thienGiaiNamPhai", name: "Thiên Giải", branch: getThienGiai(lunarMonth) },
    { id: "diaGiaiNamPhai", name: "Địa Giải", branch: getDiaGiai(lunarMonth) },
    { id: "luuHaNamPhai", name: "Lưu Hà", branch: getLuuHa(year.stem) },
  ];
  if (locTonPalace) {
    namPhaiStars.push(
      { id: "quocAnNamPhai", name: "Quốc Ấn", branch: getQuocAn(locTonPalace.branch) },
      { id: "duongPhuNamPhai", name: "Đường Phù", branch: getDuongPhu(locTonPalace.branch) },
    );
  }

  for (const { id, name, branch } of namPhaiStars) {
    const palace = palaces.find((p) => p.branch === branch);
    if (palace) palace.adjectiveStars.push({ id, name, category: "auxiliary" });
  }

  // Thien Y always shares Thien Dieu's palace (never computed independently).
  if (thienDieuPalace) {
    thienDieuPalace.adjectiveStars.push({ id: "thienYNamPhai", name: "Thiên Y", category: "auxiliary" });
  }

  const laiNhanCungRaw = astrolabe.palaces.find((p) => p.isOriginalPalace);
  const laiNhanCung: PalaceNameVi | undefined = laiNhanCungRaw ? PALACE_NAMES_VI[laiNhanCungRaw.name] : undefined;

  const menhChuKey = starKeyFromZh(astrolabe.soul);
  const thanChuKey = starKeyFromZh(astrolabe.body);

  return {
    profile: profile.id,
    name: input.name,
    gender: GENDER_VI[astrolabe.gender] ?? input.gender,
    solarDate: astrolabe.solarDate,
    lunarDate,
    yearStem: year.stem,
    yearBranch: year.branch,
    monthStem: month.stem,
    monthBranch: month.branch,
    dayStem: day.stem,
    dayBranch: day.branch,
    hourStem: hour.stem,
    hourBranch: hour.branch,
    fiveElementsClass: FIVE_ELEMENTS_CLASS_VI[astrolabe.fiveElementsClass],
    menhChu: menhChuKey ? STAR_NAMES_VI[menhChuKey].name : astrolabe.soul,
    thanChu: thanChuKey ? STAR_NAMES_VI[thanChuKey].name : astrolabe.body,
    laiNhanCung,
    soulPalaceBranch: palaces.find((p) => p.isSoulPalace)!.branch,
    bodyPalaceBranch: palaces.find((p) => p.isBodyPalace)!.branch,
    tuan,
    triet,
    palaces,
    unverifiedBrightnessEntries,
  };
}

export { MUTAGEN_VI };

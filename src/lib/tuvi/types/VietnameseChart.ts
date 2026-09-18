/**
 * DTO layer for the Vietnamese Tu Vi chart module.
 *
 * The UI (components/tuvi/*) is only ever allowed to read `VietnameseChartDTO`.
 * It must never import iztro or any `RawIztroChart` type directly — see
 * docs/tuvi-engine-audit.md section "C" for the pipeline this protects.
 */

export type EarthlyBranchVi =
  | "Tý"
  | "Sửu"
  | "Dần"
  | "Mão"
  | "Thìn"
  | "Tỵ"
  | "Ngọ"
  | "Mùi"
  | "Thân"
  | "Dậu"
  | "Tuất"
  | "Hợi";

export type HeavenlyStemVi =
  | "Giáp"
  | "Ất"
  | "Bính"
  | "Đinh"
  | "Mậu"
  | "Kỷ"
  | "Canh"
  | "Tân"
  | "Nhâm"
  | "Quý";

export type PalaceNameVi =
  | "Mệnh"
  | "Huynh Đệ"
  | "Phu Thê"
  | "Tử Tức"
  | "Tài Bạch"
  | "Tật Ách"
  | "Thiên Di"
  | "Nô Bộc"
  | "Quan Lộc"
  | "Điền Trạch"
  | "Phúc Đức"
  | "Phụ Mẫu";

/** 5-level Vietnamese brightness scale (Tan Bien), distinct from iztro's 7-level scale. */
export type VietnameseBrightness = "M" | "V" | "Đ" | "B" | "H";

export const BRIGHTNESS_LABEL: Record<VietnameseBrightness, string> = {
  M: "Miếu",
  V: "Vượng",
  Đ: "Đắc",
  B: "Bình",
  H: "Hãm",
};

export type FourTransformation = "Lộc" | "Quyền" | "Khoa" | "Kỵ";

export type StarCategory =
  | "major"
  | "support"
  | "malefic"
  | "auxiliary"
  | "transformation"
  | "cycle";

export type FiveElementsClassVi =
  | "Thủy Nhị Cục"
  | "Mộc Tam Cục"
  | "Kim Tứ Cục"
  | "Thổ Ngũ Cục"
  | "Hỏa Lục Cục";

export interface VietnameseStar {
  /** Stable internal id — reuses iztro's own key (e.g. "ziweiMaj") so it never depends on any locale. */
  id: string;
  name: string;
  category: StarCategory;
  element?: "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";
  /** Only set for the 14 major stars + the auxiliary/malefic stars that carry a brightness rating. */
  brightness?: VietnameseBrightness;
  /** Set only when this star carries the chart owner's natal Tứ Hóa (sinh niên tứ hóa). */
  transformation?: FourTransformation;
  /** Marks a brightness value that has not been cross-checked against a cited source yet (rule G/X.10). */
  sourceNeeded?: boolean;
}

export interface TuanTrietZone {
  /** The two consecutive branches this void zone covers. */
  branches: [EarthlyBranchVi, EarthlyBranchVi];
}

export interface DaiVanEntry {
  /** Palace branch the decade cycle passes through. */
  branch: EarthlyBranchVi;
  heavenlyStem: HeavenlyStemVi;
  /** Inclusive age range (tuổi ta) covered by this decade. */
  startAge: number;
  endAge: number;
}

export interface TieuHanEntry {
  branch: EarthlyBranchVi;
  /** Age (tuổi ta) this Tiểu Hạn year corresponds to. */
  age: number;
}

/** A Lưu (annual-flow) star instance — position-only, never carries a natal transformation of its own (see horoscopeAdapter.ts). */
export interface HoroscopeStar {
  /** iztro's own zh-CN string for this star — stable across a session, but not a cross-star registry key like VietnameseStar.id. */
  id: string;
  name: string;
}

export interface DecadalHoroscope {
  heavenlyStem: HeavenlyStemVi;
  branch: EarthlyBranchVi;
  /** Inclusive age range (tuổi ta) this decade covers. */
  ageRange: [number, number];
  /** This decade's 12 palace names, indexed like VietnamesePalace.index (i.e. palaceNameByIndex[p.index] is what this decade calls palace p). */
  palaceNameByIndex: PalaceNameVi[];
}

export interface YearlyHoroscope {
  year: number;
  heavenlyStem: HeavenlyStemVi;
  branch: EarthlyBranchVi;
  /** This year's 12 palace names, indexed like VietnamesePalace.index. */
  palaceNameByIndex: PalaceNameVi[];
  /** This year's Tứ Hóa (from rules/fourTransformations.ts, keyed by the SAME star ids as VietnameseStar.id — apply to natal stars at render time, never to the flow stars below). */
  mutagenByStarId: Partial<Record<string, FourTransformation>>;
  /** The 10 Luu flow stars (Khoi/Viet/Xuong/Khuc/Loc Ton/Kinh Duong/Da La/Thien Ma/Hong Loan/Thien Hy) + Luu Nien Giai, indexed like VietnamesePalace.index. */
  starsByIndex: HoroscopeStar[][];
  /** Luu Thai Tue vong (suiqian12) for this year, indexed like VietnamesePalace.index. */
  suiQianByIndex: string[];
}

export interface VietnameseHoroscopeDTO {
  targetYear: number;
  /** Nominal age (tuổi ta) at the target year. */
  age: number;
  decadal: DecadalHoroscope;
  yearly: YearlyHoroscope;
}

export interface VietnamesePalace {
  index: number;
  branch: EarthlyBranchVi;
  heavenlyStem: HeavenlyStemVi;
  name: PalaceNameVi;
  isBodyPalace: boolean;
  /** True for the palace that anchors Mệnh (i.e. name === "Mệnh"). Kept alongside isBodyPalace for symmetry. */
  isSoulPalace: boolean;

  majorStars: VietnameseStar[];
  supportStars: VietnameseStar[];
  maleficStars: VietnameseStar[];
  adjectiveStars: VietnameseStar[];

  /** Natal (sinh niên) Tứ Hóa landing in this palace, derived from rules/fourTransformations.ts. */
  fourTransformations: FourTransformation[];

  changSinh: string;
  boshi: string;
  suiQian: string;

  /** Present only on the (at most two) palaces this chart's Tuần covers. */
  tuan?: true;
  /** Present only on the (at most two) palaces this chart's Triệt covers. */
  triet?: true;

  daiVan?: DaiVanEntry;
  tieuHan?: TieuHanEntry[];
}

export interface VietnameseChartDTO {
  profile: "iztro-default" | "vietnam-tan-bien" | "ngoc-am";

  name?: string;
  gender: "Nam" | "Nữ";
  solarDate: string;
  lunarDate: string;

  yearStem: HeavenlyStemVi;
  yearBranch: EarthlyBranchVi;
  monthStem: HeavenlyStemVi;
  monthBranch: EarthlyBranchVi;
  dayStem: HeavenlyStemVi;
  dayBranch: EarthlyBranchVi;
  hourStem: HeavenlyStemVi;
  hourBranch: EarthlyBranchVi;

  fiveElementsClass: FiveElementsClassVi;
  menhChu: string;
  thanChu: string;
  laiNhanCung?: PalaceNameVi;

  soulPalaceBranch: EarthlyBranchVi;
  bodyPalaceBranch: EarthlyBranchVi;

  tuan: TuanTrietZone;
  triet: TuanTrietZone;

  palaces: VietnamesePalace[];

  /** Any brightness cell used while rendering this chart that is not yet source-verified (rule G/X.10). */
  unverifiedBrightnessEntries: { starId: string; branch: EarthlyBranchVi }[];
}

export interface BirthInput {
  name?: string;
  gender: "Nam" | "Nữ";
  calendarType: "solar" | "lunar";
  day: number;
  month: number;
  year: number;
  isLeapMonth?: boolean;
  /** 24h wall-clock time, e.g. "07:30". */
  time: string;
}

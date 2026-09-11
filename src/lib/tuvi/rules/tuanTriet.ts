import type { EarthlyBranchVi, HeavenlyStemVi, TuanTrietZone } from "../types/VietnameseChart";

/**
 * Tuan (Tuan Khong) and Triet (Triet Lo) are void-zones spanning two
 * consecutive branches — never individual "stars" attached to one palace.
 * See rule G / X.6 in docs/tuvi-engine-audit.md: rendered via TuanTrietOverlay,
 * not as an entry in adjectiveStars.
 */

const TY_ANCHORED_BRANCHES: EarthlyBranchVi[] = [
  "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi",
];
const STEM_ORDER: HeavenlyStemVi[] = [
  "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý",
];

/** Triet Lo, by year heavenly stem — fixed pairing, no computation needed. */
const TRIET_BY_STEM: Record<HeavenlyStemVi, [EarthlyBranchVi, EarthlyBranchVi]> = {
  "Giáp": ["Thân", "Dậu"], "Kỷ": ["Thân", "Dậu"],
  "Ất": ["Ngọ", "Mùi"], "Canh": ["Ngọ", "Mùi"],
  "Bính": ["Thìn", "Tỵ"], "Tân": ["Thìn", "Tỵ"],
  "Đinh": ["Dần", "Mão"], "Nhâm": ["Dần", "Mão"],
  "Mậu": ["Tý", "Sửu"], "Quý": ["Tý", "Sửu"],
};

export function getTriet(yearStem: HeavenlyStemVi): TuanTrietZone {
  return { branches: TRIET_BY_STEM[yearStem] };
}

/**
 * Tuan Khong, by "luc Giap" cycle of the birth year.
 *
 * Algorithm (general — works for any of the 60 stem/branch year combos, not
 * just the golden-test year): within any 10-year block starting on a Giap
 * (jia) year, the branch advances in lockstep with the stem, so the block's
 * starting branch = (yearBranchIndex - yearStemIndex) mod 12. The two
 * branches the block never reaches — (start + 10) and (start + 11) mod 12 —
 * are the Khong Vong / Tuan void branches.
 *
 * Verified against all 6 classical "luc Giap" cases in docs/tuvi-engine-audit.md
 * section G (Giap Ty -> Tuat-Hoi, Giap Tuat -> Than-Dau, Giap Than -> Ngo-Mui,
 * Giap Ngo -> Thin-Ty, Giap Thin -> Dan-Mao, Giap Dan -> Ty-Suu) and against the
 * 05/07/2000 golden case (Canh Thin year -> Than-Dau), all exact matches.
 */
export function getTuan(yearStem: HeavenlyStemVi, yearBranch: EarthlyBranchVi): TuanTrietZone {
  const stemIndex = STEM_ORDER.indexOf(yearStem);
  const branchIndex = TY_ANCHORED_BRANCHES.indexOf(yearBranch);
  const blockStart = ((branchIndex - stemIndex) % 12 + 12) % 12;
  const first = TY_ANCHORED_BRANCHES[(blockStart + 10) % 12];
  const second = TY_ANCHORED_BRANCHES[(blockStart + 11) % 12];
  return { branches: [first, second] };
}

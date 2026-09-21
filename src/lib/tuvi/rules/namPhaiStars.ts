import type { EarthlyBranchVi, HeavenlyStemVi } from "../types/VietnameseChart";

/**
 * Auxiliary stars from the classical "Nam Phai" (Vietnamese southern-school)
 * catalog that iztro's own star set never computes at all — verified by
 * grepping node_modules/iztro for every hanzi/pinyin spelling before writing
 * this file. Quoc An, Duong Phu, Thien Giai, Dia Giai, Luu Ha live here;
 * Thien Y is NOT here — it always shares Thien Dieu's palace, which iztro
 * already places correctly, so vietnameseAdapter.ts just reuses that
 * palace's branch instead of recomputing anything.
 *
 * Every formula below was cross-checked against either a real tuvi.vn chart
 * or at least two independent, mutually-agreeing sources before being
 * trusted (2026-09-14) — see the git commit message for the citations and
 * the specific case that disproved the once-considered alternate formulas.
 */

const TY_ANCHORED_BRANCHES: EarthlyBranchVi[] = [
  "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi",
];

function offsetBranch(from: EarthlyBranchVi, offset: number): EarthlyBranchVi {
  const idx = TY_ANCHORED_BRANCHES.indexOf(from);
  return TY_ANCHORED_BRANCHES[((idx + offset) % 12 + 12) % 12];
}

/**
 * Quoc An / Duong Phu — both counted forward (thuan) from Loc Ton's own
 * palace, no gender dependency. Verified against a real tuvi.vn chart (Loc
 * Ton at Ngo -> Duong Phu landed at Hoi/Tai Bach, Quoc An at Dan/Huynh De,
 * both exact matches). A web-article description claiming Duong Phu goes
 * nghich (backward) with gender dependency was checked and REJECTED — it
 * predicted Tuat instead of the tuvi.vn chart's actual Hoi.
 */
export function getQuocAn(locTonBranch: EarthlyBranchVi): EarthlyBranchVi {
  return offsetBranch(locTonBranch, 8);
}

export function getDuongPhu(locTonBranch: EarthlyBranchVi): EarthlyBranchVi {
  return offsetBranch(locTonBranch, 5);
}

/**
 * Thien Giai / Dia Giai — by lunar birth month, month 1 anchored at Than /
 * Mui respectively, exactly one palace forward (thuan) per month. Two
 * independent sources (hocvienlyso.org's "an cac sao theo thang sinh"
 * lesson, tracuutuvi.com) agree on this simple rule. A third source (an
 * open-source lasotuvi implementation on GitHub) used a more complex
 * 2-palaces-per-month formula for Thien Giai and a Ta Phu-relative formula
 * for Dia Giai — checked and REJECTED for Thien Giai (lone outlier against
 * two agreeing sources); its Dia Giai answer happened to coincide with this
 * formula's for the one chart tested, which is what made the cross-check
 * possible at all.
 */
export function getThienGiai(lunarMonth: number): EarthlyBranchVi {
  return offsetBranch("Thân", lunarMonth - 1);
}

export function getDiaGiai(lunarMonth: number): EarthlyBranchVi {
  return offsetBranch("Mùi", lunarMonth - 1);
}

/**
 * Luu Ha — fixed by year heavenly stem only (no month/day/gender). Table
 * agreed on by multiple independent Vietnamese tu-vi sources; further
 * cross-checked indirectly via a same-input paired formula (Thien Tru) in
 * the lasotuvi reference implementation, whose answer for stem Ky matched
 * this chart's own already-correct (iztro-sourced) Thien Tru placement.
 */
const LUU_HA_BY_STEM: Record<HeavenlyStemVi, EarthlyBranchVi> = {
  "Giáp": "Dậu",
  "Ất": "Tuất",
  "Bính": "Mùi",
  "Đinh": "Thân",
  "Mậu": "Tý",
  "Kỷ": "Ngọ",
  "Canh": "Mão",
  "Tân": "Thìn",
  "Nhâm": "Hợi",
  "Quý": "Dần",
};

export function getLuuHa(yearStem: HeavenlyStemVi): EarthlyBranchVi {
  return LUU_HA_BY_STEM[yearStem];
}

/**
 * Dao Hoa — by year branch's tam hop (triangle) group, landing on the
 * "bai" (peach-blossom) position of that group: Dan-Ngo-Tuat -> Mao,
 * Than-Ty-Thin -> Dau, Ty-Dau-Suu -> Ngo, Hoi-Mao-Mui -> Ty. Cross-checked
 * 2026-09-19 against thayungkhiem.vn's "than sat Dao Hoa" lesson AND, more
 * rigorously, against iztro's own source (star/decorativeStar.js's
 * getJiangqian12StartIndex + the classical "寅午戌年将星午..." poem there):
 * this exact formula, plus a fixed +9 offset, is how iztro already places
 * "Ham Tri" (咸池, vong Tuong Tinh's 10th member) — same position, verified
 * for all 4 tam-hop groups, not just spot-checked. Computed here as its own
 * star (Moc element) rather than reusing iztro's Ham Tri (Thuy element) —
 * per user request 2026-09-19, since the two are treated as elementally
 * distinct in Tu Vi Dau So (as opposed to Bat Tu, where they're the same
 * star under two names) — see engine/vietnameseAdapter.ts's
 * SUPERSEDED_BY_OWN_DAO_HOA, which removes iztro's own Ham Tri so the two
 * don't both appear on the same branch.
 */
export function getDaoHoa(yearBranch: EarthlyBranchVi): EarthlyBranchVi {
  if (["Dần", "Ngọ", "Tuất"].includes(yearBranch)) return "Mão";
  if (["Thân", "Tý", "Thìn"].includes(yearBranch)) return "Dậu";
  if (["Tỵ", "Dậu", "Sửu"].includes(yearBranch)) return "Ngọ";
  return "Tý"; // Hợi / Mão / Mùi
}

/**
 * Thien La / Dia Vong — the two fixed "La Vong" corners: Thien La always at
 * Thin, Dia Vong always at Tuat, no dependency on birth data. Four sources
 * agree, checked 2026-09-21: tuvi.cohoc.net (Thin/Tuat, both Tho), tuvi.vn
 * ("luon dinh vi co dinh tai cung Thin", Dia Vong doi cung tai Tuat, not
 * affected by birth year), tuvikhoahoc.vn ("luon o vi tri cung Thin"). iztro
 * computes neither, so both are added here like Quoc An / Duong Phu.
 */
export const THIEN_LA_BRANCH: EarthlyBranchVi = "Thìn";
export const DIA_VONG_BRANCH: EarthlyBranchVi = "Tuất";

/**
 * Luu Nien Van Tinh — by the BIRTH-YEAR heavenly stem (all three sources
 * that give a rule say "an theo thien can cua tuoi": tuvi.cohoc.net,
 * tuvicaimenh.com, tuvidonga.com; 2026-09-21). Self-check: for every stem
 * the branch is exactly 3 positions after that stem's Loc Ton (Giap: Dan ->
 * Ty, At: Mao -> Ngo, Binh/Mau: Ty -> Than, Dinh/Ky: Ngo -> Dau, Canh: Than
 * -> Hoi, Tan: Dau -> Ty, Nham: Hoi -> Dan, Quy: Ty -> Mao), matching the
 * sources' own remark that it sits "cach Loc Ton 2 cung ve phia truoc".
 */
const LUU_NIEN_VAN_TINH_BY_STEM: Record<HeavenlyStemVi, EarthlyBranchVi> = {
  "Giáp": "Tỵ",
  "Ất": "Ngọ",
  "Bính": "Thân",
  "Đinh": "Dậu",
  "Mậu": "Thân",
  "Kỷ": "Dậu",
  "Canh": "Hợi",
  "Tân": "Tý",
  "Nhâm": "Dần",
  "Quý": "Mão",
};

export function getLuuNienVanTinh(yearStem: HeavenlyStemVi): EarthlyBranchVi {
  return LUU_NIEN_VAN_TINH_BY_STEM[yearStem];
}

/**
 * Dau Quan — start at the year-branch palace (where Thai Tue sits) as month
 * 1, count BACKWARD (nghich) to the lunar birth month, call that palace hour
 * Ty, count FORWARD (thuan) to the birth hour; where it stops is Dau Quan.
 * Same rule word-for-word on tracuutuvi.com, tuvi.cohoc.net, tuvicaimenh.com
 * (2026-09-21 — these three read as copies of one text, so the rule was also
 * checked against a worked example found elsewhere: born 1974 (year branch
 * Dan), lunar month 8, hour Mui -> counting back from Dan reaches Mui for
 * month 8, then forward 7 hours from Mui stops at Dan, "Dau Quan o cung Dan").
 * That example is pinned as a test (tests/newStars.test.ts).
 * `hourIndex` is 0 (Ty) .. 11 (Hoi).
 */
export function getDauQuan(yearBranch: EarthlyBranchVi, lunarMonth: number, hourIndex: number): EarthlyBranchVi {
  return offsetBranch(yearBranch, -(lunarMonth - 1) + hourIndex);
}

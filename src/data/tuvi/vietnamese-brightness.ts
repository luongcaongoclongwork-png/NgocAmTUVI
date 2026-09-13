import type { EarthlyBranchVi, VietnameseBrightness } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Vietnamese (Tan Bien / Van Dang Thai Thu Lang) brightness table for the 14 major stars.
 *
 * This is a SEPARATE table from iztro's own 7-level brightness data — see rule F in
 * docs/tuvi-engine-audit.md. It is not derived from iztro and must not be.
 *
 * Source: github.com/implicit-invocation/tuvi-neo, src/sao-database.ts (a from-scratch
 * Vietnamese Zi Wei Dou Shu implementation, unrelated to iztro) — decoded from its
 * per-star `dac`/`ham`/`mieu`/`vuong`/`binh` branch-index strings (1=Ty..9=Than,a=Dau,
 * b=Tuat,c=Hoi, matching that repo's own `D_CHI` array order).
 *
 * Cross-checked cell by cell against all 11 star-brightness data points given in the
 * 05/07/2000 07:30 Nam golden benchmark (docs/tuvi-engine-audit.md section Q) — every
 * one matched exactly (Tu Vi Dac/Suu, Liem Trinh Ham/Ty, Thien Dong Mieu/Than, Vu Khuc
 * Dac/Dau, Thai Duong Ham/Tuat, Thien Co Dac/Ty, Thien Phu Binh/Mao, Thai Am Ham/Thin,
 * Tham Lang Ham/Ty, Cu Mon Vuong/Ngo, Thien Tuong Dac/Mui, Thien Luong Vuong/Than,
 * That Sat Ham/Dau, Pha Quan Vuong/Suu). Also spot-checked against the Mieu-position
 * lists published at thaiam.vn/tu-vi-wiki/dac-tinh.html and horos.vn's brightness
 * explainer, which agree on every star they cover.
 *
 * Minor/auxiliary stars are intentionally NOT included here — the source above only
 * carries a binary dac/ham flag for them (not the full 5-level scale) and none of the
 * golden benchmark cells cover them, so per rule G they stay `sourceNeeded` rather than
 * being guessed. See rules/brightness.ts.
 */
export const MAJOR_STAR_BRIGHTNESS_VI: Record<string, Partial<Record<EarthlyBranchVi, VietnameseBrightness>>> = {
  ziweiMaj: {
    Sửu: "Đ", Mùi: "Đ",
    Thìn: "V", Tuất: "V",
    Tỵ: "M", Ngọ: "M", Dần: "M", Thân: "M",
    Hợi: "B", Tý: "B", Mão: "B", Dậu: "B",
  },
  lianzhenMaj: {
    Sửu: "Đ", Mùi: "Đ",
    Tỵ: "H", Hợi: "H", Mão: "H", Dậu: "H",
    Thìn: "M", Tuất: "M",
    Tý: "V", Ngọ: "V", Dần: "V", Thân: "V",
  },
  tiantongMaj: {
    Mão: "Đ", Tỵ: "Đ", Hợi: "Đ",
    Thìn: "H", Dậu: "H", Sửu: "H", Mùi: "H", Ngọ: "H", Tuất: "H",
    Dần: "M", Thân: "M",
    Tý: "V",
  },
  wuquMaj: {
    Mão: "Đ", Dậu: "Đ",
    Tỵ: "H", Hợi: "H",
    Thìn: "M", Tuất: "M", Sửu: "M", Mùi: "M",
    Dần: "V", Thân: "V", Tý: "V", Ngọ: "V",
  },
  taiyangMaj: {
    Sửu: "Đ", Mùi: "Đ",
    Thân: "H", Dậu: "H", Tuất: "H", Hợi: "H", Tý: "H",
    Tỵ: "M", Ngọ: "M",
    Dần: "V", Mão: "V", Thìn: "V",
  },
  tianjiMaj: {
    Tý: "Đ", Ngọ: "Đ", Sửu: "Đ", Mùi: "Đ",
    Dần: "H", Hợi: "H",
    Thìn: "M", Tuất: "M", Mão: "M", Dậu: "M",
    Tỵ: "V", Thân: "V",
  },
  tianfuMaj: {
    Tỵ: "Đ", Hợi: "Đ", Mùi: "Đ",
    Dần: "M", Thân: "M", Tý: "M", Ngọ: "M",
    Thìn: "V", Tuất: "V",
    Mão: "B", Dậu: "B", Sửu: "B",
  },
  taiyinMaj: {
    Sửu: "Đ", Mùi: "Đ",
    Dần: "H", Mão: "H", Thìn: "H", Tỵ: "H", Ngọ: "H",
    Dậu: "M", Tuất: "M", Hợi: "M",
    Thân: "V", Tý: "V",
  },
  tanlangMaj: {
    Dần: "Đ", Thân: "Đ",
    Tỵ: "H", Hợi: "H", Tý: "H", Ngọ: "H", Mão: "H", Dậu: "H",
    Sửu: "M", Mùi: "M",
    Thìn: "V", Tuất: "V",
  },
  jumenMaj: {
    Thân: "Đ", Hợi: "Đ",
    Thìn: "H", Tuất: "H", Sửu: "H", Mùi: "H", Tỵ: "H",
    Mão: "M", Dậu: "M",
    Tý: "V", Ngọ: "V", Dần: "V",
  },
  tianxiangMaj: {
    Sửu: "Đ", Mùi: "Đ", Tỵ: "Đ", Hợi: "Đ",
    Mão: "H", Dậu: "H",
    Dần: "M", Thân: "M",
    Thìn: "V", Tuất: "V", Tý: "V", Ngọ: "V",
  },
  tianliangMaj: {
    Sửu: "Đ", Mùi: "Đ",
    Dậu: "H", Tỵ: "H", Hợi: "H",
    Ngọ: "M", Thìn: "M", Tuất: "M",
    Tý: "V", Mão: "V", Dần: "V", Thân: "V",
  },
  qishaMaj: {
    Sửu: "Đ", Mùi: "Đ",
    Mão: "H", Dậu: "H", Thìn: "H", Tuất: "H",
    Dần: "M", Thân: "M", Tý: "M", Ngọ: "M",
    Tỵ: "V", Hợi: "V",
  },
  pojunMaj: {
    Thìn: "Đ", Tuất: "Đ",
    Mão: "H", Dậu: "H", Dần: "H", Thân: "H", Tỵ: "H", Hợi: "H",
    Tý: "M", Ngọ: "M",
    Sửu: "V", Mùi: "V",
  },
};

/**
 * Vietnamese brightness for the 6 sat tinh (Kinh Duong, Da La, Hoa Tinh, Linh
 * Tinh, Dia Khong, Dia Kiep) + Van Xuong/Van Khuc — a SEPARATE, much sparser
 * table from the major-star one above.
 *
 * Why sparse: two independent glossary sources (tuvi.vn's own dedicated
 * articles at tuvi.vn/sao-kinh-duong-va-da-la-a546 and
 * tuvi.vn/hai-sao-hoa-tinh-va-linh-tinh-a537, plus a cross-check against
 * github.com/implicit-invocation/tuvi-neo's sao-database.ts binary dac/ham
 * data) were checked against tuvi.vn's own LIVE-RENDERED chart for the golden
 * benchmark (tuvi.vn/la-so-am-nu-am-duong-thuan-ly-16-6-1999-thin-36117,
 * fetched 2026-09-13) and turned out to CONTRADICT it: e.g. the Kinh
 * Duong/Da La article states "mieu tai Thin Tuat Suu Mui", but that same
 * chart actually renders Kinh Duong as "(D)" (Dac), not "(M)" (Mieu), at Mui;
 * the Hoa Tinh/Linh Tinh article's classical tam-hop-cuc scheme (mieu Dan
 * Ngo Tuat / dac Ty Dau Suu / loi ich Hoi Mao Mui / ham Than Ty Thin) is also
 * contradicted by that chart's Linh Tinh "(D)" at Ngo, which the article's
 * own scheme calls Ham (Than Ty Thin) not Dac. Neither article matches what
 * tuvi.vn's engine actually computes, so per rule G neither was trusted.
 *
 * Every entry below instead came directly from reading tuvi.vn's own live
 * chart output for that one golden-benchmark birth case — each cell is a
 * single verified (star, branch) -> brightness reading, not a derived rule.
 * This intentionally covers only ONE branch per star (whichever branch that
 * star happens to land on for this one person) — the remaining 11 branches
 * per star stay `sourceNeeded` (no badge shown) until verified the same way
 * against additional sample charts. See rules/brightness.ts.
 */
export const MINOR_STAR_BRIGHTNESS_VI: Record<string, Partial<Record<EarthlyBranchVi, VietnameseBrightness>>> = {
  qingyangMin: { Mùi: "Đ" },
  tuoluoMin: { Tỵ: "H" },
  huoxingMin: { Sửu: "H" },
  lingxingMin: { Ngọ: "Đ" },
  dikongMin: { Mùi: "H" },
  dijieMin: { Mão: "B" },
  wenchangMin: { Ngọ: "H" },
  wenquMin: { Thân: "H" },
};

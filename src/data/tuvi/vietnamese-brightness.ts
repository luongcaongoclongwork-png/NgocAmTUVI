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

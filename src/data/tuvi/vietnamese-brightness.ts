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
 * Tinh, Dia Khong, Dia Kiep) + Van Xuong/Van Khuc — a SEPARATE table from the
 * major-star one above.
 *
 * Why a separate table: two independent glossary sources (tuvi.vn's own
 * dedicated articles at tuvi.vn/sao-kinh-duong-va-da-la-a546 and
 * tuvi.vn/hai-sao-hoa-tinh-va-linh-tinh-a537, plus a cross-check against
 * github.com/implicit-invocation/tuvi-neo's sao-database.ts binary dac/ham
 * data) were checked against tuvi.vn's own LIVE-RENDERED charts and turned
 * out to CONTRADICT the published articles in multiple spots (e.g. the Kinh
 * Duong/Da La article states "mieu tai Thin Tuat Suu Mui", but tuvi.vn's own
 * engine renders Kinh Duong as "(D)" Dac, not "(M)" Mieu, at Mui). Neither
 * article matches what tuvi.vn's engine actually computes, so per rule G
 * neither was trusted — every entry below instead came directly from reading
 * tuvi.vn's own live chart output, one verified (star, branch) -> brightness
 * reading at a time, never a derived formula.
 *
 * Round 2 (2026-09-14): systematically read 14 additional tuvi.vn charts
 * (solar 15/06 of 1984-1995 + 1997 + 2001-2002, Nam, each a different birth
 * hour) chosen so that between them every reachable branch of Kinh Duong/
 * Da La/Dia Khong/Van Xuong/Van Khuc/Linh Tinh/Hoa Tinh got hit at least
 * once (Kinh Duong and Da La each only ever land on 8 of the 12 branches —
 * confirmed by scanning our own engine first, see git history). Result:
 * Kinh Duong, Da La and Dia Khong are now verified on EVERY branch they can
 * reach. Van Xuong/Van Khuc are missing only Mao and Dau — tuvi.vn itself
 * renders no brightness badge for either star at those two branches specific
 * (confirmed by revisiting each at a second, unrelated birth chart; not a
 * one-off rendering glitch). Dia Kiep almost never gets a brightness badge
 * on tuvi.vn at all (badge-less in 10 of 11 chart readings) — the one Dan/Dac
 * reading below is the only one caught; do not treat its remaining
 * `sourceNeeded` cells as a gap to chase further with this method.
 *
 * A separate finding from this round, NOT a brightness issue: Hoa Tinh and
 * Linh Tinh's own BRANCH POSITION (not just brightness) frequently disagreed
 * between our iztro-derived chart and tuvi.vn's for the identical birth
 * input — iztro's getHuoLingIndex() always counts both stars forward
 * (thuan) by hour, but only one of the two actually counts forward per
 * year-branch group, the other counts backward (nghich). This has since
 * been FIXED and verified against two independent engines (tuvi.vn,
 * tracuutuvi.com) — see ChartProfile.fixHuoLingDirection in
 * vietnameseAdapter.ts and docs/tuvi-engine-audit.md section 7 for the full
 * derivation. The `lingxingMin.Tý` entry below came directly out of that
 * follow-up cross-check (both sources agreed on Tý -> H).
 */
export const MINOR_STAR_BRIGHTNESS_VI: Record<string, Partial<Record<EarthlyBranchVi, VietnameseBrightness>>> = {
  qingyangMin: {
    Mão: "H", Thìn: "Đ", Ngọ: "H", Mùi: "Đ", Dậu: "H", Tuất: "Đ", Tý: "H", Sửu: "Đ",
  },
  tuoluoMin: {
    Sửu: "Đ", Dần: "H", Thìn: "Đ", Tỵ: "H", Mùi: "Đ", Thân: "H", Tuất: "Đ", Hợi: "H",
  },
  huoxingMin: {
    Sửu: "H", Dần: "Đ", Mão: "Đ", Ngọ: "Đ", Mùi: "H", Tuất: "H", Hợi: "H",
  },
  lingxingMin: {
    Ngọ: "Đ", Tuất: "H", Hợi: "H", Sửu: "H", Mão: "Đ", Dậu: "H", Tỵ: "Đ", Dần: "Đ", Mùi: "H", Tý: "H",
  },
  dikongMin: {
    Mùi: "H", Hợi: "Đ", Tuất: "H", Dậu: "H", Thân: "Đ", Ngọ: "H", Tỵ: "Đ", Thìn: "H",
    Mão: "H", Dần: "Đ", Sửu: "H", Tý: "H",
  },
  dijieMin: { Mão: "B", Dần: "Đ" },
  wenchangMin: {
    Ngọ: "H", Tuất: "Đ", Thân: "H", Mùi: "Đ", Tỵ: "Đ", Thìn: "Đ", Dần: "H", Sửu: "Đ",
    Tý: "H", Hợi: "Đ",
  },
  wenquMin: {
    Thân: "H", Thìn: "Đ", Tỵ: "Đ", Ngọ: "H", Mùi: "Đ", Tuất: "Đ", Hợi: "Đ", Tý: "H",
    Sửu: "Đ", Dần: "H",
  },
};

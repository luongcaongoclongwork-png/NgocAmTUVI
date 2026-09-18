import type {
  EarthlyBranchVi,
  FiveElementsClassVi,
  FourTransformation,
  HeavenlyStemVi,
} from "../types/VietnameseChart";

export const HEAVENLY_STEM_VI: Record<string, HeavenlyStemVi> = {
  "甲": "Giáp",
  "乙": "Ất",
  "丙": "Bính",
  "丁": "Đinh",
  "戊": "Mậu",
  "己": "Kỷ",
  "庚": "Canh",
  "辛": "Tân",
  "壬": "Nhâm",
  "癸": "Quý",
};

export const EARTHLY_BRANCH_VI: Record<string, EarthlyBranchVi> = {
  "子": "Tý",
  "丑": "Sửu",
  "寅": "Dần",
  "卯": "Mão",
  "辰": "Thìn",
  "巳": "Tỵ",
  "午": "Ngọ",
  "未": "Mùi",
  "申": "Thân",
  "酉": "Dậu",
  "戌": "Tuất",
  "亥": "Hợi",
};

export const GENDER_VI: Record<string, "Nam" | "Nữ"> = {
  "男": "Nam",
  "女": "Nữ",
};

export const FIVE_ELEMENTS_CLASS_VI: Record<string, FiveElementsClassVi> = {
  "水二局": "Thủy Nhị Cục",
  "木三局": "Mộc Tam Cục",
  "金四局": "Kim Tứ Cục",
  "土五局": "Thổ Ngũ Cục",
  "火六局": "Hỏa Lục Cục",
};

export const MUTAGEN_VI: Record<string, FourTransformation> = {
  "禄": "Lộc",
  "权": "Quyền",
  "科": "Khoa",
  "忌": "Kỵ",
};

/** Truong Sinh 12-star cycle (changsheng12), keyed by iztro's zh-CN label. */
export const CHANG_SINH_VI: Record<string, string> = {
  "长生": "Trường Sinh",
  "沐浴": "Mộc Dục",
  "冠带": "Quan Đới",
  "临官": "Lâm Quan",
  "帝旺": "Đế Vượng",
  "衰": "Suy",
  "病": "Bệnh",
  "死": "Tử",
  "墓": "Mộ",
  "绝": "Tuyệt",
  "胎": "Thai",
  "养": "Dưỡng",
};

/** Bac Si 12-star cycle (boshi12). */
export const BOSHI_VI: Record<string, string> = {
  "博士": "Bác Sĩ",
  "力士": "Lực Sĩ",
  "青龙": "Thanh Long",
  "小耗": "Tiểu Hao",
  "将军": "Tướng Quân",
  "奏书": "Tấu Thư",
  "飞廉": "Phi Liêm",
  "喜神": "Hỷ Thần",
  "病符": "Bệnh Phù",
  "大耗": "Đại Hao",
  "伏兵": "Phục Binh",
  "官府": "Quan Phủ",
};

/**
 * Vong Tuong Tinh (jiangqian12) is NOT translated/exposed anywhere in this
 * app — removed entirely 2026-09-19 per user request: only 3 of its 12
 * members (Dao Hoa/Ham Tri, Hoa Cai, Kiep Sat) are actually used in
 * traditional Vietnamese Tu Vi practice (per khoahoc.tuvichanco.net's "vong
 * Tuong Tinh" lesson), and all 3 already exist as independent standalone
 * stars this engine computes on their own (rules/namPhaiStars.ts's Dao Hoa,
 * and iztro's own hoa Cai / jieshaAdj) — so the other 9 members were purely
 * a "trung chau" (Chinese school) artifact with no Vietnamese-tradition
 * standing, and even the 3 traditionally-real ones were pure duplicates of
 * stars already shown elsewhere on the chart. See
 * engine/vietnameseAdapter.ts / engine/horoscopeAdapter.ts for where the
 * removal happens; iztro's own jiangqian12 computation is unaffected
 * (unused output, not deleted upstream — untouched per rule against editing
 * the library).
 */

/** Tue Tien 12-star cycle (suiqian12, vong Thai Tue). */
export const SUI_QIAN_VI: Record<string, string> = {
  "岁建": "Tuế Kiến",
  "晦气": "Hối Khí",
  "丧门": "Tang Môn",
  "贯索": "Quán Sách",
  "官符": "Quan Phù",
  "小耗": "Tiểu Hao",
  "大耗": "Đại Hao",
  "龙德": "Long Đức",
  "白虎": "Bạch Hổ",
  "天德": "Thiên Đức",
  "吊客": "Điếu Khách",
  "病符": "Bệnh Phù",
  // zhongzhou-algorithm variant swaps "Dai Hao" for "Sui Pho" at this position
  "岁破": "Tuế Phá",
};

/**
 * Annual ("luu nien") flow-star translations for horoscopeAdapter.ts.
 * iztro emits these under DISTINCT zh-CN strings from their natal
 * counterparts — prefixed "流" (Luu) rather than the natal 天魁/天钺/文昌/
 * 文曲/禄存/擎羊/陀罗/天马/红鸾/天喜 forms — verified against
 * node_modules/iztro@2.6.1/lib/i18n/locales/zh-CN/star.js (`liukui`,
 * `liuyue`, `liuchang`, `liuqu`, `liulu`, `liuyang`, `liutuo`, `liuma`,
 * `liuluan`, `liuxi`). "年解" (nianjie) reuses the same zh-CN string as the
 * natal "Niên Giải" star (STAR_NAMES_VI) but is relabeled "Lưu Niên Giải"
 * here since iztro re-emits it as part of the yearly flow-star set too.
 * Never used by the natal chart — only engine/horoscopeAdapter.ts.
 */
export const YEARLY_FLOW_STAR_VI: Record<string, string> = {
  "流魁": "Lưu Thiên Khôi",
  "流钺": "Lưu Thiên Việt",
  "流昌": "Lưu Văn Xương",
  "流曲": "Lưu Văn Khúc",
  "流禄": "Lưu Lộc Tồn",
  "流羊": "Lưu Kình Dương",
  "流陀": "Lưu Đà La",
  "流马": "Lưu Thiên Mã",
  "流鸾": "Lưu Hồng Loan",
  "流喜": "Lưu Thiên Hỷ",
  "年解": "Lưu Niên Giải",
};

function invert<T extends string>(map: Record<string, T>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [zh, vi] of Object.entries(map)) out[vi] = zh;
  return out;
}

export const HEAVENLY_STEM_ZH = invert(HEAVENLY_STEM_VI);
export const EARTHLY_BRANCH_ZH = invert(EARTHLY_BRANCH_VI);

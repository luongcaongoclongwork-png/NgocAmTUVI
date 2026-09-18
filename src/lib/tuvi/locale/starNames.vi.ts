import type { StarCategory } from "../types/VietnameseChart";

/**
 * Canonical Vietnamese star registry, keyed by iztro's own internal star key
 * (e.g. "ziweiMaj") — NOT by iztro's vi-VN locale, which has known bugs
 * (e.g. "Tả Phù" instead of "Tả Phụ", "Bác Sỹ" instead of "Bác Sĩ", and the
 * brightness key "xian" mistranslated as "Hạn" instead of "Hãm" — verified
 * 2026-09-12 against node_modules/iztro@2.6.1/lib/i18n/locales/vi-VN/*.js).
 *
 * `zh` is iztro's zh-CN string for this key — used by engine/iztroAdapter.ts
 * to reverse-map a star returned in zh-CN back to this registry, since zh-CN
 * output is unambiguous and stable across iztro versions (unlike relying on
 * iztro's own vi-VN translation).
 *
 * Per rule I/X.9: every star key iztro can emit must appear here. Alias
 * display overrides (e.g. Thien Dieu vs Thien Rieu) live in
 * data/tuvi/star-aliases.ts and are layered on top of `name` at render time,
 * never by editing the canonical id.
 */
export interface StarRegistryEntry {
  zh: string;
  name: string;
  category: StarCategory;
  element?: "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";
}

export const STAR_NAMES_VI: Record<string, StarRegistryEntry> = {
  // 14 chính tinh
  ziweiMaj: { zh: "紫微", name: "Tử Vi", category: "major", element: "Thổ" },
  tianjiMaj: { zh: "天机", name: "Thiên Cơ", category: "major", element: "Mộc" },
  taiyangMaj: { zh: "太阳", name: "Thái Dương", category: "major", element: "Hỏa" },
  wuquMaj: { zh: "武曲", name: "Vũ Khúc", category: "major", element: "Kim" },
  tiantongMaj: { zh: "天同", name: "Thiên Đồng", category: "major", element: "Thủy" },
  lianzhenMaj: { zh: "廉贞", name: "Liêm Trinh", category: "major", element: "Hỏa" },
  tianfuMaj: { zh: "天府", name: "Thiên Phủ", category: "major", element: "Thổ" },
  taiyinMaj: { zh: "太阴", name: "Thái Âm", category: "major", element: "Thủy" },
  tanlangMaj: { zh: "贪狼", name: "Tham Lang", category: "major", element: "Mộc" },
  jumenMaj: { zh: "巨门", name: "Cự Môn", category: "major", element: "Thủy" },
  tianxiangMaj: { zh: "天相", name: "Thiên Tướng", category: "major", element: "Thủy" },
  tianliangMaj: { zh: "天梁", name: "Thiên Lương", category: "major", element: "Thổ" },
  qishaMaj: { zh: "七杀", name: "Thất Sát", category: "major", element: "Kim" },
  pojunMaj: { zh: "破军", name: "Phá Quân", category: "major", element: "Thủy" },

  // Phụ tinh cát (support)
  zuofuMin: { zh: "左辅", name: "Tả Phụ", category: "support", element: "Thổ" },
  youbiMin: { zh: "右弼", name: "Hữu Bật", category: "support", element: "Thủy" },
  wenchangMin: { zh: "文昌", name: "Văn Xương", category: "support", element: "Kim" },
  wenquMin: { zh: "文曲", name: "Văn Khúc", category: "support", element: "Thủy" },
  lucunMin: { zh: "禄存", name: "Lộc Tồn", category: "support", element: "Thổ" },
  tianmaMin: { zh: "天马", name: "Thiên Mã", category: "support", element: "Hỏa" },
  tiankuiMin: { zh: "天魁", name: "Thiên Khôi", category: "support", element: "Hỏa" },
  tianyueMin: { zh: "天钺", name: "Thiên Việt", category: "support", element: "Hỏa" },

  // Sát tinh (malefic) — lục sát
  qingyangMin: { zh: "擎羊", name: "Kình Dương", category: "malefic", element: "Kim" },
  tuoluoMin: { zh: "陀罗", name: "Đà La", category: "malefic", element: "Kim" },
  huoxingMin: { zh: "火星", name: "Hỏa Tinh", category: "malefic", element: "Hỏa" },
  lingxingMin: { zh: "铃星", name: "Linh Tinh", category: "malefic", element: "Hỏa" },
  dikongMin: { zh: "地空", name: "Địa Không", category: "malefic", element: "Hỏa" },
  dijieMin: { zh: "地劫", name: "Địa Kiếp", category: "malefic", element: "Hỏa" },

  // Tạp diệu / phụ tinh khác (auxiliary)
  jieshaAdj: { zh: "劫杀", name: "Kiếp Sát", category: "auxiliary" },
  tiankong: { zh: "天空", name: "Thiên Không", category: "auxiliary" },
  tianxing: { zh: "天刑", name: "Thiên Hình", category: "auxiliary" },
  tianyao: { zh: "天姚", name: "Thiên Diêu", category: "auxiliary" },
  jieshen: { zh: "解神", name: "Giải Thần", category: "auxiliary" },
  yinsha: { zh: "阴煞", name: "Âm Sát", category: "auxiliary" },
  tianxi: { zh: "天喜", name: "Thiên Hỷ", category: "auxiliary" },
  tianguan: { zh: "天官", name: "Thiên Quan", category: "auxiliary" },
  tianfu: { zh: "天福", name: "Thiên Phúc", category: "auxiliary" },
  tianku: { zh: "天哭", name: "Thiên Khốc", category: "auxiliary" },
  tianxu: { zh: "天虚", name: "Thiên Hư", category: "auxiliary" },
  longchi: { zh: "龙池", name: "Long Trì", category: "auxiliary" },
  fengge: { zh: "凤阁", name: "Phượng Các", category: "auxiliary" },
  hongluan: { zh: "红鸾", name: "Hồng Loan", category: "auxiliary" },
  guchen: { zh: "孤辰", name: "Cô Thần", category: "auxiliary" },
  guasu: { zh: "寡宿", name: "Quả Tú", category: "auxiliary" },
  feilian: { zh: "蜚廉", name: "Phi Liêm", category: "auxiliary" },
  posui: { zh: "破碎", name: "Phá Toái", category: "auxiliary" },
  taifu: { zh: "台辅", name: "Đài Phụ", category: "auxiliary" },
  fenggao: { zh: "封诰", name: "Phong Cáo", category: "auxiliary" },
  tianwu: { zh: "天巫", name: "Thiên Vu", category: "auxiliary" },
  tianyue: { zh: "天月", name: "Thiên Nguyệt", category: "auxiliary" },
  santai: { zh: "三台", name: "Tam Thai", category: "auxiliary" },
  bazuo: { zh: "八座", name: "Bát Tọa", category: "auxiliary" },
  engguang: { zh: "恩光", name: "Ân Quang", category: "auxiliary" },
  tiangui: { zh: "天贵", name: "Thiên Quý", category: "auxiliary" },
  tiancai: { zh: "天才", name: "Thiên Tài", category: "auxiliary" },
  tianshou: { zh: "天寿", name: "Thiên Thọ", category: "auxiliary" },
  yuede: { zh: "月德", name: "Nguyệt Đức", category: "auxiliary" },
  tianshang: { zh: "天伤", name: "Thiên Thương", category: "auxiliary" },
  tianshi: { zh: "天使", name: "Thiên Sứ", category: "auxiliary" },
  tianchu: { zh: "天厨", name: "Thiên Trù", category: "auxiliary" },
  // Also appear as standalone adjectiveStars entries (in addition to being one
  // slot of the jiangqian12/suiqian12 per-palace cycle strings already
  // translated via JIANG_QIAN_VI/SUI_QIAN_VI in locale/astronomyNames.vi.ts).
  dahao: { zh: "大耗", name: "Đại Hao", category: "cycle" },
  huagai: { zh: "华盖", name: "Hoa Cái", category: "cycle" },
  longde: { zh: "龙德", name: "Long Đức", category: "cycle" },
  nianjie: { zh: "年解", name: "Niên Giải", category: "cycle" },
  tiande: { zh: "天德", name: "Thiên Đức", category: "cycle" },
  xianchi: { zh: "咸池", name: "Hàm Trì", category: "cycle" },

  // Tuan/Triet-like adjective stars iztro also emits — these are SUPERSEDED by our own
  // algorithmic Tuan/Triet overlay (rule X.6) and must be filtered out of adjectiveStars
  // before building the DTO. Kept here only so the translator never leaks Chinese if one
  // slips through, and so vietnameseAdapter has a definitive exclusion list to filter on.
  jiekong: { zh: "截空", name: "Triệt Không", category: "auxiliary" },
  xunzhong: { zh: "旬中", name: "Tuần Trung", category: "auxiliary" },
  xunkong: { zh: "旬空", name: "Tuần Không", category: "auxiliary" },
  kongwang: { zh: "空亡", name: "Không Vong", category: "auxiliary" },
  jielu: { zh: "截路", name: "Triệt Lộ", category: "auxiliary" },
};

/** Star ids whose Tuan/Triet-flavoured meaning is fully replaced by rules/tuanTriet.ts. */
export const SUPERSEDED_BY_OWN_TUAN_TRIET = new Set([
  "jiekong",
  "xunzhong",
  "xunkong",
  "kongwang",
  "jielu",
]);

/**
 * "xianchi" (Hàm Trì, 咸池) — removed per user request 2026-09-19: iztro
 * always emits this as a standalone star (adjectiveStar.js, unconditional,
 * not gated behind the zhongzhou algorithm switch), landing on the exact
 * same branch rules/namPhaiStars.ts's own getDaoHoa() now computes (same
 * year-branch tam-hop formula, cross-verified against iztro's own
 * getJiangqian12StartIndex — see that function's comment for the citation).
 * Keeping both would show two stars on the same branch for what Tu Vi Dau
 * So treats as elementally distinct entities (Dao Hoa = Moc, Ham Tri =
 * Thuy) rather than one star under two names (unlike Bat Tu, where they
 * are synonyms) — so the raw iztro "Hàm Trì" is filtered out here and the
 * dedicated Dao Hoa star takes its place. Vong Tuong Tinh's OWN "Hàm Trì"
 * position label (locale/astronomyNames.vi.ts's JIANG_QIAN_VI, palace.jiangQian
 * / horoscope.yearly.jiangQianByIndex) is a completely separate code path —
 * a cycle-position name, not a star — and is untouched by this.
 */
export const SUPERSEDED_BY_OWN_DAO_HOA = new Set(["xianchi"]);

const ZH_TO_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(STAR_NAMES_VI).map(([key, entry]) => [entry.zh, key]),
);

export function starKeyFromZh(zh: string): string | undefined {
  return ZH_TO_KEY[zh];
}

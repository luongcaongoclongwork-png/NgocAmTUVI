/**
 * Xuyen Tam Diem (川三焰) display-name overrides for stars, keyed by the SAME
 * canonical star id locale/starNames.vi.ts already uses (e.g. "tianjiMaj") —
 * same convention as data/tuvi/star-aliases.ts, just a second, richer
 * dictionary instead of a plain string map, since the 14 chinh tinh also
 * carry which of the 3 "flame" (diem) groups they belong to. The canonical
 * id/name a star computes under never changes — this is display-only, read
 * at render time by the Xtd* components (see components/tuvi/xtd/), never by
 * anything in lib/tuvi/engine or lib/tuvi/rules.
 *
 * Source: user-provided "XUYEN TAM DIEM (川三焰)" spec, 2026-09-19. Entries
 * not in that spec are intentionally left out — render falls back to the
 * canonical Vietnamese name (see getXtdStarName below), never invented.
 *
 * Note: "Dao Hoa" (spec's Dao Hoa -> Ho Toan) now maps to "daoHoaNamPhai" —
 * a real star added to the engine 2026-09-19 (rules/namPhaiStars.ts's
 * getDaoHoa(), replacing iztro's own "Ham Tri" at the same branch — see
 * locale/starNames.vi.ts's SUPERSEDED_BY_OWN_DAO_HOA for why). Previously
 * this codebase computed no star named "Dao Hoa" at all. "Tieu Hao"
 * (spec's "sao phu khac" table -> Trich Thuy) is not a standalone star id
 * either — it only exists as a Thai Sui/Boshi cycle POSITION label, and that
 * position is already covered by taiSuiCycle.ts's "Hac Phan" (a later,
 * explicit user decision) — left out here to avoid the collision.
 */

export type XtdFlame = "nhien-dang" | "boi-quang" | "do-ty";

export interface XtdStarEntry {
  display: string;
  han?: string;
  flame?: XtdFlame;
}

export const XUYEN_TAM_DIEM_STAR_MAP: Record<string, XtdStarEntry> = {
  // 14 chinh tinh, chia theo Tam Diem
  tianjiMaj: { display: "Bà Tẩu", han: "婆薮", flame: "nhien-dang" },
  tiantongMaj: { display: "Hóa Sinh", han: "化生", flame: "nhien-dang" },
  taiyinMaj: { display: "Nguyệt Quang", han: "月光", flame: "nhien-dang" },
  tianliangMaj: { display: "Thiền Định", han: "禅定", flame: "nhien-dang" },

  ziweiMaj: { display: "Chủ Tôn", han: "主尊", flame: "boi-quang" },
  taiyangMaj: { display: "Nhật Quang", han: "日光", flame: "boi-quang" },
  tianfuMaj: { display: "Tàng Kinh", han: "藏经", flame: "boi-quang" },
  tianxiangMaj: { display: "Cúng Dường", han: "供养", flame: "boi-quang" },
  jumenMaj: { display: "Tần Già", han: "频伽", flame: "boi-quang" },

  wuquMaj: { display: "Kim Cang", han: "金刚", flame: "do-ty" },
  lianzhenMaj: { display: "Hàng Ma", han: "降魔", flame: "do-ty" },
  tanlangMaj: { display: "Phản Đàn", han: "反弹", flame: "do-ty" },
  qishaMaj: { display: "Tu La", han: "修罗", flame: "do-ty" },
  pojunMaj: { display: "Dạ Xoa", han: "夜叉", flame: "do-ty" },

  // Luc cat
  zuofuMin: { display: "Tả Hiệp" },
  youbiMin: { display: "Hữu Hiệp" },
  wenchangMin: { display: "Duy Ma" },
  wenquMin: { display: "Kỹ Nhạc" },
  tiankuiMin: { display: "Văn Thù" },
  tianyueMin: { display: "Phổ Hiền" },

  // Luc sat
  qingyangMin: { display: "Bảo Kiếm" },
  tuoluoMin: { display: "Triền Chi" },
  huoxingMin: { display: "Liệt Diệm" },
  lingxingMin: { display: "Ám Đăng" },
  dikongMin: { display: "Không Khám" },
  dijieMin: { display: "La Sát" },

  // Dao hoa - hinh phap
  daoHoaNamPhai: { display: "Hồ Toàn" },
  hongluan: { display: "Hàm Hoa" },
  tianxi: { display: "Tán Hoa" },
  tianyao: { display: "Ma Nữ" },
  tianxing: { display: "Giới Trượng" },

  // Loc Ma
  lucunMin: { display: "Tịnh Bình" },
  tianmaMin: { display: "Trương Khiên" },

  // Sao phu khac
  santai: { display: "Tam Thố" },
  bazuo: { display: "Thiên Long" },
  engguang: { display: "Thiếp Kim" },
  tiangui: { display: "Thụ Ký" },
  longchi: { display: "Thủy Nguyệt" },
  fengge: { display: "Bảo Các" },
  taifu: { display: "Huyền Cái" },
  fenggao: { display: "Đề Bích" },
  tianku: { display: "Ai Nhạc" },
  tianxu: { display: "Hư Hưởng" },
  guchen: { display: "Độc Tu" },
  guasu: { display: "Cô Nhạn" },
  tiankong: { display: "Hư Không" },
  jieshaAdj: { display: "Đoạt Bảo" },
  huagai: { display: "Bảo Cái" },
  posui: { display: "Tàn Bích" },
  quocAnNamPhai: { display: "Quan Ấn" },
  duongPhuNamPhai: { display: "Tự Ngạch" },
  dahao: { display: "Sa Bạo" },
};

/** Falls back to the canonical Vietnamese name when no Xtd entry exists — never crashes, never invents a name. */
export function getXtdStarName(starId: string, canonicalName: string): string {
  return XUYEN_TAM_DIEM_STAR_MAP[starId]?.display ?? canonicalName;
}

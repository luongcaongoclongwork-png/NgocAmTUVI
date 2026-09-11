import type { FourTransformation, HeavenlyStemVi } from "../types/VietnameseChart";

/**
 * Natal (sinh nien) Tu Hoa table, keyed by year heavenly stem.
 * Values are star ids from locale/starNames.vi.ts (iztro's internal keys).
 */
export const FOUR_TRANSFORMATIONS_VI: Record<HeavenlyStemVi, Record<FourTransformation, string>> = {
  "Giáp": { Lộc: "lianzhenMaj", Quyền: "pojunMaj", Khoa: "wuquMaj", Kỵ: "taiyangMaj" },
  "Ất": { Lộc: "tianjiMaj", Quyền: "tianliangMaj", Khoa: "ziweiMaj", Kỵ: "taiyinMaj" },
  "Bính": { Lộc: "tiantongMaj", Quyền: "tianjiMaj", Khoa: "wenchangMin", Kỵ: "lianzhenMaj" },
  "Đinh": { Lộc: "taiyinMaj", Quyền: "tiantongMaj", Khoa: "tianjiMaj", Kỵ: "jumenMaj" },
  "Mậu": { Lộc: "tanlangMaj", Quyền: "taiyinMaj", Khoa: "youbiMin", Kỵ: "tianjiMaj" },
  "Kỷ": { Lộc: "wuquMaj", Quyền: "tanlangMaj", Khoa: "tianliangMaj", Kỵ: "wenquMin" },
  "Canh": { Lộc: "taiyangMaj", Quyền: "wuquMaj", Khoa: "taiyinMaj", Kỵ: "tiantongMaj" },
  "Tân": { Lộc: "jumenMaj", Quyền: "taiyangMaj", Khoa: "wenquMin", Kỵ: "wenchangMin" },
  "Nhâm": { Lộc: "tianliangMaj", Quyền: "ziweiMaj", Khoa: "zuofuMin", Kỵ: "wuquMaj" },
  "Quý": { Lộc: "pojunMaj", Quyền: "jumenMaj", Khoa: "taiyinMaj", Kỵ: "tanlangMaj" },
};

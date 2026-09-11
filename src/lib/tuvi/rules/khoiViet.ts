import type { EarthlyBranchVi, HeavenlyStemVi } from "../types/VietnameseChart";

/**
 * Vietnamese (Ngoc Am / Tan Bien) Thien Khoi - Thien Viet placement table.
 *
 * Differs from iztro's default for Canh (iztro places Khoi/Viet at Suu/Mui for
 * Canh; the Vietnamese benchmark used here places them at Ngo/Dan) — see rule D
 * in docs/tuvi-engine-audit.md. This table is the single source of truth for
 * the "vietnam-tan-bien" and "ngoc-am" profiles; the "iztro-default" profile
 * uses iztro's own raw placement instead (see profiles/iztroDefault.ts).
 */
export const KHOI_VIET_VI: Record<HeavenlyStemVi, { khoi: EarthlyBranchVi; viet: EarthlyBranchVi }> = {
  "Giáp": { khoi: "Sửu", viet: "Mùi" },
  "Mậu": { khoi: "Sửu", viet: "Mùi" },
  "Ất": { khoi: "Tý", viet: "Thân" },
  "Kỷ": { khoi: "Tý", viet: "Thân" },
  "Canh": { khoi: "Ngọ", viet: "Dần" },
  "Tân": { khoi: "Ngọ", viet: "Dần" },
  "Bính": { khoi: "Hợi", viet: "Dậu" },
  "Đinh": { khoi: "Hợi", viet: "Dậu" },
  "Nhâm": { khoi: "Mão", viet: "Tỵ" },
  "Quý": { khoi: "Mão", viet: "Tỵ" },
};

/** iztro's own (unmodified) placement — used only by the "iztro-default" profile. */
export const KHOI_VIET_IZTRO_DEFAULT: Record<HeavenlyStemVi, { khoi: EarthlyBranchVi; viet: EarthlyBranchVi }> = {
  "Giáp": { khoi: "Sửu", viet: "Mùi" },
  "Mậu": { khoi: "Sửu", viet: "Mùi" },
  "Canh": { khoi: "Sửu", viet: "Mùi" },
  "Ất": { khoi: "Tý", viet: "Thân" },
  "Kỷ": { khoi: "Tý", viet: "Thân" },
  "Bính": { khoi: "Hợi", viet: "Dậu" },
  "Đinh": { khoi: "Hợi", viet: "Dậu" },
  "Tân": { khoi: "Ngọ", viet: "Dần" },
  "Nhâm": { khoi: "Mão", viet: "Tỵ" },
  "Quý": { khoi: "Mão", viet: "Tỵ" },
};

import type { ChartProfile } from "../engine/vietnameseAdapter";
import { KHOI_VIET_VI } from "../rules/khoiViet";

/** Tu Vi Dau So Tan Bien / Van Dang Thai Thu Lang school — see docs/tuvi-engine-audit.md. */
export const vietnamTanBienProfile: ChartProfile = {
  id: "vietnam-tan-bien",
  khoiViet: KHOI_VIET_VI,
  useVietnameseBrightness: true,
  useZhongzhouMenhChu: true,
};

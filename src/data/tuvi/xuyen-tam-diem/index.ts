import { STAR_NAMES_VI } from "@/lib/tuvi/locale/starNames.vi";
import { getXtdStarName } from "./stars";

export { getXtdStarName, XUYEN_TAM_DIEM_STAR_MAP, type XtdFlame, type XtdStarEntry } from "./stars";
export { getXtdPalaceName, XUYEN_TAM_DIEM_PALACE_MAP } from "./palaces";
export { getXtdTuHoaName, XUYEN_TAM_DIEM_TU_HOA_MAP } from "./fourTransformations";
export { getXtdGrowthCycleName, XUYEN_TAM_DIEM_GROWTH_CYCLE_MAP } from "./growthCycle";
export { getXtdTaiSuiName, XUYEN_TAM_DIEM_TAI_SUI_MAP } from "./taiSuiCycle";
export { getXtdBoshiName, XUYEN_TAM_DIEM_BOSHI_MAP } from "./boshiCycle";
export {
  getXtdCucName,
  XUYEN_TAM_DIEM_CUC_MAP,
  XUYEN_TAM_DIEM_BRIGHTNESS_LABEL,
  XTD_TUAN_LABEL,
  XTD_TRIET_LABEL,
  XTD_TUAN_TRIET_COMBINED,
  XTD_VO_CHINH_DIEU,
  XTD_MENH_TAG,
  XTD_THAN_TAG,
  XTD_ROW_LABELS,
  XTD_RELATION_LABELS,
  XTD_TIME_LABELS,
} from "./labels";

/**
 * chart.menhChu / chart.thanChu (presentation/ownerViewModel.ts's
 * destinyMaster/bodyMaster) and a palace's own .name used as Than cu are
 * plain Vietnamese strings at the DTO level — no star id survives that far
 * (see lib/tuvi/engine/vietnameseAdapter.ts, which only keeps
 * STAR_NAMES_VI[key].name`, not `key` itself, on chart.menhChu/thanChu).
 * Since canonical Vietnamese major-star names are unique, this recovers the
 * id from the name to reuse the same id-keyed stars.ts dictionary, rather
 * than a second, separate name-keyed table that could drift out of sync.
 */
const STAR_ID_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STAR_NAMES_VI).map(([id, entry]) => [entry.name, id]),
);

export function getXtdStarNameByVietnameseName(canonicalName: string): string {
  const id = STAR_ID_BY_NAME[canonicalName];
  return id ? getXtdStarName(id, canonicalName) : canonicalName;
}

/**
 * horoscope.yearly.starsByIndex' HoroscopeStar.name values (e.g. "Lưu Thiên
 * Khôi") aren't in STAR_NAMES_VI at all — see locale/astronomyNames.vi.ts's
 * YEARLY_FLOW_STAR_VI, a distinct "Lưu " + natal-name translation applied
 * only by engine/horoscopeAdapter.ts. Strips that prefix, translates the
 * natal star it names, re-attaches the prefix — never touches the
 * underlying HoroscopeStar.id (iztro's own zh-CN string, not a registry
 * key, see types/VietnameseChart.ts's own comment on it).
 */
export function getXtdLuuStarName(canonicalName: string): string {
  if (!canonicalName.startsWith("Lưu ")) return canonicalName;
  const natalName = canonicalName.slice("Lưu ".length);
  const translated = getXtdStarNameByVietnameseName(natalName);
  return translated === natalName ? canonicalName : `Lưu ${translated}`;
}

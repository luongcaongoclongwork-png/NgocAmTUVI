import type {
  FourTransformation,
  HoroscopeStar,
  PalaceNameVi,
  VietnamesePalace,
  VietnameseStar,
} from "@/lib/tuvi/types/VietnameseChart";
import { starColorVar } from "../starElementColor";
import { getPalaceDensity } from "../paletteDensity";
import {
  getXtdStarName,
  getXtdPalaceName,
  getXtdGrowthCycleName,
  getXtdTaiSuiName,
  getXtdLuuStarName,
  getXtdTuHoaName,
  getXtdBoshiName,
  XUYEN_TAM_DIEM_BRIGHTNESS_LABEL,
  XTD_VO_CHINH_DIEU,
  XTD_THAN_TAG,
  XTD_TIME_LABELS,
  XTD_TUAN_LABEL,
  XTD_TRIET_LABEL,
  XTD_TUAN_TRIET_COMBINED,
} from "@/data/tuvi/xuyen-tam-diem";
import "../ngocAmChart.css";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../PalaceCell.tsx — see that file's
 * own comments for the non-naming layout/logic, which is unchanged here
 * verbatim. The ONLY diffs from the original are the getXtd*() calls
 * wrapping star/palace/cycle text before it's rendered; every prop,
 * computation and CSS class name is identical, so this reads the exact
 * same VietnamesePalace/PalaceHoroscopeView the original does — no
 * recomputation, no engine access, display-only (see
 * data/tuvi/xuyen-tam-diem/README-equivalent comments in index.ts).
 */

const TRANSFORMATION_CLASS: Record<FourTransformation, string> = {
  Lộc: "text-gold",
  Quyền: "text-bronze",
  Khoa: "text-sage",
  Kỵ: "text-lacquer",
};

export interface PalaceHoroscopeView {
  daiVanPalaceName: PalaceNameVi;
  luuNienPalaceName: PalaceNameVi;
  luuStars: HoroscopeStar[];
  suiQian: string;
  mutagenByStarId: Partial<Record<string, FourTransformation>>;
}

function MinorStarLabel({ star, horoscope }: { star: VietnameseStar; horoscope?: PalaceHoroscopeView }) {
  const annualMutagen = horoscope?.mutagenByStarId[star.id];
  return (
    <span className="palace-minor-star" data-category={star.category} style={starColorVar(star)}>
      {getXtdStarName(star.id, star.name)}
      {star.brightness && <span className="palace-minor-star__state">({XUYEN_TAM_DIEM_BRIGHTNESS_LABEL[star.brightness]})</span>}
      {star.transformation && (
        <span className={`palace-minor-star__tag ${TRANSFORMATION_CLASS[star.transformation]}`}>{getXtdTuHoaName(star.transformation)}</span>
      )}
      {annualMutagen && <span className="palace-minor-star__tag palace-minor-star__tag--annual">L.{getXtdTuHoaName(annualMutagen)}</span>}
    </span>
  );
}

function MajorStarBlock({ star, horoscope }: { star: VietnameseStar; horoscope?: PalaceHoroscopeView }) {
  const annualMutagen = horoscope?.mutagenByStarId[star.id];
  const hasMeta = Boolean(star.brightness || star.transformation || annualMutagen);
  return (
    <div className="palace-major-star">
      <div className="palace-major-star__name-row">
        <span className="palace-major-star__name" data-category={star.category} style={starColorVar(star)}>
          {getXtdStarName(star.id, star.name)}
        </span>
      </div>
      {hasMeta && (
        <div className="palace-major-star__meta">
          {star.brightness && <span className="palace-major-star__state">{XUYEN_TAM_DIEM_BRIGHTNESS_LABEL[star.brightness]}</span>}
          {star.transformation && <span className="palace-major-star__mutagen">{getXtdTuHoaName(star.transformation)}</span>}
          {annualMutagen && <span className="palace-major-star__annual-mutagen">L.{getXtdTuHoaName(annualMutagen)}</span>}
        </div>
      )}
    </div>
  );
}

export default function XtdPalaceCell({
  palace,
  selected,
  emphasis,
  horoscope,
  tabIndex,
  cellRef,
  onSelect,
  onKeyDown,
}: {
  palace: VietnamesePalace;
  selected: boolean;
  emphasis?: "tam-hop" | "xung-chieu" | "giap-cung" | "nhi-hop";
  horoscope?: PalaceHoroscopeView;
  tabIndex: 0 | -1;
  cellRef?: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const minorStars = [...palace.supportStars, ...palace.maleficStars];
  const annualCount = horoscope ? horoscope.luuStars.length + (horoscope.suiQian ? 1 : 0) : 0;
  const natalCycleStars = [palace.suiQian].filter(Boolean);
  const hasZoneBadge = Boolean(palace.tuan || palace.triet);
  // The badge sits in the empty middle column of the horoscope footer row
  // (same line as "DT .. / NT .."), costing no extra height. Tuan + Triet in
  // the same cell ("dong cung") share ONE two-colour "Bich Lo" badge so it
  // still fits that column. Only with no horoscope row at all is there
  // nothing to share a line with — then it gets its own centered last line
  // (and that cell reserves one line of bottom padding).
  const badgeInFooter = hasZoneBadge && Boolean(horoscope);
  const badgeOwnLine = hasZoneBadge && !badgeInFooter;
  const zoneBadge = !hasZoneBadge ? null : palace.tuan && palace.triet ? (
    <span className="palace-zone-badge palace-zone-badge--both">
      <span className="palace-zone-badge__tuan">{XTD_TUAN_TRIET_COMBINED.tuan}</span> <span className="palace-zone-badge__triet">{XTD_TUAN_TRIET_COMBINED.triet}</span>
    </span>
  ) : palace.tuan ? (
    <span className="palace-zone-badge palace-zone-badge--tuan">{XTD_TUAN_LABEL}</span>
  ) : (
    <span className="palace-zone-badge palace-zone-badge--triet">{XTD_TRIET_LABEL}</span>
  );
  const density = getPalaceDensity({
    majorCount: palace.majorStars.length,
    // +1 only when the badge needs its own line (see badgeOwnLine above).
    minorCount: minorStars.length + (badgeOwnLine ? 1 : 0),
    adjectiveCount: palace.adjectiveStars.length + natalCycleStars.length,
    annualCount,
  });
  const hasLuuContent = Boolean(horoscope && (horoscope.luuStars.length > 0 || horoscope.suiQian));
  const xtdName = getXtdPalaceName(palace.name);

  return (
    <button
      ref={cellRef}
      type="button"
      onClick={onSelect}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      aria-pressed={selected}
      aria-label={`Khám ${xtdName}, ${palace.heavenlyStem} ${palace.branch}, khám số ${palace.index + 1}${selected ? ", đang chọn" : ""}`}
      aria-describedby={`xtd-palace-detail-${palace.index}`}
      data-selected={selected || undefined}
      data-emphasis={!selected ? emphasis : undefined}
      data-density={density}
      data-has-horoscope={horoscope ? "true" : undefined}
      data-zone-badge={badgeOwnLine ? "true" : undefined}
      className={`tuvi-palace${palace.isSoulPalace ? " tuvi-palace--soul" : ""}${palace.isBodyPalace ? " tuvi-palace--body" : ""}`}
    >
      <header className="palace-header">
        <span className="palace-branch">
          {palace.heavenlyStem} {palace.branch}
        </span>
        <span className="palace-name">
          {xtdName}
          {palace.isBodyPalace && ` · ${XTD_THAN_TAG}`}
        </span>
        <span className="palace-index">{palace.index + 1}</span>
      </header>

      <div id={`xtd-palace-detail-${palace.index}`} className="palace-main-stars">
        {palace.majorStars.length === 0 ? (
          <div className="palace-major-star">
            <span className="palace-major-star__name palace-major-star__name--empty">{XTD_VO_CHINH_DIEU}</span>
          </div>
        ) : (
          palace.majorStars.map((s) => <MajorStarBlock key={s.id} star={s} horoscope={horoscope} />)
        )}
      </div>

      {minorStars.length > 0 && (
        <div className="palace-minor-stars">
          {minorStars.map((s) => (
            <MinorStarLabel key={s.id} star={s} horoscope={horoscope} />
          ))}
        </div>
      )}

      {(palace.adjectiveStars.length > 0 || natalCycleStars.length > 0) && (
        <div className="palace-adjective-stars">
          {palace.adjectiveStars.map((s) => (
            <span key={s.id} className="palace-adjective-star" data-category={s.category}>
              {getXtdStarName(s.id, s.name)}
            </span>
          ))}
          {natalCycleStars.map((name) => (
            <span key={name} className="palace-adjective-star">
              {getXtdTaiSuiName(name)}
            </span>
          ))}
        </div>
      )}

      {hasLuuContent && horoscope && (
        <div className="palace-luu-section">
          <div className="palace-luu-label">Lưu</div>
          <div className="palace-luu-stars">
            {horoscope.luuStars.map((s) => (
              <span key={s.id} className="palace-luu-star">
                {getXtdLuuStarName(s.name)}
              </span>
            ))}
            {horoscope.suiQian && <span className="palace-luu-star">{getXtdTaiSuiName(horoscope.suiQian)}</span>}
          </div>
        </div>
      )}

      <div className="palace-footer-zone">
        <footer className="palace-footer">
          <span>{palace.daiVan ? `${palace.daiVan.startAge}–${palace.daiVan.endAge}` : ""}</span>
          <span>{getXtdGrowthCycleName(palace.changSinh)}</span>
          <span>{getXtdBoshiName(palace.boshi)}</span>
        </footer>

        {horoscope && (
          <footer className="palace-footer palace-footer--horoscope">
            <span>{XTD_TIME_LABELS.daiVanShort} {getXtdPalaceName(horoscope.daiVanPalaceName)}</span>
            <span className="palace-zone-badges">{badgeInFooter ? zoneBadge : null}</span>
            <span>{XTD_TIME_LABELS.luuNienShort} {getXtdPalaceName(horoscope.luuNienPalaceName)}</span>
          </footer>
        )}

        {badgeOwnLine && <div className="palace-zone-badges">{zoneBadge}</div>}
      </div>
    </button>
  );
}

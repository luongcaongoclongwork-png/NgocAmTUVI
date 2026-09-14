import type {
  FourTransformation,
  HoroscopeStar,
  PalaceNameVi,
  VietnamesePalace,
  VietnameseStar,
} from "@/lib/tuvi/types/VietnameseChart";
import { BRIGHTNESS_LABEL } from "@/lib/tuvi/types/VietnameseChart";
import { starColorVar } from "./starElementColor";
import { getPalaceDensity } from "./paletteDensity";
import "./ngocAmChart.css";

const TRANSFORMATION_CLASS: Record<FourTransformation, string> = {
  Lộc: "text-gold",
  Quyền: "text-bronze",
  Khoa: "text-sage",
  Kỵ: "text-lacquer",
};

/** This palace's slice of the Luu Nien (annual transit) overlay — see engine/horoscopeAdapter.ts. Undefined when no "nam xem" is active. */
export interface PalaceHoroscopeView {
  daiVanPalaceName: PalaceNameVi;
  luuNienPalaceName: PalaceNameVi;
  luuStars: HoroscopeStar[];
  suiQian: string;
  jiangQian: string;
  mutagenByStarId: Partial<Record<string, FourTransformation>>;
}

function MinorStarLabel({ star, horoscope }: { star: VietnameseStar; horoscope?: PalaceHoroscopeView }) {
  const annualMutagen = horoscope?.mutagenByStarId[star.id];
  return (
    <span className="palace-minor-star" data-category={star.category} style={starColorVar(star)}>
      {star.name}
      {star.brightness && <span className="palace-minor-star__state">({BRIGHTNESS_LABEL[star.brightness]})</span>}
      {star.transformation && (
        <span className={`palace-minor-star__tag ${TRANSFORMATION_CLASS[star.transformation]}`}>{star.transformation}</span>
      )}
      {annualMutagen && <span className="palace-minor-star__tag palace-minor-star__tag--annual">L.{annualMutagen}</span>}
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
          {star.name}
        </span>
      </div>
      {hasMeta && (
        <div className="palace-major-star__meta">
          {star.brightness && <span className="palace-major-star__state">{BRIGHTNESS_LABEL[star.brightness]}</span>}
          {star.transformation && <span className="palace-major-star__mutagen">{star.transformation}</span>}
          {annualMutagen && <span className="palace-major-star__annual-mutagen">L.{annualMutagen}</span>}
        </div>
      )}
    </div>
  );
}

export default function PalaceCell({
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
  /** "tam-hop" | "xung-chieu" | "giap-cung" | "nhi-hop" | undefined — set by TuViChart from AspectOverlay's active relation. */
  emphasis?: "tam-hop" | "xung-chieu" | "giap-cung" | "nhi-hop";
  /** This palace's Luu Nien overlay slice for the currently selected "nam xem", if any. */
  horoscope?: PalaceHoroscopeView;
  /** Roving tabindex (spec section on 12-palace keyboard navigation) — only one palace is ever `0`, set by TuViChart. */
  tabIndex: 0 | -1;
  cellRef?: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const minorStars = [...palace.supportStars, ...palace.maleficStars];
  const annualCount = horoscope ? horoscope.luuStars.length + (horoscope.suiQian ? 1 : 0) + (horoscope.jiangQian ? 1 : 0) : 0;
  // Natal Thai Tue / Tuong Tinh 12-star cycles (vong Thai Tue, vong Tuong
  // Tinh) — always exactly one member per palace, fixed by birth year
  // (unlike horoscope.suiQian/jiangQian above, which are the *annual*
  // members for whatever "nam xem" is selected). Already computed by
  // vietnameseAdapter.ts onto every VietnamesePalace; just never rendered
  // until now ("Bach Ho missing" feedback 2026-09-13).
  const natalCycleStars = [palace.suiQian, palace.jiangQian].filter(Boolean);
  const density = getPalaceDensity({
    majorCount: palace.majorStars.length,
    minorCount: minorStars.length,
    adjectiveCount: palace.adjectiveStars.length + natalCycleStars.length,
    annualCount,
  });
  const hasLuuContent = Boolean(horoscope && (horoscope.luuStars.length > 0 || horoscope.suiQian || horoscope.jiangQian));

  return (
    <button
      ref={cellRef}
      type="button"
      onClick={onSelect}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      aria-pressed={selected}
      aria-label={`Cung ${palace.name}, ${palace.heavenlyStem} ${palace.branch}, cung số ${palace.index + 1}${selected ? ", đang chọn" : ""}`}
      aria-describedby={`palace-detail-${palace.index}`}
      data-selected={selected || undefined}
      data-emphasis={!selected ? emphasis : undefined}
      data-density={density}
      data-has-horoscope={horoscope ? "true" : undefined}
      className={`tuvi-palace${palace.isSoulPalace ? " tuvi-palace--soul" : ""}${palace.isBodyPalace ? " tuvi-palace--body" : ""}`}
    >
      <header className="palace-header">
        <span className="palace-branch">
          {palace.heavenlyStem} {palace.branch}
        </span>
        <span className="palace-name">
          {palace.name}
          {palace.isBodyPalace && " · Thân"}
        </span>
        <span className="palace-index">{palace.index + 1}</span>
      </header>

      {/* Main stars: the ONLY centered section — see palace-main-stars. Never used to center the whole cell. */}
      <div id={`palace-detail-${palace.index}`} className="palace-main-stars">
        {palace.majorStars.length === 0 ? (
          <div className="palace-major-star">
            <span className="palace-major-star__name palace-major-star__name--empty">Vô Chính Diệu</span>
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
              {s.name}
            </span>
          ))}
          {natalCycleStars.map((name) => (
            <span key={name} className="palace-adjective-star">
              {name}
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
                {s.name}
              </span>
            ))}
            {horoscope.suiQian && <span className="palace-luu-star">{horoscope.suiQian}</span>}
            {horoscope.jiangQian && <span className="palace-luu-star">{horoscope.jiangQian}</span>}
          </div>
        </div>
      )}

      <div className="palace-footer-zone">
        <footer className="palace-footer">
          <span>{palace.daiVan ? `${palace.daiVan.startAge}–${palace.daiVan.endAge}` : ""}</span>
          <span>{palace.changSinh}</span>
          <span>{palace.boshi}</span>
        </footer>

        {horoscope && (
          <footer className="palace-footer palace-footer--horoscope">
            <span>ĐV {horoscope.daiVanPalaceName}</span>
            <span />
            <span>LN {horoscope.luuNienPalaceName}</span>
          </footer>
        )}
      </div>
    </button>
  );
}

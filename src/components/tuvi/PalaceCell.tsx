import type {
  FourTransformation,
  HoroscopeStar,
  PalaceNameVi,
  VietnamesePalace,
  VietnameseStar,
} from "@/lib/tuvi/types/VietnameseChart";
import { BRIGHTNESS_LABEL } from "@/lib/tuvi/types/VietnameseChart";
import { starColorVar } from "./starElementColor";
import { getPalaceVisualDensity } from "./paletteDensity";
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

function LuuMutagenTag({ starId, horoscope }: { starId: string; horoscope?: PalaceHoroscopeView }) {
  const transformation = horoscope?.mutagenByStarId[starId];
  if (!transformation) return null;
  return <span className={`main-star-tag ${TRANSFORMATION_CLASS[transformation]}`}>L.{transformation}</span>;
}

function MinorStarLabel({ star, horoscope }: { star: VietnameseStar; horoscope?: PalaceHoroscopeView }) {
  return (
    <span className="palace-minor-star" style={starColorVar(star)}>
      {star.name}
      {star.transformation && (
        <span className={`main-star-tag ${TRANSFORMATION_CLASS[star.transformation]}`}>{star.transformation}</span>
      )}
      <LuuMutagenTag starId={star.id} horoscope={horoscope} />
    </span>
  );
}

export default function PalaceCell({
  palace,
  selected,
  emphasis,
  horoscope,
  onSelect,
}: {
  palace: VietnamesePalace;
  selected: boolean;
  /** "tam-hop" | "xung-chieu" | "giap-cung" | "nhi-hop" | undefined — set by TuViChart from AspectOverlay's active relation. */
  emphasis?: "tam-hop" | "xung-chieu" | "giap-cung" | "nhi-hop";
  /** This palace's Luu Nien overlay slice for the currently selected "nam xem", if any. */
  horoscope?: PalaceHoroscopeView;
  onSelect: () => void;
}) {
  const minorStars = [...palace.supportStars, ...palace.maleficStars];
  const luuExtraCount = horoscope ? horoscope.luuStars.length + 2 : 0; // +2 for suiQian/jiangQian
  const density = getPalaceVisualDensity({
    majorCount: palace.majorStars.length,
    minorCount: minorStars.length,
    extraCount: palace.adjectiveStars.length + luuExtraCount,
  });

  return (
    <button
      type="button"
      onClick={onSelect}
      data-selected={selected || undefined}
      data-emphasis={!selected ? emphasis : undefined}
      data-density={density}
      data-has-horoscope={horoscope ? "true" : undefined}
      className={`tuvi-palace${palace.isSoulPalace ? " tuvi-palace--soul" : ""}`}
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

      <div className={`palace-main-stars${palace.majorStars.length === 0 ? " palace-main-stars--empty" : ""}`}>
        {palace.majorStars.length === 0 ? (
          <span>Vô Chính Diệu</span>
        ) : (
          palace.majorStars.map((s) => (
            <span key={s.id} className="main-star" style={starColorVar(s)}>
              {s.name}
              {s.brightness && <span className="main-star-tag main-star-tag--brightness">{BRIGHTNESS_LABEL[s.brightness]}</span>}
              {s.transformation && (
                <span className={`main-star-tag ${TRANSFORMATION_CLASS[s.transformation]}`}>{s.transformation}</span>
              )}
              <LuuMutagenTag starId={s.id} horoscope={horoscope} />
            </span>
          ))
        )}
      </div>

      {minorStars.length > 0 && (
        <div className="palace-minor-stars">
          {minorStars.map((s) => (
            <MinorStarLabel key={s.id} star={s} horoscope={horoscope} />
          ))}
        </div>
      )}

      {palace.adjectiveStars.length > 0 && (
        <div className="palace-adjective-stars">{palace.adjectiveStars.map((s) => s.name).join(" · ")}</div>
      )}

      {horoscope && (horoscope.luuStars.length > 0 || horoscope.suiQian || horoscope.jiangQian) && (
        <div className="palace-luu-stars">
          {[...horoscope.luuStars.map((s) => s.name), horoscope.suiQian, horoscope.jiangQian].filter(Boolean).join(" · ")}
        </div>
      )}

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
    </button>
  );
}

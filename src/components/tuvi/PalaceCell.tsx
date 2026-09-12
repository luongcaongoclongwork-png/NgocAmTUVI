import type { FourTransformation, VietnamesePalace, VietnameseStar } from "@/lib/tuvi/types/VietnameseChart";
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

function MinorStarLabel({ star }: { star: VietnameseStar }) {
  return (
    <span className="palace-minor-star" style={starColorVar(star)}>
      {star.name}
      {star.transformation && (
        <span className={`main-star-tag ${TRANSFORMATION_CLASS[star.transformation]}`}>{star.transformation}</span>
      )}
    </span>
  );
}

export default function PalaceCell({
  palace,
  selected,
  emphasis,
  onSelect,
}: {
  palace: VietnamesePalace;
  selected: boolean;
  /** "tam-hop" | "xung-chieu" | "giap-cung" | "nhi-hop" | undefined — set by TuViChart from AspectOverlay's active relation. */
  emphasis?: "tam-hop" | "xung-chieu" | "giap-cung" | "nhi-hop";
  onSelect: () => void;
}) {
  const minorStars = [...palace.supportStars, ...palace.maleficStars];
  const density = getPalaceVisualDensity({
    majorCount: palace.majorStars.length,
    minorCount: minorStars.length,
    extraCount: palace.adjectiveStars.length,
  });

  return (
    <button
      type="button"
      onClick={onSelect}
      data-selected={selected || undefined}
      data-emphasis={!selected ? emphasis : undefined}
      data-density={density}
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
            </span>
          ))
        )}
      </div>

      {minorStars.length > 0 && (
        <div className="palace-minor-stars">
          {minorStars.map((s) => (
            <MinorStarLabel key={s.id} star={s} />
          ))}
        </div>
      )}

      {palace.adjectiveStars.length > 0 && (
        <div className="palace-adjective-stars">{palace.adjectiveStars.map((s) => s.name).join(" · ")}</div>
      )}

      <footer className="palace-footer">
        <span>{palace.daiVan ? `${palace.daiVan.startAge}–${palace.daiVan.endAge}` : ""}</span>
        <span>{palace.changSinh}</span>
        <span>{palace.boshi}</span>
      </footer>
    </button>
  );
}

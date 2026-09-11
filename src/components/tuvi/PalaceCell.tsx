import type { FourTransformation, VietnamesePalace, VietnameseStar } from "@/lib/tuvi/types/VietnameseChart";
import { BRIGHTNESS_LABEL } from "@/lib/tuvi/types/VietnameseChart";

const TRANSFORMATION_CLASS: Record<FourTransformation, string> = {
  Lộc: "text-gold",
  Quyền: "text-bronze",
  Khoa: "text-sage",
  Kỵ: "text-lacquer",
};

function StarLabel({ star }: { star: VietnameseStar }) {
  return (
    <span className="inline-flex items-baseline gap-0.5 leading-tight">
      <span className={star.category === "major" ? "font-semibold text-walnut" : "text-walnut/80"}>
        {star.name}
      </span>
      {star.brightness && (
        <span className="text-[10px] text-walnut/50" title={BRIGHTNESS_LABEL[star.brightness]}>
          {BRIGHTNESS_LABEL[star.brightness]}
        </span>
      )}
      {star.transformation && (
        <span className={`text-[10px] font-medium ${TRANSFORMATION_CLASS[star.transformation]}`}>
          {star.transformation}
        </span>
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
  const emphasisRing: Record<NonNullable<typeof emphasis>, string> = {
    "tam-hop": "ring-2 ring-gold/70",
    "xung-chieu": "ring-2 ring-lacquer/70",
    "giap-cung": "ring-2 ring-sage/60",
    "nhi-hop": "ring-2 ring-bronze/60",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex h-full w-full flex-col gap-1 overflow-hidden border border-walnut/15 p-1.5 text-left transition-colors ${
        palace.isSoulPalace ? "bg-parchment/70" : "bg-ivory/60"
      } ${selected ? "z-10 ring-2 ring-walnut" : emphasis ? `z-10 ${emphasisRing[emphasis]}` : ""} hover:bg-parchment/50`}
    >
      <header className="flex items-start justify-between gap-1">
        <span className="tracking-label text-[9px] font-medium uppercase text-walnut/45">
          {palace.heavenlyStem} {palace.branch}
        </span>
        <span className="flex items-center gap-1">
          {palace.isBodyPalace && (
            <span className="tracking-label rounded-sm bg-lacquer/10 px-1 text-[9px] font-semibold text-lacquer">
              THÂN
            </span>
          )}
          <span className="font-heading text-[13px] leading-none text-ink">{palace.name}</span>
        </span>
      </header>

      <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-[11px]">
        {palace.majorStars.length === 0 ? (
          <span className="italic text-walnut/40">Vô Chính Diệu</span>
        ) : (
          palace.majorStars.map((s) => <StarLabel key={s.id} star={s} />)
        )}
      </div>

      {(palace.supportStars.length > 0 || palace.maleficStars.length > 0) && (
        <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-[10px] text-walnut/70">
          {[...palace.supportStars, ...palace.maleficStars].map((s) => (
            <StarLabel key={s.id} star={s} />
          ))}
        </div>
      )}

      {palace.adjectiveStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1 text-[9px] leading-tight text-walnut/40">
          {palace.adjectiveStars.map((s) => (
            <span key={s.id}>{s.name}</span>
          ))}
        </div>
      )}

      <footer className="mt-auto flex items-center justify-between text-[9px] text-walnut/40">
        <span>{palace.changSinh}</span>
        {palace.daiVan && (
          <span>
            {palace.daiVan.startAge}-{palace.daiVan.endAge}
          </span>
        )}
      </footer>
    </button>
  );
}

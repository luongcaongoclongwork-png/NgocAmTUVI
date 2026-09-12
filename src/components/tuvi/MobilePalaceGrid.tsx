import type { VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";

/**
 * "Tổng quan" mode: all 12 palaces at once, full viewport width, no
 * horizontal scroll. Deliberately a plain reading-order grid (not the
 * traditional branch-position ring the desktop chart uses) — relation lines
 * (tam hợp/xung chiếu/giáp cung) are a desktop-chart concern; overview's
 * only job here is "see all 12 at a glance, tap one for the full picture" in
 * PalaceDetailSheet, so simple index order is more legible at this size than
 * reproducing the ring shape with an empty center gap.
 */
export default function MobilePalaceGrid({
  palaces,
  onSelect,
}: {
  palaces: VietnamesePalace[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {palaces.map((p) => (
        <button
          key={p.index}
          type="button"
          onClick={() => onSelect(p.index)}
          className="flex min-h-[84px] flex-col items-start gap-1 border border-walnut/20 bg-ivory/70 p-2.5 text-left transition-colors hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          <span className="flex w-full items-center justify-between text-[12px] text-walnut/65">
            <span>{p.branch}</span>
            <span>{p.index + 1}</span>
          </span>
          <span className="font-heading text-[13px] leading-tight text-ink">
            {p.name}
            {p.isSoulPalace && <span className="ml-1 text-gold">•</span>}
            {p.isBodyPalace && <span className="ml-1 text-lacquer">•</span>}
          </span>
          <span className="text-[12px] leading-tight text-walnut/75">
            {p.majorStars.length > 0 ? p.majorStars.map((s) => s.name).join(" · ") : "Vô Chính Diệu"}
          </span>
        </button>
      ))}
    </div>
  );
}

import type { VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";
import type { PalaceHoroscopeView } from "./PalaceCell";
import PalaceDetailContent from "./PalaceDetailContent";

/** "Chi tiết 12 cung" mode: every palace as its own always-expanded card, stacked vertically — no horizontal scroll, no accordion state needed. */
export default function MobilePalaceList({
  palaces,
  horoscopeByIndex,
}: {
  palaces: VietnamesePalace[];
  horoscopeByIndex: (index: number) => PalaceHoroscopeView | undefined;
}) {
  return (
    <div className="space-y-3">
      {palaces.map((p) => (
        <div key={p.index} className="border border-walnut/20 bg-ivory/70 p-4">
          <PalaceDetailContent palace={p} horoscope={horoscopeByIndex(p.index)} />
        </div>
      ))}
    </div>
  );
}

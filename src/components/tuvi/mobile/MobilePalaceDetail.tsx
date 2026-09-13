import type { VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";
import type { PalaceHoroscopeView } from "../PalaceCell";
import PalaceDetailContent from "../PalaceDetailContent";

/**
 * The actual reading experience — full-width, not scaled. Reuses
 * PalaceDetailContent as-is (same star rendering the desktop bottom-sheet
 * flow used before this task) so nothing about how a star's brightness,
 * transformation, or Luu Nien tag is computed or labeled is duplicated
 * here; this file only adds the "CUNG ĐANG XEM" section identity.
 */
export function MobilePalaceDetail({
  palace,
  horoscope,
}: {
  palace: VietnamesePalace;
  horoscope?: PalaceHoroscopeView;
}) {
  return (
    <article className="mobile-palace-detail">
      <p className="mobile-detail-kicker">Cung đang xem</p>
      <PalaceDetailContent palace={palace} horoscope={horoscope} />
    </article>
  );
}

import type { VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";
import type { PalaceHoroscopeView } from "../XtdPalaceCell";
import XtdPalaceDetailContent from "../XtdPalaceDetailContent";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../mobile/MobilePalaceDetail.tsx
 * — only diff is using XtdPalaceDetailContent instead of PalaceDetailContent.
 */
export function XtdMobilePalaceDetail({
  palace,
  horoscope,
}: {
  palace: VietnamesePalace;
  horoscope?: PalaceHoroscopeView;
}) {
  return (
    <article className="mobile-palace-detail">
      <p className="mobile-detail-kicker">Khám đang xem</p>
      <XtdPalaceDetailContent palace={palace} horoscope={horoscope} />
    </article>
  );
}

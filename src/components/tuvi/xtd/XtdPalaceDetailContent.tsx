import type { FourTransformation, VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";
import { ELEMENT_COLOR } from "../starElementColor";
import type { PalaceHoroscopeView } from "./XtdPalaceCell";
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
  XTD_MENH_TAG,
  XTD_THAN_TAG,
  XTD_TUAN_LABEL,
  XTD_TRIET_LABEL,
  XTD_TIME_LABELS,
  XTD_TUAN_TRIET_COMBINED,
} from "@/data/tuvi/xuyen-tam-diem";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../PalaceDetailContent.tsx — same
 * mobile detail layout/type-scale; the only diffs are the getXtd*() calls
 * wrapping star/palace/cycle/label text (stars, palaces, Tu Hoa, brightness,
 * vong Truong Sinh/Thai Sui/Bac Si, Vo Tuong, Tuan/Triet, time layers).
 * Vong Tuong Tinh (`horoscope.jiangQian`) no longer exists at all as of
 * 2026-09-19 — see locale/astronomyNames.vi.ts.
 */

const TRANSFORMATION_CLASS: Record<FourTransformation, string> = {
  Lộc: "text-gold",
  Quyền: "text-bronze",
  Khoa: "text-sage",
  Kỵ: "text-lacquer",
};

export default function XtdPalaceDetailContent({
  palace,
  horoscope,
}: {
  palace: VietnamesePalace;
  horoscope?: PalaceHoroscopeView;
}) {
  const minorStars = [...palace.supportStars, ...palace.maleficStars];
  const xtdName = getXtdPalaceName(palace.name);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3 border-b border-walnut/15 pb-3">
        <div>
          <p className="text-[14px] leading-[1.45] text-walnut/70">
            {palace.heavenlyStem} {palace.branch} · khám số {palace.index + 1}
          </p>
          <h3 className="font-heading text-[20px] leading-[1.3] text-ink">
            {xtdName}
            {palace.isSoulPalace && (
              <span className="tracking-label ml-2 border border-gold px-1.5 py-0.5 align-middle text-[11px] font-semibold uppercase text-gold">
                {XTD_MENH_TAG}
              </span>
            )}
            {palace.isBodyPalace && (
              <span className="tracking-label ml-2 border border-lacquer px-1.5 py-0.5 align-middle text-[11px] font-semibold uppercase text-lacquer">
                {XTD_THAN_TAG}
              </span>
            )}
          </h3>
        </div>
      </header>

      <div className="space-y-2">
        {palace.majorStars.length === 0 ? (
          <p className="font-heading text-[17px] leading-[1.45] text-walnut/70">{XTD_VO_CHINH_DIEU}</p>
        ) : (
          palace.majorStars.map((s) => (
            <p
              key={s.id}
              className="font-heading text-[17px] leading-[1.45]"
              style={{ color: s.element ? ELEMENT_COLOR[s.element] : undefined }}
            >
              {getXtdStarName(s.id, s.name)}
              {s.brightness && (
                <span className="ml-2 text-[14px] font-medium text-walnut/70">{XUYEN_TAM_DIEM_BRIGHTNESS_LABEL[s.brightness]}</span>
              )}
              {s.transformation && (
                <span className={`ml-1.5 text-[14px] font-semibold ${TRANSFORMATION_CLASS[s.transformation]}`}>
                  {getXtdTuHoaName(s.transformation)}
                </span>
              )}
              {horoscope?.mutagenByStarId[s.id] && (
                <span className={`ml-1.5 text-[14px] font-semibold ${TRANSFORMATION_CLASS[horoscope.mutagenByStarId[s.id]!]}`}>
                  L.{getXtdTuHoaName(horoscope.mutagenByStarId[s.id]!)}
                </span>
              )}
            </p>
          ))
        )}
      </div>

      {minorStars.length > 0 && (
        <div>
          <p className="tracking-label mb-1.5 text-[12px] font-medium uppercase text-walnut/55">Phụ tinh</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[14px] leading-[1.45]">
            {minorStars.map((s) => (
              <span key={s.id} style={{ color: s.element ? ELEMENT_COLOR[s.element] : undefined }}>
                {getXtdStarName(s.id, s.name)}
                {s.brightness && (
                  <span className="ml-1 text-[12px] font-medium text-walnut/70">({XUYEN_TAM_DIEM_BRIGHTNESS_LABEL[s.brightness]})</span>
                )}
                {s.transformation && (
                  <span className={`ml-1 text-[12px] font-semibold ${TRANSFORMATION_CLASS[s.transformation]}`}>
                    {getXtdTuHoaName(s.transformation)}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {palace.adjectiveStars.length > 0 && (
        <p className="text-[14px] leading-[1.45] text-walnut/70">
          {palace.adjectiveStars.map((s) => getXtdStarName(s.id, s.name)).join(" · ")}
        </p>
      )}

      {horoscope && (horoscope.luuStars.length > 0 || horoscope.suiQian) && (
        <div>
          <p className="tracking-label mb-1.5 text-[12px] font-medium uppercase text-walnut/55">{XTD_TIME_LABELS.luuNien}</p>
          <p className="text-[14px] leading-[1.45] text-lacquer">
            {[
              ...horoscope.luuStars.map((s) => getXtdLuuStarName(s.name)),
              horoscope.suiQian ? getXtdTaiSuiName(horoscope.suiQian) : undefined,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-walnut/15 pt-3 text-[14px] leading-[1.45]">
        <div>
          <dt className="tracking-label text-[11px] font-medium uppercase text-walnut/55">{XTD_TIME_LABELS.daiVan}</dt>
          <dd className="text-ink/80">
            {palace.daiVan ? `${palace.daiVan.startAge}–${palace.daiVan.endAge} tuổi` : "—"} · {getXtdGrowthCycleName(palace.changSinh)}
          </dd>
        </div>
        <div>
          <dt className="tracking-label text-[11px] font-medium uppercase text-walnut/55">Bác sĩ</dt>
          <dd className="text-ink/80">{getXtdBoshiName(palace.boshi)}</dd>
        </div>
        {horoscope && (
          <>
            <div>
              <dt className="tracking-label text-[11px] font-medium uppercase text-walnut/55">{XTD_TIME_LABELS.daiVan} (chặng này)</dt>
              <dd className="text-ink/80">{getXtdPalaceName(horoscope.daiVanPalaceName)}</dd>
            </div>
            <div>
              <dt className="tracking-label text-[11px] font-medium uppercase text-walnut/55">{XTD_TIME_LABELS.luuNien} (năm xem)</dt>
              <dd className="text-ink/80">{getXtdPalaceName(horoscope.luuNienPalaceName)}</dd>
            </div>
          </>
        )}
      </dl>

      {(palace.tuan || palace.triet) && (
        <p className="text-[13px] text-walnut/60">
          {palace.tuan && <span className="mr-3 text-sage">{XTD_TUAN_LABEL}</span>}
          {palace.triet && <span className="text-lacquer">{XTD_TRIET_LABEL}</span>}
          {palace.tuan && palace.triet && (
            <span className="ml-3 text-walnut/50">
              ({XTD_TUAN_TRIET_COMBINED.tuan} {XTD_TUAN_TRIET_COMBINED.triet} = {XTD_TUAN_LABEL} + {XTD_TRIET_LABEL})
            </span>
          )}
        </p>
      )}
    </div>
  );
}

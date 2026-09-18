import type { FourTransformation, VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";
import { BRIGHTNESS_LABEL } from "@/lib/tuvi/types/VietnameseChart";
import { ELEMENT_COLOR } from "../starElementColor";
import type { PalaceHoroscopeView } from "./XtdPalaceCell";
import {
  getXtdStarName,
  getXtdPalaceName,
  getXtdGrowthCycleName,
  getXtdTaiSuiName,
  getXtdLuuStarName,
} from "@/data/tuvi/xuyen-tam-diem";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../PalaceDetailContent.tsx — same
 * mobile detail layout/type-scale; the only diffs are the getXtd*() calls
 * wrapping star/palace/cycle text. `palace.boshi` (vong Bac Si) and
 * `horoscope.jiangQian` (vong Tuong Tinh) are left untranslated on purpose
 * — no mapping for either was given in the Xuyen Tam Diem spec.
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
                Mệnh
              </span>
            )}
            {palace.isBodyPalace && (
              <span className="tracking-label ml-2 border border-lacquer px-1.5 py-0.5 align-middle text-[11px] font-semibold uppercase text-lacquer">
                Thân
              </span>
            )}
          </h3>
        </div>
      </header>

      <div className="space-y-2">
        {palace.majorStars.length === 0 ? (
          <p className="font-heading text-[17px] leading-[1.45] text-walnut/70">Vô Chính Diệu</p>
        ) : (
          palace.majorStars.map((s) => (
            <p
              key={s.id}
              className="font-heading text-[17px] leading-[1.45]"
              style={{ color: s.element ? ELEMENT_COLOR[s.element] : undefined }}
            >
              {getXtdStarName(s.id, s.name)}
              {s.brightness && (
                <span className="ml-2 text-[14px] font-medium text-walnut/70">{BRIGHTNESS_LABEL[s.brightness]}</span>
              )}
              {s.transformation && (
                <span className={`ml-1.5 text-[14px] font-semibold ${TRANSFORMATION_CLASS[s.transformation]}`}>
                  {s.transformation}
                </span>
              )}
              {horoscope?.mutagenByStarId[s.id] && (
                <span className={`ml-1.5 text-[14px] font-semibold ${TRANSFORMATION_CLASS[horoscope.mutagenByStarId[s.id]!]}`}>
                  L.{horoscope.mutagenByStarId[s.id]}
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
                  <span className="ml-1 text-[12px] font-medium text-walnut/70">({BRIGHTNESS_LABEL[s.brightness]})</span>
                )}
                {s.transformation && (
                  <span className={`ml-1 text-[12px] font-semibold ${TRANSFORMATION_CLASS[s.transformation]}`}>
                    {s.transformation}
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

      {horoscope && (horoscope.luuStars.length > 0 || horoscope.suiQian || horoscope.jiangQian) && (
        <div>
          <p className="tracking-label mb-1.5 text-[12px] font-medium uppercase text-walnut/55">Lưu niên</p>
          <p className="text-[14px] leading-[1.45] text-lacquer">
            {[
              ...horoscope.luuStars.map((s) => getXtdLuuStarName(s.name)),
              horoscope.suiQian ? getXtdTaiSuiName(horoscope.suiQian) : undefined,
              horoscope.jiangQian,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-walnut/15 pt-3 text-[14px] leading-[1.45]">
        <div>
          <dt className="tracking-label text-[11px] font-medium uppercase text-walnut/55">Đại vận</dt>
          <dd className="text-ink/80">
            {palace.daiVan ? `${palace.daiVan.startAge}–${palace.daiVan.endAge} tuổi` : "—"} · {getXtdGrowthCycleName(palace.changSinh)}
          </dd>
        </div>
        <div>
          <dt className="tracking-label text-[11px] font-medium uppercase text-walnut/55">Bác sĩ</dt>
          <dd className="text-ink/80">{palace.boshi}</dd>
        </div>
        {horoscope && (
          <>
            <div>
              <dt className="tracking-label text-[11px] font-medium uppercase text-walnut/55">ĐV (đại vận này)</dt>
              <dd className="text-ink/80">{getXtdPalaceName(horoscope.daiVanPalaceName)}</dd>
            </div>
            <div>
              <dt className="tracking-label text-[11px] font-medium uppercase text-walnut/55">LN (năm xem)</dt>
              <dd className="text-ink/80">{getXtdPalaceName(horoscope.luuNienPalaceName)}</dd>
            </div>
          </>
        )}
      </dl>

      {(palace.tuan || palace.triet) && (
        <p className="text-[13px] text-walnut/60">
          {palace.tuan && <span className="mr-3 text-sage">Tuần</span>}
          {palace.triet && <span className="text-lacquer">Triệt</span>}
        </p>
      )}
    </div>
  );
}

import { getOwnerChartViewModel } from "@/lib/tuvi/presentation/ownerViewModel";
import { getXtdStarNameByVietnameseName, getXtdPalaceName, getXtdCucName, XTD_ROW_LABELS } from "@/data/tuvi/xuyen-tam-diem";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../mobile/MobileCenterDetail.tsx
 * — same getOwnerChartViewModel() call, no recomputation. Only diff: Chủ
 * mệnh/Chủ thân/Lai nhân cung/Thân cư go through the Xtd naming layer.
 */

function Row({ label, value, secondary }: { label: string; value?: React.ReactNode; secondary?: React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-baseline justify-between gap-3 py-1 text-[14px] leading-[1.45]">
      <dt className="tracking-label shrink-0 text-[11px] font-medium uppercase text-walnut/55">{label}</dt>
      <dd className="text-right text-ink">
        {value}
        {secondary && <span className="ml-2 font-heading text-walnut/60">{secondary}</span>}
      </dd>
    </div>
  );
}

export function XtdMobileCenterDetail({
  chart,
  birthTime,
  horoscope,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope?: VietnameseHoroscopeDTO;
}) {
  const vm = getOwnerChartViewModel(chart, birthTime, horoscope);

  return (
    <article className="mobile-palace-detail">
      <p className="mobile-detail-kicker">Khám đang xem</p>

      <header className="border-b border-walnut/15 pb-3">
        <p className="text-[14px] leading-[1.45] text-walnut/70">Thông tin lá số</p>
        <h3 className="font-heading text-[20px] leading-[1.3] text-ink">{vm.name || "—"}</h3>
      </header>

      <dl className="space-y-4 pt-3">
        <section>
          <p className="tracking-label mb-1 text-[12px] font-medium uppercase text-walnut/55">Sinh thần</p>
          <Row label="Năm" value={vm.solarYear} secondary={vm.yearGanzhi} />
          <Row
            label="Tháng"
            value={vm.solarMonth !== undefined ? `${vm.solarMonth}${vm.lunarMonth !== undefined ? ` (${vm.lunarMonth}${vm.lunarIsLeap ? " nhuận" : ""})` : ""}` : undefined}
            secondary={vm.monthGanzhi}
          />
          <Row
            label="Ngày"
            value={vm.solarDay !== undefined ? `${vm.solarDay}${vm.lunarDay !== undefined ? ` (${vm.lunarDay})` : ""}` : undefined}
            secondary={vm.dayGanzhi}
          />
          <Row label="Giờ" value={vm.birthTime} secondary={vm.hourGanzhi} />
        </section>

        <section className="border-t border-walnut/15 pt-3">
          <p className="tracking-label mb-1 text-[12px] font-medium uppercase text-walnut/55">Mệnh cục</p>
          <Row label="Cục" value={getXtdCucName(vm.bureau)} />
        </section>

        <section className="border-t border-walnut/15 pt-3">
          <p className="tracking-label mb-1 text-[12px] font-medium uppercase text-walnut/55">Chủ tinh</p>
          <Row label={XTD_ROW_LABELS.menhChu} value={getXtdStarNameByVietnameseName(vm.destinyMaster)} />
          <Row label={XTD_ROW_LABELS.thanChu} value={getXtdStarNameByVietnameseName(vm.bodyMaster)} />
        </section>

        <section className="border-t border-walnut/15 pt-3">
          <p className="tracking-label mb-1 text-[12px] font-medium uppercase text-walnut/55">Hệ thống</p>
          <Row label="Lai nhân cung" value={vm.originPalace ? getXtdPalaceName(vm.originPalace) : vm.originPalace} />
          <Row label={XTD_ROW_LABELS.cungMenh} value={vm.destinyPalace} />
          <Row label={XTD_ROW_LABELS.cungThan} value={vm.bodyPalace} />
          <Row label="Thân cư" value={vm.bodyResidence ? getXtdPalaceName(vm.bodyResidence) : vm.bodyResidence} />
        </section>

        {vm.viewingYear !== undefined && (
          <section className="border-t border-walnut/15 pt-3">
            <p className="tracking-label mb-1 text-[12px] font-medium uppercase text-walnut/55">Năm xem</p>
            <Row label="Can Chi" value={`${vm.viewingYearGanzhi} (${vm.viewingYear})`} secondary={`${vm.viewingAge} tuổi`} />
          </section>
        )}
      </dl>
    </article>
  );
}

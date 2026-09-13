import { getOwnerChartViewModel } from "@/lib/tuvi/presentation/ownerViewModel";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

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

/**
 * Reading-mode equivalent of CenterPalace, for when the user taps Trung
 * Cung in the mobile overview. Same getOwnerChartViewModel the desktop
 * Trung Cung panel already calls — no new calculation, just a roomier,
 * non-scaled layout matching the rest of the mobile detail panel.
 */
export function MobileCenterDetail({
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
      <p className="mobile-detail-kicker">Cung đang xem</p>

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
          <Row label="Cục" value={vm.bureau} />
        </section>

        <section className="border-t border-walnut/15 pt-3">
          <p className="tracking-label mb-1 text-[12px] font-medium uppercase text-walnut/55">Chủ tinh</p>
          <Row label="Chủ mệnh" value={vm.destinyMaster} />
          <Row label="Chủ thân" value={vm.bodyMaster} />
        </section>

        <section className="border-t border-walnut/15 pt-3">
          <p className="tracking-label mb-1 text-[12px] font-medium uppercase text-walnut/55">Hệ thống</p>
          <Row label="Lai nhân cung" value={vm.originPalace} />
          <Row label="Cung Mệnh" value={vm.destinyPalace} />
          <Row label="Cung Thân" value={vm.bodyPalace} />
          <Row label="Thân cư" value={vm.bodyResidence} />
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

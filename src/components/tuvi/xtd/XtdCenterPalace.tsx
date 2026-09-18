import Image from "next/image";
import type { ReactNode } from "react";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";
import { getOwnerChartViewModel } from "@/lib/tuvi/presentation/ownerViewModel";
import { getXtdStarNameByVietnameseName, getXtdPalaceName } from "@/data/tuvi/xuyen-tam-diem";
import { InfoRow } from "../InfoRow";
import "../ngocAmChart.css";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../CenterPalace.tsx — same layout,
 * same getOwnerChartViewModel() call, no recomputation. Only diff: the 4
 * fields that carry a star/palace name (Chủ mệnh, Chủ thân, Lai nhân cung,
 * Thân cư) are passed through the Xtd naming layer before render. The
 * chart-center-subtitle brand text below stays "XUYÊN TAM DIỆM" on purpose
 * (per 2026-09-19 decision: only the picker option label in the form
 * changes, not the 6 places this brand name already appears sitewide).
 */
export default function XtdCenterPalace({
  chart,
  birthTime,
  horoscope,
  printSeal,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope?: VietnameseHoroscopeDTO;
  printSeal?: ReactNode;
}) {
  const vm = getOwnerChartViewModel(chart, birthTime, horoscope);

  return (
    <div className="center-palace">
      <div className="center-scroll-bg" aria-hidden="true" />
      <Image
        src="/images/tuvi/trung-cung-print.jpg"
        alt=""
        fill
        unoptimized
        aria-hidden="true"
        className="center-scroll-bg-print"
      />
      <div className="center-veil" aria-hidden="true" />

      <div className="center-watermark" aria-hidden="true">
        <Image src="/images/logo-mark.png" alt="" width={200} height={200} />
      </div>

      <header className="chart-center-header">
        <div className="chart-center-brand">NGỌC ÂM</div>
        <h2 className="chart-center-title">LÁ SỐ TỬ VI</h2>
        <p className="chart-center-subtitle">XUYÊN TAM DIỆM</p>
      </header>

      <div className="center-divider" />

      <div className="center-info-group">
        <InfoRow label="Họ và tên" value={vm.name || "—"} />
        <InfoRow label="Năm" value={vm.solarYear} secondary={vm.yearGanzhi} />
        <InfoRow
          label="Tháng"
          value={vm.solarMonth !== undefined ? `${vm.solarMonth}${vm.lunarMonth !== undefined ? ` (${vm.lunarMonth}${vm.lunarIsLeap ? " nhuận" : ""})` : ""}` : undefined}
          secondary={vm.monthGanzhi}
        />
        <InfoRow
          label="Ngày"
          value={vm.solarDay !== undefined ? `${vm.solarDay}${vm.lunarDay !== undefined ? ` (${vm.lunarDay})` : ""}` : undefined}
          secondary={vm.dayGanzhi}
        />
        <InfoRow label="Giờ" value={vm.birthTime} secondary={vm.hourGanzhi} />
      </div>

      <div className="center-divider" />

      <div className="center-info-group">
        <InfoRow label="Cục" value={vm.bureau} emphasized />
      </div>

      <div className="center-divider" />

      <div className="center-info-group">
        <InfoRow label="Chủ mệnh" value={getXtdStarNameByVietnameseName(vm.destinyMaster)} emphasized />
        <InfoRow label="Chủ thân" value={getXtdStarNameByVietnameseName(vm.bodyMaster)} emphasized />
      </div>

      <div className="center-divider" />

      <div className="center-info-group">
        <InfoRow label="Lai nhân cung" value={vm.originPalace ? getXtdPalaceName(vm.originPalace) : vm.originPalace} emphasized />
        <InfoRow label="Cung Mệnh" value={vm.destinyPalace} />
        <InfoRow label="Cung Thân" value={vm.bodyPalace} />
        <InfoRow label="Thân cư" value={vm.bodyResidence ? getXtdPalaceName(vm.bodyResidence) : vm.bodyResidence} />
      </div>

      {vm.viewingYear !== undefined && (
        <>
          <div className="center-divider" />
          <div className="center-info-group center-info-group--viewing-year">
            <InfoRow label="Năm xem" value={`${vm.viewingYearGanzhi} (${vm.viewingYear})`} secondary={`${vm.viewingAge} tuổi`} emphasized />
          </div>
        </>
      )}

      {printSeal}

      <Image
        src="/images/print/ngoc-am-seal-v3.png"
        alt=""
        width={200}
        height={300}
        aria-hidden="true"
        className="center-live-seal"
      />

      <p className="center-tagline">
        BẬC THẦY TƯ VẤN
        <br />
        NGUYỄN MINH TRANG
      </p>
    </div>
  );
}

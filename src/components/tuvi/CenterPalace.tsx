import Image from "next/image";
import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";
import { getOwnerChartViewModel } from "@/lib/tuvi/presentation/ownerViewModel";
import { InfoRow } from "./InfoRow";
import "./ngocAmChart.css";

export default function CenterPalace({ chart, birthTime }: { chart: VietnameseChartDTO; birthTime?: string }) {
  const vm = getOwnerChartViewModel(chart, birthTime);

  return (
    <div className="center-palace">
      <div className="center-watermark" aria-hidden="true">
        <Image src="/images/logo-mark.png" alt="" width={200} height={200} />
      </div>

      <div className="center-seal" aria-hidden="true">
        <Image src="/images/ngoc-am-seal.png" alt="" width={44} height={30} className="h-full w-full object-contain" />
      </div>

      <header className="chart-center-header">
        <div className="chart-center-brand">NGỌC ÂM</div>
        <h2 className="chart-center-title">LÁ SỐ TỬ VI</h2>
        {vm.name && <div className="chart-owner-name">{vm.name}</div>}
      </header>

      <div className="center-divider" />

      <div className="center-info-group">
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
        <InfoRow label="Chủ mệnh" value={vm.destinyMaster} emphasized />
        <InfoRow label="Chủ thân" value={vm.bodyMaster} emphasized />
      </div>

      <div className="center-divider" />

      <div className="center-info-group">
        <InfoRow label="Lai nhân cung" value={vm.originPalace} emphasized />
        <InfoRow label="Cung Mệnh" value={vm.destinyPalace} />
        <InfoRow label="Cung Thân" value={vm.bodyPalace} />
        <InfoRow label="Thân cư" value={vm.bodyResidence} />
      </div>

      <p className="center-tagline">&ldquo;Mệnh do trời định, vận do tâm sinh.&rdquo;</p>
    </div>
  );
}

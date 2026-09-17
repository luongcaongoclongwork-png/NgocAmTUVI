import Image from "next/image";
import type { ReactNode } from "react";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";
import { getOwnerChartViewModel } from "@/lib/tuvi/presentation/ownerViewModel";
import { InfoRow } from "./InfoRow";
import "./ngocAmChart.css";

export default function CenterPalace({
  chart,
  birthTime,
  horoscope,
  printSeal,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope?: VietnameseHoroscopeDTO;
  /** Print-only red seal overlay (see print/PrintCenterSeal.tsx). Rendered
   * as a child of .center-palace itself so it always tracks Trung Cung's
   * real box instead of a fixed mm offset guessed from the outer chart —
   * undefined on the live desktop/mobile chart, so this component's
   * default rendering is completely unchanged there. */
  printSeal?: ReactNode;
}) {
  const vm = getOwnerChartViewModel(chart, birthTime, horoscope);

  return (
    <div className="center-palace">
      {/* Cuộn tranh núi/sen — nền trang trí của Trung Cung. Một lớp CSS
          background (desktop/mobile, ảnh đổi theo breakpoint qua
          tuviMobile.css) + một thẻ <Image> thật riêng cho bản in (ẩn mặc
          định, chỉ hiện trong .print-chart — dùng ảnh thật thay vì
          background-image để không phụ thuộc tuỳ chọn "in hình nền" của
          trình duyệt, xem print.css). Cả hai đều position:absolute, nằm
          dưới mọi nội dung thật (xem `.center-palace > .center-scroll-bg*`
          trong ngocAmChart.css để biết cách chúng thắng rule `.center-palace
          > *` mặc định set position:relative cho mọi con trực tiếp). */}
      <div className="center-scroll-bg" aria-hidden="true" />
      <Image
        src="/images/tuvi/trung-cung-print.jpg"
        alt=""
        fill
        unoptimized
        aria-hidden="true"
        className="center-scroll-bg-print"
      />
      {/* Thin warm veil over the whole scroll art (desktop/mobile only, see
          ngocAmChart.css's ".center-veil" rule) — lowers the background
          artwork's contrast a bit everywhere so every info row reads
          cleanly against it without covering the art itself. */}
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

      {vm.viewingYear !== undefined && (
        <>
          <div className="center-divider" />
          <div className="center-info-group center-info-group--viewing-year">
            <InfoRow label="Năm xem" value={`${vm.viewingYearGanzhi} (${vm.viewingYear})`} secondary={`${vm.viewingAge} tuổi`} emphasized />
          </div>
        </>
      )}

      {printSeal}

      {/* Live (desktop/mobile) red seal — printSeal above covers the print
          render only. Hidden under .print-chart via CSS so it never doubles
          up with PrintCenterSeal there (see ngocAmChart.css's
          ".center-live-seal" rule for positioning, sized to sit just above
          the "N tuổi" secondary value without touching real text). Named
          "-live-" (not the shorter "center-seal") because tuviMobile.css
          already had an orphaned ".mobile-tuvi-canvas .center-seal" rule
          (no matching element anywhere in the codebase, confirmed via
          grep) — reusing that name silently pulled in its top:11px/
          height:24px, fighting this element's own bottom/height. */}
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

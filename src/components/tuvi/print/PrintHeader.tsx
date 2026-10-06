import Image from "next/image";

/**
 * Logo kit v1.2 (10/2026), colour version (silver moon, Than Muc wordmark): the
 * owner chose the light logo for the chart sheet (2026-10-05) over the kit's
 * graphite one-colour print version. PNG rather than SVG so html2canvas
 * (PNG/PDF export) draws it reliably.
 *
 * `variant="xtd"`: no title/subtitle, just the kit's stacked lockup (symbol,
 * Ngoc Am, TU VI · PHONG THUY) centered. Default: horizontal lockup on the left
 * and the chart title on the right.
 */
export default function PrintHeader({ variant = "default" }: { variant?: "default" | "xtd" }) {
  if (variant === "xtd") {
    return (
      <header className="print-header print-header--xtd">
        <Image
          src="/images/logo/ngoc-am-stacked-color-print.png"
          alt="Ngọc Âm — Tử Vi · Phong Thủy"
          width={1200}
          height={931}
          className="print-header-logo print-header-logo--stacked"
        />
      </header>
    );
  }
  return (
    <header className="print-header">
      <div className="print-brand-block">
        <Image
          src="/images/logo/ngoc-am-horizontal-color-print.png"
          alt="Ngọc Âm"
          width={1200}
          height={379}
          className="print-header-logo print-header-logo--horizontal"
        />
      </div>
      <div className="print-title-wrap">
        <h1 className="print-title">XUYÊN TAM DIỆM</h1>
        <p className="print-subtitle">LÁ SỐ TỬ VI</p>
      </div>
    </header>
  );
}

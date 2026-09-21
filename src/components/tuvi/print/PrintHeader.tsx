import Image from "next/image";

/**
 * `variant="xtd"` (Xuyen Tam Diem print, 2026-09-21): no title/subtitle at all —
 * just the brand stack centered: logo on top, then NGỌC ÂM, then
 * TỬ VI · PHONG THUỶ.
 */
export default function PrintHeader({ variant = "default" }: { variant?: "default" | "xtd" }) {
  if (variant === "xtd") {
    return (
      <header className="print-header print-header--xtd">
        <div className="print-brand-block print-brand-block--stack">
          <Image
            src="/images/print/logo-mark-print.png"
            alt=""
            width={64}
            height={64}
            className="print-header-logo"
          />
          <div className="print-brand-text">
            <span className="print-brand">NGỌC ÂM</span>
            <span className="print-brand-sub">TỬ VI · PHONG THUỶ</span>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="print-header">
      <div className="print-brand-block">
        <Image
          src="/images/print/logo-mark-print.png"
          alt=""
          width={64}
          height={64}
          className="print-header-logo"
        />
        <div className="print-brand-text">
          <span className="print-brand">NGỌC ÂM</span>
          <span className="print-brand-sub">TỬ VI · PHONG THUỶ</span>
        </div>
      </div>
      <div className="print-title-wrap">
        <h1 className="print-title">XUYÊN TAM DIỆM</h1>
        <p className="print-subtitle">LÁ SỐ TỬ VI</p>
      </div>
    </header>
  );
}

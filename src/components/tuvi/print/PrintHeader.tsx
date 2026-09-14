import Image from "next/image";

export default function PrintHeader() {
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

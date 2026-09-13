import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Bottom strip: legend box (PrintLegend) sits to the left of this in
 * A4TuViPrintRenderer; this covers the center brand/tagline block and the
 * right "Truyen Nhan Khai Van" box. No QR / no publish metadata (rule 34 —
 * never hardcode a domain or fabricate a profile id the project doesn't
 * track) and chart.name is the only chart field used, read-only.
 */
export default function PrintFooter({ chart }: { chart: VietnameseChartDTO }) {
  return (
    <footer className="print-footer">
      <div className="print-footer-brand">
        <p className="print-footer-tagline">Biết mệnh để sống thuận · Hiểu vận để an nhiên</p>
        <p className="print-footer-chart-name">{chart.name ? `${chart.name} — ` : ""}Ngọc Âm Tử Vi Phong Thuỷ</p>
      </div>

      <div className="print-consultant-box">
        <p className="print-legend-title">Truyền nhân khai vấn</p>
        <p className="print-consultant-name">Cô Nguyễn Minh Trang</p>
        <span className="print-consultant-rule" aria-hidden="true" />
        <p className="print-consultant-tagline">Kế thừa tri thức cổ — Ứng dụng vào đời sống hiện đại</p>
      </div>
    </footer>
  );
}

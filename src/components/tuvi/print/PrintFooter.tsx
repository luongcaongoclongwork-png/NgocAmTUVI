/**
 * Bottom strip of the print page: a single centered "Bậc Thầy Khai Vấn"
 * credential box (the tagline/chart-name block that used to sit to its
 * left, and the legend box before that — see docs/tuvi-engine-audit.md —
 * were both removed). No chart data is shown here any more, so this takes
 * no props.
 */
export default function PrintFooter() {
  return (
    <footer className="print-footer">
      <div className="print-consultant-box">
        <p className="print-legend-title">Bậc Thầy Khai Vấn</p>
        <p className="print-consultant-name">Cô Nguyễn Minh Trang</p>
        <span className="print-consultant-rule" aria-hidden="true" />
        <p className="print-consultant-tagline">Kế thừa tri thức cổ — Ứng dụng vào đời sống hiện đại</p>
      </div>
    </footer>
  );
}

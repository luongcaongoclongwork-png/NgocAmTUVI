/**
 * Bottom strip of the print page: a single centered "Bậc Thầy Khai Vấn"
 * credential box (the tagline/chart-name block that used to sit to its
 * left, and the legend box before that — see docs/tuvi-engine-audit.md —
 * were both removed). No chart data is shown here any more, so this takes
 * only a display variant.
 *
 * `variant="xtd"` (Xuyen Tam Diem print, 2026-09-21): label reads "XUYÊN GIẢ",
 * and no tagline line (so no divider rule above it); the card frame is the
 * same as the default one.
 */
export default function PrintFooter({ variant = "default" }: { variant?: "default" | "xtd" }) {
  const xtd = variant === "xtd";
  return (
    <footer className="print-footer">
      <div className={xtd ? "print-consultant-box print-consultant-box--xtd" : "print-consultant-box"}>
        <p className="print-legend-title">{xtd ? "XUYÊN GIẢ" : "Bậc Thầy Khai Vấn"}</p>
        <p className="print-consultant-name">{xtd ? "Nguyễn Minh Trang" : "Cô Nguyễn Minh Trang"}</p>
        {!xtd && <span className="print-consultant-rule" aria-hidden="true" />}
        {!xtd && <p className="print-consultant-tagline">Kế thừa tri thức cổ — Ứng dụng vào đời sống hiện đại</p>}
      </div>
    </footer>
  );
}

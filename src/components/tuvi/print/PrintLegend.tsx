/**
 * Static legend — dot colors mirror the SAME category colors print.css
 * applies to the stars themselves (--print-major-color etc.) and the SAME
 * Tu Hoa colors the live chart already uses (--gold/--bronze/--sage/
 * --lacquer, via TRANSFORMATION_CLASS in PalaceCell.tsx) — not new colors
 * invented for this legend.
 */
const CATEGORY_ROWS: { label: string; swatchClass: string }[] = [
  { label: "Chính tinh", swatchClass: "print-legend-dot--major" },
  { label: "Phụ tinh", swatchClass: "print-legend-dot--auxiliary" },
  { label: "Cát tinh", swatchClass: "print-legend-dot--support" },
  { label: "Hung tinh", swatchClass: "print-legend-dot--malefic" },
];

const MUTAGEN_ROWS: { label: string; textClass: string }[] = [
  { label: "Hóa Lộc", textClass: "print-legend-mutagen--loc" },
  { label: "Hóa Quyền", textClass: "print-legend-mutagen--quyen" },
  { label: "Hóa Khoa", textClass: "print-legend-mutagen--khoa" },
  { label: "Hóa Kỵ", textClass: "print-legend-mutagen--ky" },
];

export default function PrintLegend() {
  return (
    <div className="print-legend-box">
      <p className="print-legend-title">Chú giải ký hiệu</p>
      <div className="print-legend-rows">
        {CATEGORY_ROWS.map((row) => (
          <span key={row.label} className="print-legend-row">
            <span className={`print-legend-dot ${row.swatchClass}`} aria-hidden="true" />
            {row.label}
          </span>
        ))}
        {MUTAGEN_ROWS.map((row) => (
          <span key={row.label} className={`print-legend-row ${row.textClass}`}>
            {row.label}
          </span>
        ))}
      </div>
      <p className="print-legend-brightness">(M) Miếu · (V) Vượng · (Đ) Đắc · (B) Bình · (H) Hãm</p>
    </div>
  );
}

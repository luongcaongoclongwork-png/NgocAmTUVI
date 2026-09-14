import Image from "next/image";

/**
 * Print-only red seal, layered over the Trung Cung's bottom-right corner.
 * Positioned by fixed mm offset from .print-chart (see print.css) rather
 * than by editing CenterPalace.tsx, which is shared with the live web
 * chart.
 *
 * A vertical "Ngọc Âm" calligraphy-style signature was tried alongside it
 * (matching the reference mockup) but measured ~43mm tall at a legible
 * size — the Trung Cung's info rows already fill the panel with no slack
 * (see print.css's Trung Cung section), so it overlapped Chu menh/Chu
 * than/Cung Menh/Than cu/Nam xem and the tagline. Fitting both cleanly
 * needs a real layout change (a dedicated signature column, narrowing the
 * info rows) rather than an overlay — flagged for that follow-up rather
 * than shipped overlapping.
 */
export default function PrintCenterSeal() {
  return (
    <div className="print-center-seal" aria-hidden="true">
      <Image
        src="/images/print/ngoc-am-seal.png"
        alt=""
        width={200}
        height={200}
        className="print-center-seal__stamp"
      />
    </div>
  );
}

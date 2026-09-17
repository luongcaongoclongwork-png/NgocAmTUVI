import Image from "next/image";

/**
 * Print-only red seal, layered inside Trung Cung itself — passed into
 * CenterPalace via TuViChartGrid's `centerPrintSeal` prop (see
 * PrintChart.tsx) rather than positioned as a sibling of the whole chart.
 * This keeps it correctly anchored to Trung Cung's own box even if the
 * chart's overall size/columns change later; CenterPalace.tsx (shared
 * with the live web chart) stays untouched since the prop defaults to
 * nothing there. Sizing/position: see print.css's `.center-palace
 * .print-center-seal` rule.
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
      {/* Filename carries a version suffix on purpose: the original
          filename (ngoc-am-seal.png) got stuck in browsers' own HTTP
          cache after the artwork underneath it changed — confirmed live
          (2026-09-18): re-fetching that exact URL kept decoding to the
          old square-ish silver mark's dimensions even with cache:no-store
          absent, while a cache-busted query string on the same URL
          fetched the right new bytes. A same-URL content swap can't
          reliably invalidate every viewer's cache; a new filename can. If
          this artwork changes again, bump the suffix again (-v4, ...)
          rather than overwriting -v3 in place.

          -v3 also has its white background removed (alpha-keyed off
          "distance from white" per channel, boosted so fully-saturated
          red hits alpha 255) — -v2 was still opaque, showing as a visible
          white square over Trung Cung's cream background. */}
      <Image
        src="/images/print/ngoc-am-seal-v3.png"
        alt=""
        width={200}
        height={300}
        className="print-center-seal__stamp"
      />
    </div>
  );
}

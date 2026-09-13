"use client";

/**
 * Extracted verbatim from BirthForm.tsx (same markup/classes, unchanged)
 * so it can be reused on both /lap-la-so (pre-submit year pick) and /la-so
 * (live re-render of the already-generated chart's Luu Nien overlay) —
 * see chartInputStorage.ts for how the two routes hand this value off.
 */
export default function TargetYearStepper({
  targetYear,
  onTargetYearChange,
  className = "flex items-center justify-center gap-3 text-[11px] tracking-[0.08em] text-walnut/70 uppercase",
}: {
  targetYear: number;
  onTargetYearChange: (year: number) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <span>Năm xem</span>
      <button
        type="button"
        onClick={() => onTargetYearChange(targetYear - 1)}
        className="flex h-11 w-11 items-center justify-center border border-walnut/30 text-walnut hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        aria-label="Lùi một năm"
      >
        −
      </button>
      <span className="min-w-[3.5em] text-center font-medium normal-case text-ink">{targetYear}</span>
      <button
        type="button"
        onClick={() => onTargetYearChange(targetYear + 1)}
        className="flex h-11 w-11 items-center justify-center border border-walnut/30 text-walnut hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        aria-label="Tiến một năm"
      >
        +
      </button>
    </div>
  );
}

export type CalendarType = "solar" | "lunar";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M2 6.2l2.6 2.6L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarSwitch({
  value,
  onChange,
}: {
  value: CalendarType;
  onChange: (value: CalendarType) => void;
}) {
  const options: { v: CalendarType; label: string }[] = [
    { v: "solar", label: "Dương lịch" },
    { v: "lunar", label: "Âm lịch" },
  ];

  return (
    <div className="grid h-11 grid-cols-2 gap-2">
      {options.map((opt) => {
        const active = value === opt.v;
        return (
          <button
            key={opt.v}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.v)}
            className={`flex items-center justify-center gap-1.5 border text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
              active ? "border-walnut bg-walnut text-ivory" : "border-walnut/25 bg-parchment/40 text-walnut/70 hover:bg-parchment"
            }`}
          >
            {active && <CheckIcon />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

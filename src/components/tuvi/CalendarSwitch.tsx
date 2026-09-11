export type CalendarType = "solar" | "lunar";

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
    <div className="grid h-11 grid-cols-2 border border-walnut/25 bg-parchment/40">
      {options.map((opt) => {
        const active = value === opt.v;
        return (
          <button
            key={opt.v}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.v)}
            className={`text-[13px] transition-colors ${
              active ? "bg-walnut text-ivory" : "text-walnut/70 hover:bg-parchment"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

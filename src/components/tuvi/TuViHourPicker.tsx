import { TU_VI_HOURS } from "@/lib/tuvi/calendar/tuViHours";
import { timeIndexFromHHmm } from "@/lib/tuvi/engine/iztroAdapter";

export function TuViHourPicker({ time, onChange }: { time: string; onChange: (value: string) => void }) {
  const activeIndex = timeIndexFromHHmm(time);
  const activeHour = TU_VI_HOURS.find((h) => timeIndexFromHHmm(h.value) === activeIndex);

  return (
    <div>
      <p className="mb-2 text-[13px] text-walnut/70">Hoặc chọn nhanh theo 12 giờ Tử Vi</p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {TU_VI_HOURS.map((h) => {
          const active = timeIndexFromHHmm(h.value) === activeIndex;
          return (
            <button
              key={h.key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(h.value)}
              className={`min-h-[60px] border px-2 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
                active
                  ? "border-walnut bg-walnut text-ivory"
                  : "border-walnut/20 bg-ivory text-walnut/80 hover:border-gold/60 hover:bg-parchment/40"
              }`}
            >
              <div className="font-heading text-[14px] leading-none">{h.label}</div>
              <div className={`mt-1 text-[11px] ${active ? "text-ivory/80" : "text-walnut/60"}`}>{h.range}</div>
            </button>
          );
        })}
      </div>
      {activeHour && (
        <p className="mt-2.5 text-[13px] text-walnut/70">
          Giờ {activeHour.label} {activeHour.range} — sử dụng <strong className="font-medium text-ink/80">{activeHour.value}</strong>
        </p>
      )}
    </div>
  );
}

import { TU_VI_HOURS } from "@/lib/tuvi/calendar/tuViHours";
import { timeIndexFromHHmm } from "@/lib/tuvi/engine/iztroAdapter";

export function TuViHourPicker({ time, onChange }: { time: string; onChange: (value: string) => void }) {
  const activeIndex = timeIndexFromHHmm(time);

  return (
    <div>
      <p className="mb-2 text-[12px] text-walnut/55">Hoặc chọn nhanh theo 12 giờ Tử Vi</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {TU_VI_HOURS.map((h) => {
          const active = timeIndexFromHHmm(h.value) === activeIndex;
          return (
            <button
              key={h.key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(h.value)}
              className={`min-h-[60px] border px-2 py-2 text-center transition-colors ${
                active
                  ? "border-walnut bg-walnut text-ivory"
                  : "border-walnut/20 bg-ivory text-walnut/80 hover:border-gold/60 hover:bg-parchment/40"
              }`}
            >
              <div className="font-heading text-[14px] leading-none">{h.label}</div>
              <div className={`mt-1 text-[10px] ${active ? "text-ivory/70" : "text-walnut/45"}`}>{h.range}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

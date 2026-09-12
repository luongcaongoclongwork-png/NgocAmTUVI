const selectClass =
  "min-h-11 w-full border border-walnut/25 bg-ivory px-2 py-2 text-[16px] text-ink outline-none transition-colors focus:border-gold focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";
const labelClass = "tracking-label mb-1.5 block text-[10px] font-medium uppercase text-walnut/60";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Two plain <select> elements (giờ/phút) instead of the native `<input
 * type="time">`: that control renders in 12h AM/PM form in some
 * browsers/locales regardless of `lang="vi"`, which the brief explicitly asks
 * to avoid ("đồng nhất cách hiển thị giờ theo 24 giờ"). Selects are
 * guaranteed 24h everywhere and still compose into the same `HH:mm` string
 * the rest of the pipeline (timeIndexFromHHmm, TuViHourPicker) already reads.
 */
export function TimeSelect({ time, onChange }: { time: string; onChange: (value: string) => void }) {
  const [h, m] = time.split(":").map(Number);
  const hour = Number.isFinite(h) ? h : 12;
  const minute = Number.isFinite(m) ? m : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelClass} htmlFor="tuvi-hour">
          Giờ (0–23)
        </label>
        <select
          id="tuvi-hour"
          className={selectClass}
          value={hour}
          onChange={(e) => onChange(`${pad(Number(e.target.value))}:${pad(minute)}`)}
        >
          {Array.from({ length: 24 }, (_, i) => i).map((v) => (
            <option key={v} value={v}>
              {pad(v)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="tuvi-minute">
          Phút
        </label>
        <select
          id="tuvi-minute"
          className={selectClass}
          value={minute}
          onChange={(e) => onChange(`${pad(hour)}:${pad(Number(e.target.value))}`)}
        >
          {Array.from({ length: 60 }, (_, i) => i).map((v) => (
            <option key={v} value={v}>
              {pad(v)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

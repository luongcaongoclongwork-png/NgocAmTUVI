import type { CalendarType } from "./CalendarSwitch";
import {
  daysInSolarMonth,
  daysInLunarMonth,
  leapMonthOfLunarYear,
  previewLunarFromSolar,
  previewSolarFromLunar,
} from "@/lib/tuvi/calendar/lunarPreview";

const selectClass =
  "min-h-11 w-full border border-walnut/25 bg-ivory px-2 py-2 text-[16px] text-ink outline-none transition-colors focus:border-gold focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";
const labelClass = "tracking-label mb-1.5 block text-[10px] font-medium uppercase text-walnut/60";

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

export function BirthDateFields({
  calendarType,
  day,
  month,
  year,
  isLeapMonth,
  invalid,
  describedBy,
  onDayChange,
  onMonthChange,
  onYearChange,
  onLeapMonthChange,
}: {
  calendarType: CalendarType;
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  /** Set when the parent form's "chọn ngày sinh hợp lệ" validation failed on submit. */
  invalid?: boolean;
  describedBy?: string;
  onDayChange: (value: number) => void;
  onMonthChange: (value: number) => void;
  onYearChange: (value: number) => void;
  onLeapMonthChange: (value: boolean) => void;
}) {
  const maxDay =
    calendarType === "solar" ? daysInSolarMonth(year, month) : daysInLunarMonth(year, month, isLeapMonth);
  const leapMonth = leapMonthOfLunarYear(year);
  const canBeLeapMonth = calendarType === "lunar" && leapMonth !== 0 && leapMonth === month;

  const preview =
    calendarType === "solar"
      ? previewLunarFromSolar(day, month, year)
      : previewSolarFromLunar(day, month, year, isLeapMonth);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass} htmlFor="tuvi-day">
            {calendarType === "lunar" ? "Ngày âm" : "Ngày"}
          </label>
          <select
            id="tuvi-day"
            className={selectClass}
            value={day}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(e) => onDayChange(Number(e.target.value))}
          >
            {range(1, maxDay).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="tuvi-month">
            {calendarType === "lunar" ? "Tháng âm" : "Tháng"}
          </label>
          <select
            id="tuvi-month"
            className={selectClass}
            value={month}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(e) => onMonthChange(Number(e.target.value))}
          >
            {range(1, 12).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="tuvi-year">
            Năm
          </label>
          <select
            id="tuvi-year"
            className={selectClass}
            value={year}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(e) => onYearChange(Number(e.target.value))}
          >
            {range(1900, 2100)
              .reverse()
              .map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
          </select>
        </div>
      </div>

      {calendarType === "lunar" && canBeLeapMonth && (
        <label className="inline-flex min-h-11 items-center gap-2 py-2 text-[14px] text-walnut/70">
          <input
            type="checkbox"
            checked={isLeapMonth}
            onChange={(e) => onLeapMonthChange(e.target.checked)}
            className="h-5 w-5 accent-walnut"
          />
          Tháng nhuận
        </label>
      )}

      {preview && (
        <div className="flex items-center gap-2 text-[13px] text-walnut/70">
          <span className="text-gold">◇</span>
          <span>{calendarType === "solar" ? "Âm lịch tương ứng:" : "Dương lịch tương ứng:"}</span>
          <strong className="font-medium text-ink/80">{preview}</strong>
        </div>
      )}
    </div>
  );
}

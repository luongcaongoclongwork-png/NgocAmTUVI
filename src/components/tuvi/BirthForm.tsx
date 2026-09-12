"use client";

import { useState } from "react";
import type { BirthInput } from "@/lib/tuvi/types/VietnameseChart";
import { CalendarSwitch, type CalendarType } from "./CalendarSwitch";
import { BirthDateFields } from "./BirthDateFields";
import { TuViHourPicker } from "./TuViHourPicker";
import { daysInSolarMonth, daysInLunarMonth, convertOnCalendarSwitch } from "@/lib/tuvi/calendar/lunarPreview";

const inputClass =
  "w-full border border-walnut/25 bg-ivory px-3 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-gold";
const labelClass = "tracking-label mb-1.5 block text-[10px] font-medium uppercase text-walnut/60";

export default function BirthForm({
  onSubmit,
  targetYear,
  onTargetYearChange,
}: {
  onSubmit: (input: BirthInput) => void;
  /** "Năm xem" (Luu Nien viewing year) — lives here so it sits in the same info card, but is independent of birth-data submission: changing it re-renders the already-generated chart immediately, no resubmit needed. */
  targetYear?: number;
  onTargetYearChange?: (year: number) => void;
}) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"Nam" | "Nữ">("Nam");
  const [calendarType, setCalendarType] = useState<CalendarType>("solar");
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2000);
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [time, setTime] = useState("12:00");
  const [error, setError] = useState<string | null>(null);

  // Keep `day` in range whenever the selected month/year/leap-month no longer supports it,
  // rather than letting an invalid combination (e.g. 31/2) sit in state until submit.
  function clampDay(candidateDay: number, cType: CalendarType, m: number, y: number, leap: boolean) {
    const maxDay = cType === "solar" ? daysInSolarMonth(y, m) : daysInLunarMonth(y, m, leap);
    return Math.min(candidateDay, maxDay);
  }

  function handleMonthChange(next: number) {
    setMonth(next);
    setDay((d) => clampDay(d, calendarType, next, year, isLeapMonth));
  }

  function handleYearChange(next: number) {
    setYear(next);
    setDay((d) => clampDay(d, calendarType, month, next, isLeapMonth));
  }

  function handleLeapMonthChange(next: boolean) {
    setIsLeapMonth(next);
    setDay((d) => clampDay(d, calendarType, month, year, next));
  }

  function handleCalendarTypeChange(next: CalendarType) {
    if (next === calendarType) return;
    const converted = convertOnCalendarSwitch(next, day, month, year, isLeapMonth);
    if (converted) {
      setDay(converted.day);
      setMonth(converted.month);
      setYear(converted.year);
      setIsLeapMonth(converted.isLeapMonth);
    }
    setCalendarType(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!day || !month || !year) {
      setError("Vui lòng chọn ngày sinh hợp lệ.");
      return;
    }
    setError(null);
    onSubmit({ name: name.trim() || undefined, gender, calendarType, day, month, year, isLeapMonth, time });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[620px] space-y-7">
      <h2 className="tracking-label text-center text-[13px] font-medium uppercase text-gold">
        Thông tin lá số
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label className={labelClass} htmlFor="tuvi-name">
            Họ và tên
          </label>
          <input
            id="tuvi-name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div>
          <span className={labelClass}>Giới tính</span>
          <div className="flex h-[44px] gap-1.5">
            {(["Nam", "Nữ"] as const).map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={gender === g}
                onClick={() => setGender(g)}
                className={`w-16 border text-[13px] transition-colors ${
                  gender === g ? "border-walnut bg-walnut text-ivory" : "border-walnut/25 text-walnut/70 hover:border-gold"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <span className={labelClass}>Loại lịch</span>
        <CalendarSwitch value={calendarType} onChange={handleCalendarTypeChange} />
      </div>

      <div className="space-y-3">
        <p className="tracking-label text-[10px] font-medium uppercase text-walnut/60">Ngày sinh</p>
        <BirthDateFields
          calendarType={calendarType}
          day={day}
          month={month}
          year={year}
          isLeapMonth={isLeapMonth}
          onDayChange={setDay}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onLeapMonthChange={handleLeapMonthChange}
        />
      </div>

      <div className="space-y-3">
        <p className="tracking-label text-[10px] font-medium uppercase text-walnut/60">Giờ sinh</p>
        <input
          id="tuvi-time"
          type="time"
          aria-label="Giờ sinh"
          className={`${inputClass} sm:max-w-[200px]`}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <TuViHourPicker time={time} onChange={setTime} />
      </div>

      {targetYear !== undefined && onTargetYearChange && (
        <div className="flex items-center justify-center gap-2 text-[11px] tracking-[0.08em] text-walnut/70 uppercase">
          <span>Năm xem</span>
          <button
            type="button"
            onClick={() => onTargetYearChange(targetYear - 1)}
            className="h-7 w-7 border border-walnut/30 text-walnut hover:border-gold hover:text-gold"
            aria-label="Lùi một năm"
          >
            −
          </button>
          <span className="min-w-[3.5em] text-center font-medium normal-case text-ink">{targetYear}</span>
          <button
            type="button"
            onClick={() => onTargetYearChange(targetYear + 1)}
            className="h-7 w-7 border border-walnut/30 text-walnut hover:border-gold hover:text-gold"
            aria-label="Tiến một năm"
          >
            +
          </button>
        </div>
      )}

      {error && <p className="text-[13px] text-lacquer/80">{error}</p>}

      <button
        type="submit"
        className="tracking-label flex h-[50px] w-full items-center justify-center gap-2 border border-walnut bg-walnut text-[13px] font-medium uppercase text-ivory transition-colors hover:bg-ink"
      >
        Lập lá số ngay
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

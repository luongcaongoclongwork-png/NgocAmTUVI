"use client";

import { useId, useRef, useState } from "react";
import type { BirthInput } from "@/lib/tuvi/types/VietnameseChart";
import type { GenerationStatus } from "./LapLaSoClient";
import { CalendarSwitch, type CalendarType } from "./CalendarSwitch";
import { BirthDateFields } from "./BirthDateFields";
import { TuViHourPicker } from "./TuViHourPicker";
import { TimeSelect } from "./TimeSelect";
import { daysInSolarMonth, daysInLunarMonth, convertOnCalendarSwitch } from "@/lib/tuvi/calendar/lunarPreview";

const inputClass =
  "min-h-11 w-full border border-walnut/25 bg-ivory px-3 py-2.5 text-[16px] text-ink outline-none transition-colors focus:border-gold focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";
const labelClass = "tracking-label mb-1.5 block text-[10px] font-medium uppercase text-walnut/60";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M2 6.2l2.6 2.6L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SUBMIT_LABEL: Record<GenerationStatus, string> = {
  idle: "Lập lá số ngay",
  validating: "Đang kiểm tra…",
  generating: "Đang an sao…",
  success: "Lập lá số ngay",
  error: "Lập lá số ngay",
};

export default function BirthForm({
  onSubmit,
  status,
  targetYear,
  onTargetYearChange,
}: {
  onSubmit: (input: BirthInput) => void;
  status: GenerationStatus;
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
  const [dateError, setDateError] = useState<string | null>(null);
  const dateErrorId = useId();
  const dateFieldsRef = useRef<HTMLDivElement>(null);
  const busy = status === "validating" || status === "generating";

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
    if (busy) return;
    if (!day || !month || !year) {
      setDateError("Vui lòng chọn ngày sinh hợp lệ.");
      dateFieldsRef.current?.querySelector("select")?.focus();
      return;
    }
    setDateError(null);
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
            Họ và tên — không bắt buộc
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
          <div className="flex h-11 gap-2">
            {(["Nam", "Nữ"] as const).map((g) => {
              const active = gender === g;
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setGender(g)}
                  className={`flex w-[76px] items-center justify-center gap-1 border text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
                    active ? "border-walnut bg-walnut text-ivory" : "border-walnut/25 text-walnut/70 hover:border-gold"
                  }`}
                >
                  {active && <CheckIcon />}
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <span className={labelClass}>Loại lịch</span>
        <CalendarSwitch value={calendarType} onChange={handleCalendarTypeChange} />
      </div>

      <div className="space-y-3" ref={dateFieldsRef}>
        <p className="tracking-label text-[10px] font-medium uppercase text-walnut/60">Ngày sinh</p>
        <BirthDateFields
          calendarType={calendarType}
          day={day}
          month={month}
          year={year}
          isLeapMonth={isLeapMonth}
          invalid={Boolean(dateError)}
          describedBy={dateError ? dateErrorId : undefined}
          onDayChange={setDay}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onLeapMonthChange={handleLeapMonthChange}
        />
        {dateError && (
          <p id={dateErrorId} role="alert" className="text-[13px] font-medium text-lacquer">
            {dateError}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <p className="tracking-label text-[10px] font-medium uppercase text-walnut/60">Giờ sinh</p>
        <TimeSelect time={time} onChange={setTime} />
        <TuViHourPicker time={time} onChange={setTime} />
      </div>

      {targetYear !== undefined && onTargetYearChange && (
        <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.08em] text-walnut/70 uppercase">
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
      )}

      <button
        type="submit"
        disabled={busy}
        className="tracking-label flex h-[50px] w-full items-center justify-center gap-2 border border-walnut bg-walnut text-[13px] font-medium uppercase text-ivory transition-[background-color,transform] duration-100 hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
      >
        {SUBMIT_LABEL[status]}
        {!busy && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import type { BirthInput } from "@/lib/tuvi/types/VietnameseChart";

const inputClass =
  "w-full border border-walnut/25 bg-ivory px-3 py-2 text-[14px] text-ink outline-none transition-colors focus:border-gold";
const labelClass = "tracking-label mb-1.5 block text-[10px] font-medium uppercase text-walnut/60";

export default function BirthForm({ onSubmit }: { onSubmit: (input: BirthInput) => void }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"Nam" | "Nữ">("Nam");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2000);
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [time, setTime] = useState("12:00");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name: name.trim() || undefined, gender, calendarType, day, month, year, isLeapMonth, time });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="tuvi-name">Họ và tên</label>
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
        <div className="flex gap-2">
          {(["Nam", "Nữ"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 border px-3 py-2 text-[13px] transition-colors ${
                gender === g ? "border-walnut bg-walnut text-ivory" : "border-walnut/25 text-walnut/70 hover:border-gold"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className={labelClass}>Loại lịch</span>
        <div className="flex gap-2">
          {([
            { v: "solar", l: "Dương lịch" },
            { v: "lunar", l: "Âm lịch" },
          ] as const).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setCalendarType(opt.v)}
              className={`flex-1 border px-3 py-2 text-[13px] transition-colors ${
                calendarType === opt.v ? "border-walnut bg-walnut text-ivory" : "border-walnut/25 text-walnut/70 hover:border-gold"
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="tuvi-day">Ngày</label>
        <input id="tuvi-day" type="number" min={1} max={31} className={inputClass} value={day} onChange={(e) => setDay(Number(e.target.value))} />
      </div>
      <div>
        <label className={labelClass} htmlFor="tuvi-month">Tháng</label>
        <input id="tuvi-month" type="number" min={1} max={12} className={inputClass} value={month} onChange={(e) => setMonth(Number(e.target.value))} />
      </div>
      <div>
        <label className={labelClass} htmlFor="tuvi-year">Năm</label>
        <input id="tuvi-year" type="number" min={1900} max={2100} className={inputClass} value={year} onChange={(e) => setYear(Number(e.target.value))} />
      </div>

      {calendarType === "lunar" && (
        <label className="flex items-center gap-2 self-end pb-2 text-[13px] text-walnut/70">
          <input type="checkbox" checked={isLeapMonth} onChange={(e) => setIsLeapMonth(e.target.checked)} />
          Tháng nhuận
        </label>
      )}

      <div>
        <label className={labelClass} htmlFor="tuvi-time">Giờ sinh</label>
        <input id="tuvi-time" type="time" className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="tracking-label w-full border border-walnut bg-walnut px-4 py-3 text-[12px] font-medium uppercase text-ivory transition-colors hover:bg-ink sm:w-auto"
        >
          Lập lá số
        </button>
      </div>
    </form>
  );
}

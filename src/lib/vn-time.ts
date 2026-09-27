/**
 * Vietnam-time helpers. Everything is stored as UTC ISO strings; everything
 * shown to people is Asia/Ho_Chi_Minh, whatever timezone the server runs in
 * (hosting is often UTC, which used to shift admin dates by 7 hours).
 * Vietnam has no DST, so the fixed +07:00 offset is exact.
 */

const TZ = "Asia/Ho_Chi_Minh";
const OFFSET_MS = 7 * 60 * 60 * 1000;

/** "09:05 27/09/2026" */
export function formatVietnamTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** "27/09/2026" */
export function formatVietnamDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" });
}

/** "Thứ Năm, 01/10 · 09:30": for appointments, where the weekday matters. */
export function formatAppointment(iso: string): string {
  // Built from parts: vi-VN renders a day+month-only date as "29-09".
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("vi-VN", {
      timeZone: TZ,
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value])
  );
  const weekday = String(parts.weekday);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${parts.day}/${parts.month} · ${parts.hour}:${parts.minute}`;
}

/** UTC ISO → value for <input type="datetime-local"> in Vietnam time ("2026-10-01T09:30"). */
export function toVietnamInputValue(iso: string): string {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + OFFSET_MS);
  return d.toISOString().slice(0, 16);
}

/** <input type="datetime-local"> value, read as Vietnam time → UTC ISO. "" or invalid → null. */
export function fromVietnamInputValue(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(`${value}:00+07:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

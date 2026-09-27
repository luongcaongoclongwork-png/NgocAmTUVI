/**
 * Pure helpers for the admin lead screens (search, CSV). No DB access, so
 * they are unit-testable and safe to import anywhere.
 */

/** Lowercase, strip Vietnamese diacritics (đ → d): "Nguyễn Tráng" → "nguyen trang". */
export function foldVietnamese(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase();
}

function digits(s: string): string {
  return s.replace(/\D/g, "");
}

type Searchable = { name: string; phone: string; interest: string; message: string };

/**
 * Accent-insensitive match on name / interest / message, and digit-only
 * match on the phone so "0912 345", "912345" and "+84912345…" all find the
 * same customer (a "0" typed in front is ignored against a +84 number).
 */
export function leadMatchesQuery(lead: Searchable, query: string): boolean {
  const q = foldVietnamese(query.trim());
  if (!q) return true;
  const text = foldVietnamese(`${lead.name} ${lead.interest} ${lead.message}`);
  if (q.split(/\s+/).every((word) => text.includes(word))) return true;
  const qd = digits(query).replace(/^0/, "");
  return qd.length >= 3 && digits(lead.phone).includes(qd);
}

/**
 * One CSV cell. Quotes every value, doubles inner quotes, and neutralises
 * spreadsheet formula injection: a customer-typed message starting with
 * = + - @ would otherwise run as a formula when the file is opened in Excel.
 */
export function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** CSV with a UTF-8 BOM so Excel shows Vietnamese correctly; CRLF line ends. */
export function toCsv(header: string[], rows: string[][]): string {
  return "﻿" + [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

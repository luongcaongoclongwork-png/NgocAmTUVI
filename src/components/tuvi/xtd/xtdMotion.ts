import type { VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

/**
 * Motion helpers for the Xuyen Tam Diem chart ("Khai mo mot la so"): the
 * one-time reveal flag handed over from the form, the mineral colour of each
 * cuc, and the Nien Trinh lantern's path. Pure functions only (no DOM), so
 * they are unit-tested (tests/xtdMotion.test.ts).
 */

/** sessionStorage flag: set by the form on submit, peeked by the chart page, cleared once the chart is on screen. */
export const REVEAL_FLAG_KEY = "ngoc-am-reveal";

export function markReveal(): void {
  try {
    sessionStorage.setItem(REVEAL_FLAG_KEY, "1");
  } catch {
    // private mode / blocked storage: no reveal, nothing else breaks
  }
}

export function peekReveal(): boolean {
  try {
    return sessionStorage.getItem(REVEAL_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearReveal(): void {
  try {
    sessionStorage.removeItem(REVEAL_FLAG_KEY);
  } catch {
    // ignore
  }
}

/**
 * Each cuc is named after a material (Xuyen Tam Diem names: Nguyet Tuyen,
 * Ho Duong, Luu Kim, Ao Tho, Chu Sa). The key selects a muted mineral pigment
 * in xtdMotion.css (`.center-palace[data-cuc="..."]`).
 */
const CUC_KEY_BY_BUREAU: Record<string, string> = {
  "Thủy Nhị Cục": "nguyet-tuyen",
  "Mộc Tam Cục": "ho-duong",
  "Kim Tứ Cục": "luu-kim",
  "Thổ Ngũ Cục": "ao-tho",
  "Hỏa Lục Cục": "chu-sa",
};

export function cucTintKey(bureau: string | undefined): string | undefined {
  return bureau ? CUC_KEY_BY_BUREAU[bureau] : undefined;
}

/**
 * Palace indices the lantern passes through going from `from` to `to`
 * (excluding `from`, including `to`), along the SHORTER way round the ring.
 * VietnamesePalace.index grows clockwise around the grid (Dan = 0, at the
 * bottom-left, then Mao, Thin, Ty ... Suu), so +1 is one step clockwise.
 * An exact half-turn (6 steps) goes clockwise.
 */
export function ringSteps(from: number, to: number, count = 12): number[] {
  if (from === to) return [];
  const forward = (to - from + count) % count;
  const backward = count - forward;
  const dir = forward <= backward ? 1 : -1;
  const n = dir === 1 ? forward : backward;
  const path: number[] = [];
  for (let i = 1; i <= n; i++) path.push(((from + dir * i) % count + count) % count);
  return path;
}

/** Travel time for the lantern: 320ms + 60ms per palace passed, capped at 900ms. */
export function lanternDurationMs(steps: number): number {
  return Math.min(900, 320 + 60 * steps);
}

/** Index of the palace holding this year's Menh (the Nien Trinh "Chu That"), or undefined without a horoscope. */
export function yearMenhIndex(horoscope: VietnameseHoroscopeDTO | null | undefined): number | undefined {
  if (!horoscope) return undefined;
  const i = horoscope.yearly.palaceNameByIndex.indexOf("Mệnh");
  return i >= 0 ? i : undefined;
}

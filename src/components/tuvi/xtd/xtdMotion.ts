/**
 * Motion helpers for the Xuyen Tam Diem chart ("Khai mo mot la so"): the
 * one-time reveal flag handed over from the form, and the mineral colour of
 * each cuc. Pure functions only (no DOM), so they are unit-tested
 * (tests/xtdMotion.test.ts).
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

/**
 * Palace relationships, operating purely on palace index (0-11, Dan-anchored —
 * see locale/vi-VN.ts BRANCH_ORDER). Pure functions only; no rendering here —
 * components/tuvi/AspectOverlay.tsx draws the result.
 */

const fix = (i: number) => ((i % 12) + 12) % 12;

export function tamHopIndices(i: number): [number, number] {
  return [fix(i + 4), fix(i + 8)];
}

export function xungChieuIndex(i: number): number {
  return fix(i + 6);
}

/** Tam phuong tu chinh = the palace itself + its 2 tam hop palaces + its xung chieu palace. */
export function tamPhuongTuChinhIndices(i: number): number[] {
  const [a, b] = tamHopIndices(i);
  return [i, a, b, xungChieuIndex(i)];
}

export function giapCungIndices(i: number): [number, number] {
  return [fix(i + 1), fix(i - 1)];
}

/**
 * Nhi hop pairs, by branch (fixed pairing independent of palace index):
 * Ty-Suu, Dan-Hoi, Mao-Tuat, Thin-Dau, Ty(Ty)-Than, Ngo-Mui.
 */
const NHI_HOP_PAIRS: Record<string, string> = {
  "Tý": "Sửu", "Sửu": "Tý",
  "Dần": "Hợi", "Hợi": "Dần",
  "Mão": "Tuất", "Tuất": "Mão",
  "Thìn": "Dậu", "Dậu": "Thìn",
  "Tỵ": "Thân", "Thân": "Tỵ",
  "Ngọ": "Mùi", "Mùi": "Ngọ",
};

export function nhiHopBranch(branch: string): string | undefined {
  return NHI_HOP_PAIRS[branch];
}

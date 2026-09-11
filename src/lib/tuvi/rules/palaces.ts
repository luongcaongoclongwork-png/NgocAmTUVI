import type { EarthlyBranchVi } from "../types/VietnameseChart";

/**
 * 4x4 Vietnamese chart grid, center 2x2. Row/col are 1-based CSS grid lines.
 *
 *   Ty      Ngo     Mui     Than
 *   Thin  [   CENTER (2x2)    ]  Dau
 *   Mao   [                   ]  Tuat
 *   Dan     Suu     Ty      Hoi
 */
export const BRANCH_GRID_POSITION: Record<EarthlyBranchVi, { row: number; col: number }> = {
  "Tỵ": { row: 1, col: 1 },
  "Ngọ": { row: 1, col: 2 },
  "Mùi": { row: 1, col: 3 },
  "Thân": { row: 1, col: 4 },
  "Thìn": { row: 2, col: 1 },
  "Dậu": { row: 2, col: 4 },
  "Mão": { row: 3, col: 1 },
  "Tuất": { row: 3, col: 4 },
  "Dần": { row: 4, col: 1 },
  "Sửu": { row: 4, col: 2 },
  "Tý": { row: 4, col: 3 },
  "Hợi": { row: 4, col: 4 },
};

export function gridArea(branch: EarthlyBranchVi): string {
  const { row, col } = BRANCH_GRID_POSITION[branch];
  return `${row} / ${col} / ${row + 1} / ${col + 1}`;
}

/** Center cell (Ngu Hanh Cuc, Menh Chu/Than Chu, name, birth info) spans rows 2-3, cols 2-3. */
export const CENTER_GRID_AREA = "2 / 2 / 4 / 4";

/**
 * Menh Chu / Than Chu are NOT recomputed here — they are read live from
 * iztro's own `astrolabe.soul` / `astrolabe.body` fields (see
 * engine/iztroAdapter.ts and engine/vietnameseAdapter.ts), because iztro
 * already implements both conventions correctly and switching between them
 * is just its `algorithm` config option:
 *
 * - Than Chu = earthlyBranches[YEAR branch].body — always this, regardless
 *   of algorithm setting (node_modules/iztro/lib/astro/astro.js:226).
 * - Menh Chu = earthlyBranches[X].soul, where X is the Menh palace's own
 *   branch under the "default" (thong dung) school, or the YEAR branch
 *   under the "zhongzhou" (Trung Chau) school (astro.js:212).
 *
 * Verified 2026-09-12 against the 05/07/2000 07:30 Nam golden benchmark
 * (docs/tuvi-engine-audit.md section Q, Menh at Mao/Canh Thin year): the
 * "default" school gives Menh Chu = Van Khuc (which independent classical
 * sources also confirm for a Mao-branch Menh palace — this is NOT the
 * benchmark's answer), while the "zhongzhou" school — keying off the YEAR
 * branch Thin instead — gives Menh Chu = Liem Trinh, which matches the
 * benchmark exactly. So the two Vietnamese reference sites follow the
 * Trung Chau convention for Menh Chu specifically; profiles/ngocAm.ts and
 * profiles/vietnamTanBien.ts request `algorithm: "zhongzhou"` accordingly.
 * Than Chu needed no such switch — it already matched (Than Chu = Van
 * Xuong for Canh Thin) under either setting.
 */

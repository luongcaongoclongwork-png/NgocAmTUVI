/**
 * Pure row-height solver for the Xuyen Tam Diem print chart's measured fit
 * (useXtdPrintFit.ts). Given how tall each of the 4 grid rows NEEDS to be to
 * show its fullest cell without any shrinking, plus the smallest height the
 * 2-row-tall Trung Cung can take, it returns 4 heights that add up to exactly
 * `total`:
 *
 *  - enough room overall -> every row gets its need plus a share of the spare
 *    height in proportion to that need (the look stays close to the old one);
 *  - not enough room -> every row is squeezed by the SAME ratio, so no single
 *    row (and so no single cell) takes the whole shrink;
 *  - Trung Cung (rows 2+3 together) is never allowed under `centerMin` unless
 *    the two outer rows have already hit `minRow` — the height it needs comes
 *    out of rows 1 and 4, in proportion to their size.
 *
 * All values are in the same unit (px). No DOM, so it is unit-tested.
 */
export function solveRowHeights({
  needs,
  centerMin,
  total,
  minRow,
}: {
  needs: [number, number, number, number];
  centerMin: number;
  total: number;
  minRow: number;
}): [number, number, number, number] {
  const need = needs.map((n) => Math.max(n, minRow));
  const sum = need[0] + need[1] + need[2] + need[3];

  let h =
    sum <= total
      ? need.map((n) => n + ((total - sum) * n) / sum)
      : need.map((n) => (n * total) / sum);

  const center = h[1] + h[2];
  if (center < centerMin) {
    const wanted = centerMin - center;
    const outerRoom = Math.max(0, h[0] - minRow) + Math.max(0, h[3] - minRow);
    const delta = Math.min(wanted, outerRoom);
    if (delta > 0) {
      const take0 = (delta * Math.max(0, h[0] - minRow)) / outerRoom;
      const take3 = delta - take0;
      h = [h[0] - take0, h[1] + (delta * h[1]) / center, h[2] + (delta * h[2]) / center, h[3] - take3];
    }
  }

  // Float dust: force the exact total onto the last row.
  const dust = total - (h[0] + h[1] + h[2] + h[3]);
  h[3] += dust;
  return [h[0], h[1], h[2], h[3]];
}

/** Heights (px) -> the % heights + cumulative % boundaries chartRowLayout.ts's RowLayout uses. */
export function toRowLayout(heightsPx: [number, number, number, number]) {
  const total = heightsPx[0] + heightsPx[1] + heightsPx[2] + heightsPx[3];
  const heights = heightsPx.map((h) => (h / total) * 100) as [number, number, number, number];
  const boundaries: [number, number, number, number, number] = [
    0,
    heights[0],
    heights[0] + heights[1],
    heights[0] + heights[1] + heights[2],
    100,
  ];
  return { heights, boundaries };
}

import { describe, expect, it } from "vitest";
import { solveRowHeights, toRowLayout } from "@/components/tuvi/xtd/print/solveRowHeights";

const sum = (h: number[]) => h.reduce((a, b) => a + b, 0);

describe("solveRowHeights", () => {
  it("always adds up to exactly the total", () => {
    for (const needs of [
      [200, 230, 210, 260],
      [500, 500, 500, 500],
      [10, 10, 10, 10],
      [300, 120, 400, 90],
    ] as [number, number, number, number][]) {
      const h = solveRowHeights({ needs, centerMin: 300, total: 850, minRow: 160 });
      expect(sum(h)).toBeCloseTo(850, 6);
    }
  });

  it("spare room is shared in proportion to the need", () => {
    const h = solveRowHeights({ needs: [200, 200, 200, 300], centerMin: 0, total: 1000, minRow: 0 });
    // sum(need)=900, spare=100 -> each row grows by 100*need/900
    expect(h[3] - 300).toBeCloseTo((100 * 300) / 900, 6);
    expect(h[0] - 200).toBeCloseTo((100 * 200) / 900, 6);
  });

  it("squeezes every row by the same ratio when there is not enough room", () => {
    const needs: [number, number, number, number] = [300, 200, 200, 400];
    const h = solveRowHeights({ needs, centerMin: 0, total: 900, minRow: 0 });
    const ratios = h.map((v, i) => v / needs[i]);
    for (const r of ratios) expect(r).toBeCloseTo(ratios[0], 6);
    expect(ratios[0]).toBeLessThan(1);
  });

  it("keeps Trung Cung (rows 2+3) at its minimum by taking from rows 1 and 4", () => {
    const h = solveRowHeights({ needs: [300, 100, 100, 300], centerMin: 400, total: 800, minRow: 80 });
    expect(h[1] + h[2]).toBeGreaterThanOrEqual(400 - 1e-6);
    expect(sum(h)).toBeCloseTo(800, 6);
    expect(h[0]).toBeGreaterThanOrEqual(80);
    expect(h[3]).toBeGreaterThanOrEqual(80);
  });

  it("never pushes an outer row under minRow, even if that leaves Trung Cung short", () => {
    const h = solveRowHeights({ needs: [100, 100, 100, 100], centerMin: 780, total: 800, minRow: 90 });
    expect(h[0]).toBeGreaterThanOrEqual(90 - 1e-6);
    expect(h[3]).toBeGreaterThanOrEqual(90 - 1e-6);
    expect(sum(h)).toBeCloseTo(800, 6);
  });

  it("an all-zero need still yields four positive rows summing to the total (minRow floor)", () => {
    const h = solveRowHeights({ needs: [0, 0, 0, 0], centerMin: 0, total: 800, minRow: 150 });
    for (const v of h) expect(v).toBeGreaterThan(0);
    expect(sum(h)).toBeCloseTo(800, 6);
  });
});

describe("toRowLayout", () => {
  it("returns % heights summing to 100 and matching cumulative boundaries", () => {
    const { heights, boundaries } = toRowLayout([200, 250, 250, 150]);
    expect(sum(heights)).toBeCloseTo(100, 6);
    expect(boundaries[0]).toBe(0);
    expect(boundaries[4]).toBe(100);
    expect(boundaries[2]).toBeCloseTo(heights[0] + heights[1], 6);
  });
});

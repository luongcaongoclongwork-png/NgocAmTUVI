import { describe, expect, it } from "vitest";
import { cucTintKey, lanternDurationMs, ringSteps, yearMenhIndex } from "@/components/tuvi/xtd/xtdMotion";
import type { VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";

describe("ringSteps", () => {
  it("goes one step clockwise for +1", () => {
    expect(ringSteps(3, 4)).toEqual([4]);
  });
  it("takes the shorter way round, wrapping past 11 -> 0", () => {
    expect(ringSteps(11, 1)).toEqual([0, 1]);
    expect(ringSteps(1, 11)).toEqual([0, 11]);
  });
  it("goes backwards when that is shorter", () => {
    expect(ringSteps(5, 2)).toEqual([4, 3, 2]);
  });
  it("goes clockwise on an exact half-turn", () => {
    expect(ringSteps(0, 6)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it("is empty when nothing moves", () => {
    expect(ringSteps(4, 4)).toEqual([]);
  });
  it("always ends on the target and never exceeds 6 steps", () => {
    for (let a = 0; a < 12; a++) {
      for (let b = 0; b < 12; b++) {
        const p = ringSteps(a, b);
        expect(p.length).toBeLessThanOrEqual(6);
        if (a !== b) expect(p[p.length - 1]).toBe(b);
      }
    }
  });
});

describe("lanternDurationMs", () => {
  it("grows with distance and is capped", () => {
    expect(lanternDurationMs(1)).toBe(380);
    expect(lanternDurationMs(6)).toBe(680);
    expect(lanternDurationMs(50)).toBe(900);
  });
});

describe("cucTintKey", () => {
  it("maps the five cuc to their pigment key", () => {
    expect(cucTintKey("Hỏa Lục Cục")).toBe("chu-sa");
    expect(cucTintKey("Kim Tứ Cục")).toBe("luu-kim");
    expect(cucTintKey("Thổ Ngũ Cục")).toBe("ao-tho");
    expect(cucTintKey("Thủy Nhị Cục")).toBe("nguyet-tuyen");
    expect(cucTintKey("Mộc Tam Cục")).toBe("ho-duong");
  });
  it("returns undefined for anything else", () => {
    expect(cucTintKey(undefined)).toBeUndefined();
    expect(cucTintKey("")).toBeUndefined();
  });
});

describe("yearMenhIndex", () => {
  it("finds the palace named Menh in this year's palace names", () => {
    const h = { yearly: { palaceNameByIndex: ["Phụ Mẫu", "Mệnh", "Huynh Đệ"] } } as unknown as VietnameseHoroscopeDTO;
    expect(yearMenhIndex(h)).toBe(1);
  });
  it("is undefined without a horoscope", () => {
    expect(yearMenhIndex(null)).toBeUndefined();
  });
});

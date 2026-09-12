import { describe, expect, it } from "vitest";
import { generateHoroscope } from "../engine/chartEngine";
import type { PalaceNameVi } from "../types/VietnameseChart";

const ALL_PALACE_NAMES: PalaceNameVi[] = [
  "Mệnh", "Huynh Đệ", "Phu Thê", "Tử Tức", "Tài Bạch", "Tật Ách",
  "Thiên Di", "Nô Bộc", "Quan Lộc", "Điền Trạch", "Phúc Đức", "Phụ Mẫu",
];

/**
 * Same benchmark person used in goldenCharts.test.ts's sibling manual
 * comparison (1/1/2000 duong lich, 12:00, Nam) — lunar birth year is Ky Mao
 * 1999 (dl 1/1/2000 falls before Tet, confirmed both by this engine's own
 * lunarDate output and by tuvidausotoanthu.vn's "Âm lịch tương ứng: 25 tháng
 * 11 năm Kỷ Mão" on 2026-09-12). "Năm xem" 2026 is independently verifiable
 * as Bính Ngọ (2024 = Giáp Thìn is common knowledge, so 2025 = Ất Tỵ, 2026 =
 * Bính Ngọ) — cross-checked against tuvidausotoanthu.vn's own "Năm xem: Bính
 * Ngọ (2026)" the same day. Per rule X.2 this date is a test input only.
 */
const input = { gender: "Nam" as const, calendarType: "solar" as const, day: 1, month: 1, year: 2000, time: "12:00" };

describe("horoscope (Luu Nien) overlay, target year 2026", () => {
  const dto = generateHoroscope(input, 2026, "ngoc-am");

  it("resolves the target year's Can Chi to Binh Ngo, independently verifiable public knowledge", () => {
    expect(dto.yearly.heavenlyStem).toBe("Bính");
    expect(dto.yearly.branch).toBe("Ngọ");
  });

  it("resolves nominal age (tuoi ta) to 28 — 2026 (Binh Ngo) minus birth lunar year 1999 (Ky Mao) plus 1", () => {
    expect(dto.age).toBe(28);
  });

  it("derives yearly mutagen from this project's own Binh stem table, not iztro's", () => {
    // FOUR_TRANSFORMATIONS_VI["Bính"]: Loc=tiantongMaj, Quyen=tianjiMaj, Khoa=wenchangMin, Ky=lianzhenMaj
    expect(dto.yearly.mutagenByStarId.tiantongMaj).toBe("Lộc");
    expect(dto.yearly.mutagenByStarId.tianjiMaj).toBe("Quyền");
    expect(dto.yearly.mutagenByStarId.wenchangMin).toBe("Khoa");
    expect(dto.yearly.mutagenByStarId.lianzhenMaj).toBe("Kỵ");
    expect(Object.keys(dto.yearly.mutagenByStarId)).toHaveLength(4);
  });

  it("decadal age range is 10 years wide (inclusive) and contains the resolved age", () => {
    const [start, end] = dto.decadal.ageRange;
    expect(end - start).toBe(9);
    expect(dto.age).toBeGreaterThanOrEqual(start);
    expect(dto.age).toBeLessThanOrEqual(end);
  });

  it("both decadal and yearly palace relabeling are full 12-palace permutations", () => {
    expect(dto.decadal.palaceNameByIndex).toHaveLength(12);
    expect(dto.yearly.palaceNameByIndex).toHaveLength(12);
    expect([...dto.decadal.palaceNameByIndex].sort()).toEqual([...ALL_PALACE_NAMES].sort());
    expect([...dto.yearly.palaceNameByIndex].sort()).toEqual([...ALL_PALACE_NAMES].sort());
  });

  it("yearly flow-star / suiqian12 / jiangqian12 arrays cover all 12 palaces with real (translated) names", () => {
    expect(dto.yearly.starsByIndex).toHaveLength(12);
    expect(dto.yearly.suiQianByIndex).toHaveLength(12);
    expect(dto.yearly.jiangQianByIndex).toHaveLength(12);

    const allFlowStars = dto.yearly.starsByIndex.flat();
    // 10 named flow stars + Luu Nien Giai land in 11 of the 12 palaces (one star per palace, at most).
    expect(allFlowStars.length).toBeGreaterThan(0);
    for (const star of allFlowStars) {
      expect(star.name.startsWith("Lưu ")).toBe(true);
      expect(star.name).not.toContain("流"); // never leak raw zh-CN if a translation is missing
    }
    for (const name of dto.yearly.suiQianByIndex) {
      expect(name.length).toBeGreaterThan(0);
    }
    for (const name of dto.yearly.jiangQianByIndex) {
      expect(name.length).toBeGreaterThan(0);
    }
  });

  it("is stable across re-derivation (pure function of input + target year)", () => {
    const again = generateHoroscope(input, 2026, "ngoc-am");
    expect(again).toEqual(dto);
  });
});

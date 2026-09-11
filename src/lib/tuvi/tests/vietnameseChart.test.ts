import { describe, expect, it } from "vitest";
import { generateChart } from "../engine/chartEngine";
import { KHOI_VIET_VI, KHOI_VIET_IZTRO_DEFAULT } from "../rules/khoiViet";
import { getTuan, getTriet } from "../rules/tuanTriet";
import type { HeavenlyStemVi } from "../types/VietnameseChart";

describe("Khoi-Viet table", () => {
  it("Canh differs from iztro's own default (rule D)", () => {
    expect(KHOI_VIET_VI.Canh).toEqual({ khoi: "Ngọ", viet: "Dần" });
    expect(KHOI_VIET_IZTRO_DEFAULT.Canh).toEqual({ khoi: "Sửu", viet: "Mùi" });
  });

  it("covers all 10 heavenly stems", () => {
    const stems: HeavenlyStemVi[] = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    for (const s of stems) {
      expect(KHOI_VIET_VI[s]).toBeDefined();
      expect(KHOI_VIET_IZTRO_DEFAULT[s]).toBeDefined();
    }
  });
});

describe("Tuan Khong — all 6 luc Giap cycles", () => {
  const cases: [HeavenlyStemVi, string, [string, string]][] = [
    ["Giáp", "Tý", ["Tuất", "Hợi"]],
    ["Giáp", "Tuất", ["Thân", "Dậu"]],
    ["Giáp", "Thân", ["Ngọ", "Mùi"]],
    ["Giáp", "Ngọ", ["Thìn", "Tỵ"]],
    ["Giáp", "Thìn", ["Dần", "Mão"]],
    ["Giáp", "Dần", ["Tý", "Sửu"]],
  ];
  it.each(cases)("Giap %s -> %s void", (stem, branch, expected) => {
    const result = getTuan(stem, branch as never);
    expect(result.branches).toEqual(expected);
  });
});

describe("Triet Lo — by year stem", () => {
  it("Giap/Ky -> Than-Dau, At/Canh -> Ngo-Mui, Binh/Tan -> Thin-Ty, Dinh/Nham -> Dan-Mao, Mau/Quy -> Ty-Suu", () => {
    expect(getTriet("Giáp").branches).toEqual(["Thân", "Dậu"]);
    expect(getTriet("Kỷ").branches).toEqual(["Thân", "Dậu"]);
    expect(getTriet("Ất").branches).toEqual(["Ngọ", "Mùi"]);
    expect(getTriet("Canh").branches).toEqual(["Ngọ", "Mùi"]);
    expect(getTriet("Bính").branches).toEqual(["Thìn", "Tỵ"]);
    expect(getTriet("Tân").branches).toEqual(["Thìn", "Tỵ"]);
    expect(getTriet("Đinh").branches).toEqual(["Dần", "Mão"]);
    expect(getTriet("Nhâm").branches).toEqual(["Dần", "Mão"]);
    expect(getTriet("Mậu").branches).toEqual(["Tý", "Sửu"]);
    expect(getTriet("Quý").branches).toEqual(["Tý", "Sửu"]);
  });
});

describe("profile comparison — proves the Vietnamese adapter actually changes the chart (rule R)", () => {
  const input = { gender: "Nam" as const, calendarType: "solar" as const, day: 5, month: 7, year: 2000, time: "07:30" };

  it("iztro-default places Khoi/Viet at Suu/Mui for Canh; ngoc-am places them at Ngo/Dan", () => {
    const iztroDefault = generateChart(input, "iztro-default");
    const ngocAm = generateChart(input, "ngoc-am");

    expect(iztroDefault.yearStem).toBe("Canh");
    expect(ngocAm.yearStem).toBe("Canh");

    const iztroKhoiPalace = iztroDefault.palaces.find((p) => p.supportStars.some((s) => s.id === "tiankuiMin"));
    const ngocAmKhoiPalace = ngocAm.palaces.find((p) => p.supportStars.some((s) => s.id === "tiankuiMin"));

    expect(iztroKhoiPalace?.branch).toBe("Sửu");
    expect(ngocAmKhoiPalace?.branch).toBe("Ngọ");
  });
});

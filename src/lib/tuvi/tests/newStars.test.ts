import { describe, expect, it } from "vitest";
import { generateChart } from "../engine/chartEngine";
import { getDaoHoa, getDauQuan, getLuuNienVanTinh } from "../rules/namPhaiStars";
import type { BirthInput, EarthlyBranchVi, HeavenlyStemVi, VietnameseChartDTO } from "../types/VietnameseChart";

const BRANCHES: EarthlyBranchVi[] = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

function starIds(chart: VietnameseChartDTO, branch: EarthlyBranchVi): string[] {
  const p = chart.palaces.find((x) => x.branch === branch)!;
  return [...p.majorStars, ...p.supportStars, ...p.maleficStars, ...p.adjectiveStars].map((s) => s.id);
}

function find(chart: VietnameseChartDTO, id: string): EarthlyBranchVi[] {
  return chart.palaces
    .filter((p) => [...p.majorStars, ...p.supportStars, ...p.maleficStars, ...p.adjectiveStars].some((s) => s.id === id))
    .map((p) => p.branch);
}

describe("Dao Hoa — 4 tam-hop groups", () => {
  it("lands on Mao / Dau / Ngo / Ty by year branch group", () => {
    for (const b of ["Dần", "Ngọ", "Tuất"] as const) expect(getDaoHoa(b)).toBe("Mão");
    for (const b of ["Thân", "Tý", "Thìn"] as const) expect(getDaoHoa(b)).toBe("Dậu");
    for (const b of ["Tỵ", "Dậu", "Sửu"] as const) expect(getDaoHoa(b)).toBe("Ngọ");
    for (const b of ["Hợi", "Mão", "Mùi"] as const) expect(getDaoHoa(b)).toBe("Tý");
  });
});

describe("Dau Quan", () => {
  it("matches the worked example (1974 = year branch Dan, lunar month 8, hour Mui -> Dan)", () => {
    expect(getDauQuan("Dần", 8, 7)).toBe("Dần");
  });

  it("month 1 + hour Ty stays on the year-branch palace", () => {
    for (const b of BRANCHES) expect(getDauQuan(b, 1, 0)).toBe(b);
  });

  it("counts backward per month and forward per hour", () => {
    expect(getDauQuan("Tý", 2, 0)).toBe("Hợi");
    expect(getDauQuan("Tý", 1, 1)).toBe("Sửu");
  });
});

describe("Luu Nien Van Tinh — always 3 palaces after that stem's Loc Ton", () => {
  const locTon: Record<HeavenlyStemVi, EarthlyBranchVi> = {
    "Giáp": "Dần", "Ất": "Mão", "Bính": "Tỵ", "Đinh": "Ngọ", "Mậu": "Tỵ",
    "Kỷ": "Ngọ", "Canh": "Thân", "Tân": "Dậu", "Nhâm": "Hợi", "Quý": "Tý",
  };
  it("matches the 3-source table for all 10 stems", () => {
    for (const stem of Object.keys(locTon) as HeavenlyStemVi[]) {
      const lt = BRANCHES.indexOf(locTon[stem]);
      expect(getLuuNienVanTinh(stem)).toBe(BRANCHES[(lt + 3) % 12]);
    }
  });
});

describe("new stars on a real chart (05/07/2000 07:30 Nam, dương lịch)", () => {
  const input: BirthInput = { gender: "Nam", calendarType: "solar", day: 5, month: 7, year: 2000, time: "07:30" };
  const chart = generateChart(input, "ngoc-am");

  it("Thien La at Thin, Dia Vong at Tuat, each exactly once", () => {
    expect(find(chart, "thienLa")).toEqual(["Thìn"]);
    expect(find(chart, "diaVong")).toEqual(["Tuất"]);
  });

  it("Luu Nien Van Tinh (year stem Canh) at Hoi", () => {
    expect(find(chart, "luuNienVanTinh")).toEqual(["Hợi"]);
  });

  it("Dau Quan appears exactly once and Ham Tri (xianchi) is gone", () => {
    expect(find(chart, "dauQuan")).toHaveLength(1);
    for (const b of BRANCHES) expect(starIds(chart, b)).not.toContain("xianchi");
  });
});

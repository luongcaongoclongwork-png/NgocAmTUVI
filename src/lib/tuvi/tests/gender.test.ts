import { describe, expect, it } from "vitest";
import { generateChart } from "@/lib/tuvi/engine/chartEngine";
import { getOwnerChartViewModel } from "@/lib/tuvi/presentation/ownerViewModel";
import type { BirthInput } from "@/lib/tuvi/types/VietnameseChart";

const base = { calendarType: "solar", day: 1, month: 1, year: 2000, time: "12:00" } as const;
const chartFor = (gender: BirthInput["gender"]) => generateChart({ ...base, gender }, "ngoc-am");

/**
 * Gender never moves the 14 chinh tinh (they come from the birth data alone), so a
 * Nam chart and a Nu chart look alike at a glance. What it does change is the
 * direction of Dai Van, Truong Sinh and Bac Si. These tests pin that down, and the
 * view model carries the gender so Trung Cung can print it.
 */
describe("gender", () => {
  const nam = chartFor("Nam");
  const nu = chartFor("Nữ");
  const byBranch = (c: typeof nam, pick: (p: (typeof nam.palaces)[number]) => unknown) =>
    Object.fromEntries(c.palaces.map((p) => [p.branch, pick(p)]));

  it("keeps the same star positions for both genders", () => {
    const stars = (c: typeof nam) => c.palaces.map((p) => p.majorStars.map((s) => s.name).join(","));
    expect(stars(nam)).toEqual(stars(nu));
  });

  it("runs Dai Van, Truong Sinh and Bac Si in opposite directions", () => {
    expect(byBranch(nam, (p) => p.daiVan?.startAge)).not.toEqual(byBranch(nu, (p) => p.daiVan?.startAge));
    expect(byBranch(nam, (p) => p.changSinh)).not.toEqual(byBranch(nu, (p) => p.changSinh));
    expect(byBranch(nam, (p) => p.boshi)).not.toEqual(byBranch(nu, (p) => p.boshi));
  });

  it("exposes the gender on the chart and in the owner view model", () => {
    expect(nam.gender).toBe("Nam");
    expect(nu.gender).toBe("Nữ");
    expect(getOwnerChartViewModel(nam).gender).toBe("Nam");
    expect(getOwnerChartViewModel(nu).gender).toBe("Nữ");
  });
});

/**
 * Hoa Tinh / Linh Tinh and Thien Thuong / Thien Su against an independent
 * implementation of the Thai Thu Lang rules: lasotuvi (github.com/doanguyen/lasotuvi),
 * AmDuong.timHoaLinh() (direction = gender x year yin/yang) and App.lapDiaBan()
 * (Thuong in No Boc, Su in Tat Ach). Start palaces follow tuvi.vn, see below.
 */
describe("gender-dependent stars match lasotuvi", () => {
  const BR = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  const dich = (a: number, b: number) => ((((a - 1 + b) % 12) + 12) % 12) + 1;
  function lasotuviHoaLinh(chi: number, gio: number, gender: 1 | -1, amDuong: 1 | -1) {
    let kh: number, kl: number;
    if ([3, 7, 11].includes(chi)) [kh, kl] = [2, 4];
    else if ([1, 5, 9].includes(chi)) [kh, kl] = [3, 11];
    // lasotuvi has Mao/Tuat the other way round for Ty-Dau-Suu; tuvi.vn and tracuutuvi.com (docs/tuvi-engine-audit.md §7) start Hoa at Mao, Linh at Tuat.
    else if ([6, 10, 2].includes(chi)) [kh, kl] = [4, 11];
    else [kh, kl] = [10, 11];
    return gender * amDuong === -1 ? [dich(kh + 1, -gio), dich(kl - 1, gio)] : [dich(kh - 1, gio), dich(kl + 1, -gio)];
  }
  const branchOf = (c: ReturnType<typeof chartFor>, id: string) =>
    c.palaces.find((p) => [...p.supportStars, ...p.maleficStars, ...p.adjectiveStars].some((s) => s.id === id));

  const cases: { year: number; hour: number; gender: BirthInput["gender"] }[] = [];
  for (const year of [1984, 1985, 1990, 1993, 2000, 2003])
    for (let hour = 0; hour < 24; hour += 2)
      for (const gender of ["Nam", "Nữ"] as const) cases.push({ year, hour, gender });

  it.each(cases)("$year $hour:00 $gender", ({ year, hour, gender }) => {
    const c = generateChart({ calendarType: "solar", day: 15, month: 6, year, time: `${String(hour).padStart(2, "0")}:30`, gender }, "ngoc-am");
    const chi = BR.indexOf(c.yearBranch) + 1;
    const gio = BR.indexOf(c.hourBranch) + 1;
    const amDuong = chi % 2 === 1 ? 1 : -1;
    const [h, l] = lasotuviHoaLinh(chi, gio, gender === "Nam" ? 1 : -1, amDuong);
    expect(branchOf(c, "huoxingMin")?.branch).toBe(BR[h - 1]);
    expect(branchOf(c, "lingxingMin")?.branch).toBe(BR[l - 1]);
    expect(branchOf(c, "tianshang")?.name).toBe("Nô Bộc");
    expect(branchOf(c, "tianshi")?.name).toBe("Tật Ách");
  });
});

/** Thien Tru follows the Vietnamese table (lasotuvi maTranThienTru, tuvi.vn). Only year stem Quy differs from iztro: Hoi -> Tuat. */
describe("Thien Tru", () => {
  const cases: [number, string][] = [[1983, "Tuất"], [1993, "Tuất"], [2003, "Tuất"], [1985, "Ngọ"], [1990, "Dần"], [2000, "Dần"]];
  it.each(cases)("%i -> %s", (year, branch) => {
    const c = generateChart({ calendarType: "solar", day: 15, month: 6, year, time: "10:30", gender: "Nữ" }, "ngoc-am");
    expect(c.palaces.find((p) => p.adjectiveStars.some((s) => s.id === "tianchu"))?.branch).toBe(branch);
  });
});

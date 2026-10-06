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

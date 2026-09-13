import { describe, expect, it } from "vitest";
import { generateChart } from "../engine/chartEngine";
import type { PalaceNameVi, VietnameseChartDTO } from "../types/VietnameseChart";

/**
 * Golden benchmark: 05/07/2000 (duong lich) 07:30, gioi Nam, gio Thin.
 * Expected values transcribed from docs/tuvi-engine-audit.md section Q,
 * cross-referenced against tuvidausotoanthu.vn / tuvi.vn. Per rule X.2, this
 * date is ONLY used as a test input — nothing in src/lib/tuvi is keyed off it.
 */
const dto: VietnameseChartDTO = generateChart(
  { gender: "Nam", calendarType: "solar", day: 5, month: 7, year: 2000, time: "07:30" },
  "ngoc-am",
);

function palace(name: PalaceNameVi) {
  const p = dto.palaces.find((x) => x.name === name);
  if (!p) throw new Error(`Palace not found: ${name}`);
  return p;
}

function majorNames(p: ReturnType<typeof palace>) {
  return p.majorStars.map((s) => s.name).sort();
}

describe("golden chart 05/07/2000 07:30 Nam", () => {
  it("Menh: Ky Mao, Thien Phu Binh", () => {
    const p = palace("Mệnh");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Kỷ Mão");
    expect(majorNames(p)).toEqual(["Thiên Phủ"]);
    expect(p.majorStars[0].brightness).toBe("B");
  });

  it("Phu Mau: Canh Thin, Thai Am Ham + Hoa Khoa", () => {
    const p = palace("Phụ Mẫu");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Canh Thìn");
    const taiAm = p.majorStars.find((s) => s.name === "Thái Âm")!;
    expect(taiAm.brightness).toBe("H");
    expect(taiAm.transformation).toBe("Khoa");
  });

  it("Phuc Duc: Tan Ty, Liem Trinh Ham + Tham Lang Ham", () => {
    const p = palace("Phúc Đức");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Tân Tỵ");
    expect(majorNames(p)).toEqual(["Liêm Trinh", "Tham Lang"]);
    expect(p.majorStars.find((s) => s.name === "Liêm Trinh")!.brightness).toBe("H");
    expect(p.majorStars.find((s) => s.name === "Tham Lang")!.brightness).toBe("H");
  });

  it("Dien Trach: Nham Ngo, Cu Mon Vuong + Thien Khoi tai Ngo", () => {
    const p = palace("Điền Trạch");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Nhâm Ngọ");
    expect(p.majorStars.find((s) => s.name === "Cự Môn")!.brightness).toBe("V");
    expect(p.supportStars.some((s) => s.id === "tiankuiMin")).toBe(true);
  });

  it("Quan Loc: Quy Mui, Thien Tuong Dac", () => {
    const p = palace("Quan Lộc");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Quý Mùi");
    expect(p.majorStars.find((s) => s.name === "Thiên Tướng")!.brightness).toBe("Đ");
  });

  it("No Boc: Giap Than, Thien Dong Mieu + Thien Luong Vuong, Thien Dong Hoa Ky", () => {
    const p = palace("Nô Bộc");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Giáp Thân");
    const thienDong = p.majorStars.find((s) => s.name === "Thiên Đồng")!;
    expect(thienDong.brightness).toBe("M");
    expect(thienDong.transformation).toBe("Kỵ");
    expect(p.majorStars.find((s) => s.name === "Thiên Lương")!.brightness).toBe("V");
  });

  it("Thien Di: At Dau, Vu Khuc Dac + That Sat Ham, Vu Khuc Hoa Quyen", () => {
    const p = palace("Thiên Di");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Ất Dậu");
    const vuKhuc = p.majorStars.find((s) => s.name === "Vũ Khúc")!;
    expect(vuKhuc.brightness).toBe("Đ");
    expect(vuKhuc.transformation).toBe("Quyền");
    expect(p.majorStars.find((s) => s.name === "Thất Sát")!.brightness).toBe("H");
  });

  it("Tat Ach: Binh Tuat, Thai Duong Ham + Hoa Loc", () => {
    const p = palace("Tật Ách");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Bính Tuất");
    const thaiDuong = p.majorStars.find((s) => s.name === "Thái Dương")!;
    expect(thaiDuong.brightness).toBe("H");
    expect(thaiDuong.transformation).toBe("Lộc");
  });

  it("Tai Bach: Dinh Hoi, Vo Chinh Dieu, Than cu Tai Bach", () => {
    const p = palace("Tài Bạch");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Đinh Hợi");
    expect(p.majorStars).toHaveLength(0);
    expect(p.isBodyPalace).toBe(true);
    expect(dto.bodyPalaceBranch).toBe("Hợi");
  });

  it("Tu Tuc: Mau Ty, Thien Co Dac", () => {
    const p = palace("Tử Tức");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Mậu Tý");
    expect(p.majorStars.find((s) => s.name === "Thiên Cơ")!.brightness).toBe("Đ");
  });

  it("Phu The: Ky Suu, Tu Vi Dac + Pha Quan Vuong", () => {
    const p = palace("Phu Thê");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Kỷ Sửu");
    expect(p.majorStars.find((s) => s.name === "Tử Vi")!.brightness).toBe("Đ");
    expect(p.majorStars.find((s) => s.name === "Phá Quân")!.brightness).toBe("V");
  });

  it("Huynh De: Mau Dan, Vo Chinh Dieu + Thien Viet tai Dan", () => {
    const p = palace("Huynh Đệ");
    expect(`${p.heavenlyStem} ${p.branch}`).toBe("Mậu Dần");
    expect(p.majorStars).toHaveLength(0);
    expect(p.supportStars.some((s) => s.id === "tianyueMin")).toBe(true);
  });

  it("Menh Chu / Than Chu / Lai Nhan Cung", () => {
    expect(dto.menhChu).toBe("Liêm Trinh");
    expect(dto.thanChu).toBe("Văn Xương");
    expect(dto.laiNhanCung).toBe("Phụ Mẫu");
  });

  it("Tuan: Than-Dau, Triet: Ngo-Mui", () => {
    expect(dto.tuan.branches).toEqual(["Thân", "Dậu"]);
    expect(dto.triet.branches).toEqual(["Ngọ", "Mùi"]);
  });

  it("no unverified brightness cells on this chart (all 14 chinh tinh covered)", () => {
    // Minor stars (sat tinh / Van Xuong / Van Khuc) are only spot-verified for a
    // handful of (star, branch) pairs so far (see MINOR_STAR_BRIGHTNESS_VI) —
    // this chart is expected to still hit some unverified minor-star cells.
    // Only the 14 major stars are asserted fully covered here.
    const majorNameIds = new Set(dto.palaces.flatMap((p) => p.majorStars.map((s) => s.id)));
    const unverifiedMajor = dto.unverifiedBrightnessEntries.filter((e) => majorNameIds.has(e.starId));
    expect(unverifiedMajor).toEqual([]);
  });
});

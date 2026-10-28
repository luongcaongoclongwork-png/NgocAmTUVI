import { Solar } from "lunar-typescript";
import { describe, expect, it } from "vitest";
import { addDays, BRANCHES, chonNgay, nienHan, ngay, quanHe, THAN, TRUC, VIEC, ymd } from "./xuyen-nhat";

describe("the sample table of the document, 18–25/10/2026 (tháng Tuất)", () => {
  // Dương lịch | Âm lịch | Can chi | Trực | Tú | Thần | Loại | Ngày kỵ
  const rows: [number, string, string, string, string, string, boolean, string[]][] = [
    [18, "9/9", "Ất Sửu", "Bình", "Phòng", "Nguyên Vũ", false, []],
    [19, "10/9", "Bính Dần", "Định", "Tâm", "Tư Mệnh", true, []],
    [20, "11/9", "Đinh Mão", "Chấp", "Vĩ", "Câu Trần", false, []],
    [21, "12/9", "Mậu Thìn", "Phá", "Cơ", "Thanh Long", true, ["Nguyệt Liệt"]],
    [22, "13/9", "Kỷ Tỵ", "Nguy", "Đẩu", "Minh Đường", true, ["Tam Nương"]],
    [23, "14/9", "Canh Ngọ", "Thành", "Ngưu", "Thiên Hình", false, ["Nguyệt Kỵ"]],
    [24, "15/9", "Tân Mùi", "Thu", "Nữ", "Chu Tước", false, []],
    [25, "16/9", "Nhâm Thân", "Khai", "Hư", "Kim Quỹ", true, []],
  ];
  it.each(rows)("%i/10", (d, am, canChi, truc, tu, than, minh, ky) => {
    const n = ngay(ymd(2026, 10, d));
    expect(`${n.am.d}/${n.am.m}`).toBe(am);
    expect(n.canChi).toBe(canChi);
    expect(TRUC[n.truc].goc).toBe(truc);
    expect(n.tu.ten).toBe(tu);
    expect(n.than.ten).toBe(than);
    expect(n.than.minh).toBe(minh);
    const all = [...(n.nguyetLiet ? ["Nguyệt Liệt"] : []), ...n.ky];
    expect(all).toEqual(ky);
  });
  it("Dần day 19/10 has Minh Khám hours Tý, Sửu, Thìn, Tỵ, Mùi, Tuất", () => {
    expect(ngay(ymd(2026, 10, 19)).gioMinh.map((h) => BRANCHES[h])).toEqual(["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"]);
  });
});

describe("the document's worked example: ký kết, Chủ Sự tuổi Thân, 18–25/10/2026", () => {
  const viec = VIEC.find((v) => v.id === "ky-ket")!;
  const r = chonNgay(ymd(2026, 10, 18), ymd(2026, 10, 25), viec, [{ ten: "Chủ Sự", namSinh: 1980 }]); // Canh Thân
  const of = (d: number) => r.all.find((k) => k.info.date.d === d)!;
  it("sets aside 19/10 (Đối Khám) and 21/10 (Nguyệt Liệt)", () => {
    expect(of(19).loai).toEqual(["Đối Khám tuổi Chủ Sự"]);
    expect(of(21).loai).toEqual(["Nguyệt Liệt"]);
  });
  it("offers 23/10 (Thành fits, but Nguyệt Kỵ) and 25/10 (least hit, Kim Quỹ)", () => {
    const top = r.chon.map((k) => k.info.date.d);
    expect(top.slice(0, 2).sort()).toEqual([23, 25]);
    expect(of(25).loai).toEqual([]);
    expect(of(23).info.ky).toEqual(["Nguyệt Kỵ"]);
  });
});

describe("relations and niên hạn", () => {
  it("knows xung, tam hợp, lục hợp, hình, hại", () => {
    expect(quanHe(2, 8).xung).toBe(true); // Dần–Thân
    expect(quanHe(0, 4).hopChieu).toBe(true); // Tý–Thìn
    expect(quanHe(5, 8).amThong).toBe(true); // Tỵ–Thân
    expect(quanHe(5, 8).hinh).toBe(true); // Dần–Tỵ–Thân
    expect(quanHe(6, 6).hinh).toBe(true); // Ngọ tự hình
    expect(quanHe(9, 10).hai).toBe(true); // Dậu–Tuất
  });
  it("counts tuổi mụ, Kim Lâu, Hoang Ốc, Tam Tai, Thái Tuế", () => {
    const h = nienHan(1990, 2026); // Canh Ngọ, 37 tuổi mụ
    expect(h.tuoiMu).toBe(37);
    expect(h.kimLau).toBe("Kim Lâu Thân"); // 37 % 9 = 1
    expect(h.hoangOc.ten).toBe("Tứ Tấn Tài");
    expect(h.tamTai).toBe(false); // Ngọ: Thân, Dậu, Tuất
    expect(h.thaiTue).toBe(true); // a Ngọ person in the Bính Ngọ year 2026
    expect(nienHan(1979, 2026).thaiTue).toBe(false); // Kỷ Mùi
    expect(nienHan(1992, 2024).tamTai).toBe(true); // Nhâm Thân in the Giáp Thìn year 2024
  });
});

describe("cross-check with lunar-typescript, every day of 2025–2027", () => {
  const ZX = "建除满平定执破危成收开闭";
  const XIU: Record<string, string> = { 角: "Giác", 亢: "Cang", 氐: "Đê", 房: "Phòng", 心: "Tâm", 尾: "Vĩ", 箕: "Cơ", 斗: "Đẩu", 牛: "Ngưu", 女: "Nữ", 虚: "Hư", 危: "Nguy", 室: "Thất", 壁: "Bích", 奎: "Khuê", 娄: "Lâu", 胃: "Vị", 昴: "Mão", 毕: "Tất", 觜: "Chủy", 参: "Sâm", 井: "Tỉnh", 鬼: "Quỷ", 柳: "Liễu", 星: "Tinh", 张: "Trương", 翼: "Dực", 轸: "Chẩn" };
  const SHEN: Record<string, string> = { 青龙: "Thanh Long", 明堂: "Minh Đường", 天刑: "Thiên Hình", 朱雀: "Chu Tước", 金匮: "Kim Quỹ", 天德: "Thiên Đức", 白虎: "Bạch Hổ", 玉堂: "Ngọc Đường", 天牢: "Thiên Lao", 玄武: "Nguyên Vũ", 司命: "Tư Mệnh", 勾陈: "Câu Trần" };
  it("matches the trực, tú, thần and Minh Khám hours (trực may differ only where Vietnam time moves a solar term to another day)", () => {
    let d = ymd(2025, 1, 1);
    const trucDiff: string[] = [];
    for (let i = 0; i < 365 * 3; i++, d = addDays(d, 1)) {
      const n = ngay(d);
      const l = Solar.fromYmd(d.y, d.m, d.d).getLunar();
      expect(n.tu.ten).toBe(XIU[l.getXiu()]);
      expect(THAN.findIndex((t) => t.ten === n.than.ten) >= 0).toBe(true);
      if (TRUC[n.truc].goc !== TRUC[ZX.indexOf(l.getZhiXing())].goc) trucDiff.push(`${d.y}-${d.m}-${d.d}`);
      else expect(n.than.ten).toBe(SHEN[l.getDayTianShen()]);
      // the library lists a 13th, late Tý hour (23–24) that belongs to the next day; the document gives Tý (23–1) to this day
      const minh = l.getTimes().slice(0, 12).filter((t) => t.getTianShenType() === "黄道").map((t) => "子丑寅卯辰巳午未申酉戌亥".indexOf(t.getZhi()));
      expect([...new Set(minh)].sort((a, b) => a - b)).toEqual([...n.gioMinh].sort((a, b) => a - b));
    }
    // a solar term that falls between 23:00 and 24:00 Vietnam time opens the month a day earlier than in China
    expect(trucDiff.length).toBeLessThanOrEqual(3);
  });
});

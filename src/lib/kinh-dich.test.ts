import { describe, expect, it } from "vitest";
import { castLine, decodeCast, encodeCast, HEXAGRAMS, hexagramByNumber, hexagramOf, lapQue, lineFromBacks, TRIGRAMS } from "./kinh-dich";

const still = (lines: number[]) => lines.map((h) => ({ hao: h as 0 | 1, dong: false }));

describe("data", () => {
  it("has 64 distinct hexagrams whose lines match their two trigrams", () => {
    expect(HEXAGRAMS).toHaveLength(64);
    expect(new Set(HEXAGRAMS.map((q) => q.hao.join(""))).size).toBe(64);
    const t = Object.fromEntries(TRIGRAMS.map((x) => [x.ten, x.hao.join("")]));
    for (const q of HEXAGRAMS) expect(q.hao.join("")).toBe(t[q.quai_duoi] + t[q.quai_tren]);
  });
});

describe("casting", () => {
  it("maps backs to lines as the table says", () => {
    expect(lineFromBacks(1)).toMatchObject({ tong: 7, hao: 1, dong: false });
    expect(lineFromBacks(2)).toMatchObject({ tong: 8, hao: 0, dong: false });
    expect(lineFromBacks(3)).toMatchObject({ tong: 9, hao: 1, dong: true });
    expect(lineFromBacks(0)).toMatchObject({ tong: 6, hao: 0, dong: true });
  });
  it("casts from the random source", () => {
    expect(castLine(() => 0.1).lung).toBe(3);
    expect(castLine(() => 0.9).lung).toBe(0);
  });
  it("round-trips a share code", () => {
    const c = decodeCast("789678")!;
    expect(encodeCast(c)).toBe("789678");
    expect(decodeCast("123")).toBeNull();
  });
});

describe("reading", () => {
  it("finds the main hexagram and its trigrams", () => {
    const r = lapQue(still([1, 1, 1, 0, 0, 0])); // Địa Thiên Thái
    expect(r.hien.so).toBe(11);
    expect(r.noiKham.ten).toBe("Càn");
    expect(r.ngoaiKham.ten).toBe("Khôn");
    expect(r.hoa).toBeNull();
    expect(r.read.que).toBe("hien");
  });
  it("builds the nuclear hexagram from lines 2-4 and 3-5", () => {
    // Càn's nucleus is Càn; Thái (111000): lower 110 = Đoài, upper 100 = Chấn -> Lôi Trạch Quy Muội (54)
    expect(lapQue(still([1, 1, 1, 1, 1, 1])).noi.so).toBe(1);
    expect(lapQue(still([1, 1, 1, 0, 0, 0])).noi.so).toBe(54);
  });
  it("changes moving lines into the changed hexagram", () => {
    const casts = [1, 1, 1, 1, 1, 1].map((h, i) => ({ hao: h as 0 | 1, dong: i === 0 }));
    const r = lapQue(casts);
    expect(r.hien.so).toBe(1);
    expect(r.hoa?.so).toBe(hexagramOf([0, 1, 1, 1, 1, 1]).so); // Thiên Phong Cấu (44)
    expect(r.hoa?.so).toBe(44);
    expect(r.moving).toEqual([1]);
    expect(r.read.nac).toEqual([1]);
  });
  it("follows Chu Hy for every count of moving lines", () => {
    const at = (moving: number[]) => lapQue([0, 1, 0, 1, 0, 1].map((h, i) => ({ hao: h as 0 | 1, dong: moving.includes(i + 1) })));
    expect(at([]).read.que).toBe("hien");
    expect(at([2, 5]).read).toMatchObject({ que: "hien", nac: [5, 2] });
    expect(at([1, 3, 6]).read.que).toBe("ca-hai");
    expect(at([1, 2, 3, 4]).read).toMatchObject({ que: "hoa", nac: [5, 6] });
    expect(at([1, 2, 3, 4, 6]).read).toMatchObject({ que: "hoa", nac: [5] });
    expect(at([1, 2, 3, 4, 5, 6]).read.que).toBe("hoa");
  });
  it("names Dụng Cửu when all six lines of Càn move", () => {
    const r = lapQue([1, 1, 1, 1, 1, 1].map((h) => ({ hao: h as 0 | 1, dong: true })));
    expect(r.read.loi).toBe("Dụng Cửu của Càn");
    expect(r.hoa?.so).toBe(2);
  });
  it("gives Thể–Dụng only with exactly one moving line", () => {
    // Thái with nấc 1 moving: Dụng = lower Càn (Kim), Thể = upper Khôn (Thổ); Thổ sinh Kim -> Thể sinh Dụng
    const r = lapQue([1, 1, 1, 0, 0, 0].map((h, i) => ({ hao: h as 0 | 1, dong: i === 0 })));
    expect(r.theDung?.ma).toBe("the_sinh_dung");
    expect(r.theDung?.dung.ten).toBe("Càn");
    expect(lapQue([1, 1, 1, 0, 0, 0].map((h, i) => ({ hao: h as 0 | 1, dong: i < 2 }))).theDung).toBeNull();
  });
  it("reads the change of flame between the two hexagrams", () => {
    const r = lapQue([1, 1, 1, 1, 1, 1].map((h, i) => ({ hao: h as 0 | 1, dong: i === 0 })));
    expect(hexagramByNumber(1)?.diem_ma).toBe("BOI_QUANG");
    expect(r.chuyenDiem).toBe("Thu ánh sáng về, lui vào âm thầm"); // Cấu is Nhiên đăng
  });
});

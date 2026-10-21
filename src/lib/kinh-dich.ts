import data from "@/data/kinh-dich-xtd.json";

/**
 * Kinh Dịch Xuyên Tam Diệm: casting and reading a hexagram from the owner's data file (src/data/kinh-dich-xtd.json).
 * Only the names change; the rules of casting, building and reading the hexagram are the classical ones.
 * A line array always runs from the bottom (index 0, nấc 1) to the top (index 5, nấc 6); 1 = dương, 0 = âm.
 */

export type Hao = 0 | 1;
export type Trigram = (typeof data.bat_quai)[number];
export type Hexagram = (typeof data.que64)[number];
export type Kham = (typeof data.kham12)[number];

export const META = data.meta;
export const TERMS = data.thuat_ngu;
export const TRIGRAMS = data.bat_quai;
export const HEXAGRAMS = data.que64;
export const KHAM12 = data.kham12;

const key = (h: readonly number[]) => h.join("");
const byLines = new Map(HEXAGRAMS.map((q) => [key(q.hao), q]));
const trigramByLines = new Map(TRIGRAMS.map((t) => [key(t.hao), t]));
const trigramByName = new Map(TRIGRAMS.map((t) => [t.ten, t]));

export function hexagramOf(lines: readonly number[]): Hexagram {
  const q = byLines.get(key(lines));
  if (!q) throw new Error(`no hexagram for ${key(lines)}`);
  return q;
}
export const hexagramByNumber = (so: number) => HEXAGRAMS.find((q) => q.so === so);
export const trigram = (name: string) => trigramByName.get(name)!;
export const trigramOf = (lines: readonly number[]) => trigramByLines.get(key(lines))!;

/** One cast of three coins: the number of backs (mặt lưng) gives the line and whether it moves. */
export type Cast = { lung: number; tong: number; hao: Hao; dong: boolean };
export function lineFromBacks(lung: number): Cast {
  const row = data.gieo.bang.find((r) => r.mat_lung === lung);
  if (!row) throw new Error(`backs out of range: ${lung}`);
  return { lung, tong: row.tong, hao: row.hao as Hao, dong: row.dong };
}
/** Three fair coins; `random` returns 0..1 (crypto in the browser, seeded in tests). */
export function castLine(random: () => number): Cast {
  let lung = 0;
  for (let i = 0; i < 3; i++) if (random() < 0.5) lung++;
  return lineFromBacks(lung);
}

export type TheDung = { ma: string; ten: string; y: string; the: Trigram; dung: Trigram };
export type Reading = {
  hien: Hexagram; // quẻ chủ
  hoa: Hexagram | null; // quẻ biến (null when no line moves)
  noi: Hexagram; // quẻ hỗ
  lines: Hao[];
  moving: number[]; // 1-based nấc of the moving lines, bottom first
  noiKham: Trigram; // lower trigram
  ngoaiKham: Trigram; // upper trigram
  read: { que: "hien" | "hoa" | "ca-hai"; loi: string; nac: number[] };
  chuyenDiem: string | null;
  theDung: TheDung | null;
};

/** Owner-approved wording (2026-10-17): the classical good/bad verdicts said calmly, without fear. */
const THE_DUNG_LOI: Record<string, string> = {
  dung_sinh_the: "Được nâng đỡ: hoàn cảnh đang tiếp sức cho bạn.",
  ty_hoa: "Cùng một hành: bên trong và bên ngoài đang thuận nhau.",
  the_khac_dung: "Làm được, nhưng sẽ tốn sức: nên tính trước sức mình.",
  the_sinh_dung: "Bạn đang cho đi nhiều hơn nhận về: giữ sức, đừng dàn trải.",
  dung_khac_the: "Thế đang ngược với bạn: nên chậm lại và xem xét kỹ trước khi làm.",
};

function theDungOf(lines: Hao[], movingIdx: number): TheDung {
  const lower = trigramOf(lines.slice(0, 3)), upper = trigramOf(lines.slice(3, 6));
  const [dung, the] = movingIdx < 3 ? [lower, upper] : [upper, lower];
  const { sinh, khac } = data.ngu_hanh as { sinh: Record<string, string>; khac: Record<string, string> };
  const t = the.ngu_hanh, d = dung.ngu_hanh;
  const ma = t === d ? "ty_hoa" : sinh[d] === t ? "dung_sinh_the" : sinh[t] === d ? "the_sinh_dung" : khac[t] === d ? "the_khac_dung" : "dung_khac_the";
  const row = data.the_dung.find((r) => r.ma === ma)!;
  return { ma, ten: row.ten, y: THE_DUNG_LOI[ma], the, dung };
}

function readingRule(hien: Hexagram, moving: number[], all: number[]): Reading["read"] {
  const n = moving.length;
  const rule = data.quy_tac_chu_hy.find((r) => r.so_hao_dong === n)!;
  const still = all.filter((x) => !moving.includes(x));
  const que = rule.doc_que === "quẻ chủ" ? "hien" : rule.doc_que === "quẻ biến" ? "hoa" : "ca-hai";
  const nac = n === 1 ? moving : n === 2 ? [Math.max(...moving), Math.min(...moving)] : n === 4 ? [Math.min(...still), Math.max(...still)] : n === 5 ? still : [];
  let loi = rule.doc_loi;
  if (n === 6 && (hien.so === 1 || hien.so === 2)) loi = hien.so === 1 ? "Dụng Cửu của Càn" : "Dụng Lục của Khôn";
  return { que, loi, nac };
}

/** Builds the full reading from six cast lines (bottom first). */
export function lapQue(casts: readonly Pick<Cast, "hao" | "dong">[]): Reading {
  if (casts.length !== 6) throw new Error("a hexagram needs six lines");
  const lines = casts.map((c) => c.hao) as Hao[];
  const moving = casts.flatMap((c, i) => (c.dong ? [i + 1] : []));
  const hien = hexagramOf(lines);
  const changed = lines.map((h, i) => (casts[i].dong ? ((1 - h) as Hao) : h));
  const hoa = moving.length ? hexagramOf(changed) : null;
  // nội bích: lower trigram from nấc 2..4, upper from nấc 3..5
  const noi = hexagramOf([...lines.slice(1, 4), ...lines.slice(2, 5)]);
  const chuyen = data.chuyen_diem as Record<string, string>;
  const chuyenDiem = hoa ? (hoa.diem_ma === hien.diem_ma ? chuyen.same : chuyen[`${hien.diem_ma}>${hoa.diem_ma}`] ?? null) : null;
  return {
    hien, hoa, noi, lines, moving,
    noiKham: trigramOf(lines.slice(0, 3)),
    ngoaiKham: trigramOf(lines.slice(3, 6)),
    read: readingRule(hien, moving, [1, 2, 3, 4, 5, 6]),
    chuyenDiem,
    theDung: moving.length === 1 ? theDungOf(lines, moving[0] - 1) : null,
  };
}

/** A shareable code for a cast: 6 digits bottom first, 6=old yin, 7=young yang, 8=young yin, 9=old yang. */
export const encodeCast = (casts: readonly Cast[]) => casts.map((c) => c.tong).join("");
export function decodeCast(code: string): Cast[] | null {
  if (!/^[6-9]{6}$/.test(code)) return null;
  const lungByTong: Record<string, number> = { "7": 1, "8": 2, "9": 3, "6": 0 };
  return [...code].map((d) => lineFromBacks(lungByTong[d]));
}

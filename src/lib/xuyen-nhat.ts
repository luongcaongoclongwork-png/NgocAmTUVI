import { Solar } from "lunar-typescript";

/**
 * Xuyên Nhật (川日): choosing a day the Ngọc Âm way, from "Xuyên Nhật · Bảng kiến thức Trạch nhật" (@Trang, 2026-10-19).
 * The traditional Trạch nhật rules are kept as they are; only the names follow Xuyên Tam Diệm.
 * Order of judgement (part IV): chất vách (solar-term month, day can chi) → hard filters (Nguyệt Liệt, Liệt Bích,
 * Đối Khám with the Chủ Sự's age) → trực fitting the work → Minh Khám and tú → Hợp Chiếu / Ám Thông → hours.
 * Conventions not yet fixed by the owner follow the document as written ("quy ước tạm", owner 2026-10-22).
 *
 * lunar-typescript supplies the day's can chi, the lunar date and the solar-term instants (computed for UTC+8);
 * the month boundaries are moved to Vietnam time (UTC+7) here, as part V of the document asks.
 */

export const BRANCHES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"] as const;
export const STEMS = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;
const ZH_BRANCH = "子丑寅卯辰巳午未申酉戌亥";
const ZH_STEM = "甲乙丙丁戊己庚辛壬癸";

export type Diem = "nhien-dang" | "boi-quang" | "do-ty";
export const DIEM_TEN: Record<Diem, string> = { "nhien-dang": "Nhiên đăng", "boi-quang": "Bối quang", "do-ty": "Đồ tỳ" };
export const DIEM_Y: Record<Diem, string> = {
  "nhien-dang": "Ngày ổn, giữ, nuôi. Không cần rực rỡ, cần bền.",
  "boi-quang": "Ngày sáng, hiển bày. Việc cần được nhìn thấy.",
  "do-ty": "Ngày phá, dứt. Việc cần đập vỡ cái cũ.",
};

/** Thập Nhị Công: the 12 trực, in order from Kiến. hop/ky are the document's "việc hợp / việc kỵ" columns. */
export const TRUC = [
  { goc: "Kiến", ten: "Khai Sơn", diem: "boi-quang", hop: "Xuất hành, nhậm chức, khởi sự nhẹ", ky: "Động thổ, đào đất, an táng" },
  { goc: "Trừ", ten: "Phất Trần", diem: "do-ty", hop: "Dọn dẹp, trừ bệnh, tế lễ giải trừ", ky: "Cưới hỏi, xuất hành xa" },
  { goc: "Mãn", ten: "Doanh Bát", diem: "boi-quang", hop: "Xuất hành, buôn bán, nhập kho, cầu tài", ky: "Động thổ, an táng, kiện tụng" },
  { goc: "Bình", ten: "Trát Bích", diem: "nhien-dang", hop: "Sửa chữa, san nền, việc nhỏ quen thuộc", ky: "Việc lớn cần nổi bật" },
  { goc: "Định", ten: "Định Tượng", diem: "nhien-dang", hop: "Cưới hỏi, ký kết, mua bán nhà đất, nhập học", ky: "Kiện tụng, tranh chấp" },
  { goc: "Chấp", ten: "Chấp Bút", diem: "nhien-dang", hop: "Xây cất, lập kế chắc, bắt giữ, giữ chặt", ky: "Xuất hành, dọn nhà" },
  { goc: "Phá", ten: "Đục Bích", diem: "do-ty", hop: "Phá dỡ, chữa bệnh, cắt bỏ", ky: "Khai trương, cưới hỏi, mọi việc dựng" },
  { goc: "Nguy", ten: "Huyền Nhai", diem: "do-ty", hop: "Cầu an, việc cẩn thận", ky: "Leo cao, xuất hành xa, việc mạo hiểm" },
  { goc: "Thành", ten: "Hoàn Họa", diem: "boi-quang", hop: "Khai trương, cưới hỏi, xây dựng, ký kết, nhập học", ky: "Kiện tụng" },
  { goc: "Thu", ten: "Thu Kinh", diem: "nhien-dang", hop: "Thu nợ, thu hoạch, nhập kho", ky: "Xuất hành, an táng" },
  { goc: "Khai", ten: "Khai Quang", diem: "boi-quang", hop: "Khai trương, xuất hành, khởi công, khai thông", ky: "An táng" },
  { goc: "Bế", ten: "Phong Quật", diem: "do-ty", hop: "Lấp, đắp, đóng lại, kết thúc", ky: "Khởi sự, khai trương, xuất hành" },
] as const satisfies readonly { goc: string; ten: string; diem: Diem; hop: string; ky: string }[];

/** Nhị thập bát tú in the document's order (Đông, Bắc, Tây, Nam), each with its diệu. */
const TU_TEN = ["Giác", "Cang", "Đê", "Phòng", "Tâm", "Vĩ", "Cơ", "Đẩu", "Ngưu", "Nữ", "Hư", "Nguy", "Thất", "Bích", "Khuê", "Lâu", "Vị", "Mão", "Tất", "Chủy", "Sâm", "Tỉnh", "Quỷ", "Liễu", "Tinh", "Trương", "Dực", "Chẩn"] as const;
const DIEU = ["Mộc", "Kim", "Thổ", "Nhật", "Nguyệt", "Hỏa", "Thủy"] as const; // the seven, in each direction's order
/** Nhật, Thổ → Bối quang; Nguyệt, Mộc, Thủy → Nhiên đăng; Kim, Hỏa → Đồ tỳ (part II). */
const DIEU_DIEM: Record<(typeof DIEU)[number], Diem> = { Nhật: "boi-quang", Thổ: "boi-quang", Nguyệt: "nhien-dang", Mộc: "nhien-dang", Thủy: "nhien-dang", Kim: "do-ty", Hỏa: "do-ty" };
const TU_ANCHOR = { y: 2026, m: 10, d: 19, index: 4 }; // Monday 19/10/2026 is Tâm

/** Twelve thần; Minh Khám = hoàng đạo. */
export const THAN = [
  { ten: "Thanh Long", minh: true }, { ten: "Minh Đường", minh: true }, { ten: "Thiên Hình", minh: false }, { ten: "Chu Tước", minh: false },
  { ten: "Kim Quỹ", minh: true }, { ten: "Thiên Đức", minh: true }, { ten: "Bạch Hổ", minh: false }, { ten: "Ngọc Đường", minh: true },
  { ten: "Thiên Lao", minh: false }, { ten: "Nguyên Vũ", minh: false }, { ten: "Tư Mệnh", minh: true }, { ten: "Câu Trần", minh: false },
] as const;
/** Where Thanh Long starts, by month branch: Dần/Thân → Tý, Mão/Dậu → Dần, Thìn/Tuất → Thìn, Tỵ/Hợi → Ngọ, Ngọ/Tý → Thân, Mùi/Sửu → Tuất. */
const THANH_LONG_START = [8, 10, 0, 2, 4, 6, 8, 10, 0, 2, 4, 6];
/** The six Minh Khám hours by day branch (part II, "Giờ Minh Khám"). */
const GIO_MINH: number[][] = [
  [0, 1, 3, 6, 8, 9], [2, 3, 5, 8, 10, 11], [0, 1, 4, 5, 7, 10], [0, 2, 3, 6, 7, 9], [2, 4, 5, 8, 9, 11], [1, 4, 6, 7, 10, 11],
  [0, 1, 3, 6, 8, 9], [2, 3, 5, 8, 10, 11], [0, 1, 4, 5, 7, 10], [0, 2, 3, 6, 7, 9], [2, 4, 5, 8, 9, 11], [1, 4, 6, 7, 10, 11],
];
export const GIO_KHOANG = ["23–1", "1–3", "3–5", "5–7", "7–9", "9–11", "11–13", "13–15", "15–17", "17–19", "19–21", "21–23"];

/* ---------- the person: Bản Khám and its relations ---------- */
const TAM_HOP = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]];
const LUC_HOP: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
const HINH_GROUPS = [[2, 5, 8], [1, 10, 7], [0, 3]];
const TU_HINH = [4, 6, 9, 11];
const HAI: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
const pair = (list: [number, number][], a: number, b: number) => list.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

export type Quan = { xung: boolean; hopChieu: boolean; amThong: boolean; hinh: boolean; hai: boolean };
export function quanHe(ngay: number, tuoi: number): Quan {
  return {
    xung: (ngay - tuoi + 12) % 12 === 6,
    hopChieu: ngay !== tuoi && TAM_HOP.some((g) => g.includes(ngay) && g.includes(tuoi)),
    amThong: pair(LUC_HOP, ngay, tuoi),
    hinh: (ngay === tuoi && TU_HINH.includes(ngay)) || (ngay !== tuoi && HINH_GROUPS.some((g) => g.includes(ngay) && g.includes(tuoi))),
    hai: pair(HAI, ngay, tuoi),
  };
}
/** The branch of a lunar birth year (Giáp Tý = 1984 → Tý). */
export const chiOfYear = (lunarYear: number) => (((lunarYear - 4) % 12) + 12) % 12;
export const canChiOfYear = (lunarYear: number) => `${STEMS[(((lunarYear - 4) % 10) + 10) % 10]} ${BRANCHES[chiOfYear(lunarYear)]}`;

/** Niên hạn for a lunar birth year in a given (lunar) year: tuổi mụ, Kim Lâu, Hoang Ốc, Tam Tai, Thái Tuế (Đương Khám). */
const HOANG_OC = [
  { ten: "Nhất Kiết", tot: true }, { ten: "Nhị Nghi", tot: true }, { ten: "Tam Địa Sát", tot: false },
  { ten: "Tứ Tấn Tài", tot: true }, { ten: "Ngũ Thọ Tử", tot: false }, { ten: "Lục Hoang Ốc", tot: false },
];
const KIM_LAU: Record<number, string> = { 1: "Kim Lâu Thân", 3: "Kim Lâu Thê", 6: "Kim Lâu Tử", 8: "Kim Lâu Lục Súc" };
const TAM_TAI: [number[], number[]][] = [[[8, 0, 4], [2, 3, 4]], [[5, 9, 1], [11, 0, 1]], [[2, 6, 10], [8, 9, 10]], [[11, 3, 7], [5, 6, 7]]];
export function nienHan(birthLunarYear: number, lunarYear: number) {
  const tuoiMu = lunarYear - birthLunarYear + 1;
  const chi = chiOfYear(birthLunarYear), namChi = chiOfYear(lunarYear);
  const kl = KIM_LAU[tuoiMu % 9];
  const ho = HOANG_OC[Math.floor(((tuoiMu - 1) % 60) / 10)];
  const tt = TAM_TAI.find(([g]) => g.includes(chi))![1].includes(namChi);
  return { tuoiMu, kimLau: kl ?? null, hoangOc: ho, tamTai: tt, thaiTue: chi === namChi };
}

/* ---------- the calendar layer ---------- */
const JIE = ["立春", "惊蛰", "清明", "立夏", "芒种", "小暑", "立秋", "白露", "寒露", "立冬", "大雪", "小寒"]; // open Dần … Sửu
const JIE_PINYIN: Record<string, string> = { LI_CHUN: "立春", JING_ZHE: "惊蛰", QING_MING: "清明", LI_XIA: "立夏", MANG_ZHONG: "芒种", XIAO_SHU: "小暑", LI_QIU: "立秋", BAI_LU: "白露", HAN_LU: "寒露", LI_DONG: "立冬", DA_XUE: "大雪", XIAO_HAN: "小寒" };
const JIE_VI: Record<string, string> = { 立春: "Lập Xuân", 惊蛰: "Kinh Trập", 清明: "Thanh Minh", 立夏: "Lập Hạ", 芒种: "Mang Chủng", 小暑: "Tiểu Thử", 立秋: "Lập Thu", 白露: "Bạch Lộ", 寒露: "Hàn Lộ", 立冬: "Lập Đông", 大雪: "Đại Tuyết", 小寒: "Tiểu Hàn" };

type Ymd = { y: number; m: number; d: number };
const dayNo = ({ y, m, d }: Ymd) => Math.round(Date.UTC(y, m - 1, d) / 86400000);
const fromDayNo = (n: number): Ymd => { const t = new Date(n * 86400000); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; };

/** The 12 month-opening solar terms around a year, as Vietnam (UTC+7) calendar days, sorted. */
const jieCache = new Map<number, { day: number; zhi: number; ten: string }[]>();
function jieAround(year: number) {
  if (jieCache.has(year)) return jieCache.get(year)!;
  const seen = new Map<number, { day: number; zhi: number; ten: string }>();
  for (const y of [year - 1, year, year + 1]) {
    const table = Solar.fromYmd(y, 6, 1).getLunar().getJieQiTable();
    for (const [k, s] of Object.entries(table)) {
      const zh = JIE_PINYIN[k] ?? k;
      const idx = JIE.indexOf(zh);
      if (idx < 0) continue;
      // the instant is Beijing time (UTC+8); one hour earlier is Vietnam time
      const ms = Date.UTC(s.getYear(), s.getMonth() - 1, s.getDay(), s.getHour(), s.getMinute(), s.getSecond()) - 3600000;
      const vn = new Date(ms);
      const day = dayNo({ y: vn.getUTCFullYear(), m: vn.getUTCMonth() + 1, d: vn.getUTCDate() });
      seen.set(day, { day, zhi: (idx + 2) % 12, ten: JIE_VI[zh] });
    }
  }
  const list = [...seen.values()].sort((a, b) => a.day - b.day);
  jieCache.set(year, list);
  return list;
}
function monthOf(date: Ymd) {
  const n = dayNo(date);
  const list = jieAround(date.y);
  let cur = list[0];
  for (const j of list) if (j.day <= n) cur = j;
  return { zhi: cur.zhi, tietMo: cur.ten, ngayGiaoTiet: cur.day === n };
}
/** The year changes at Lập Xuân: its branch, for Liệt Bích (Tuế Phá) and Đương Khám. */
function yearZhiOf(date: Ymd) {
  const n = dayNo(date);
  const lapXuan = jieAround(date.y).find((j) => j.zhi === 2 && fromDayNo(j.day).y === date.y)!;
  return chiOfYear(n >= lapXuan.day ? date.y : date.y - 1);
}

/** Ngày kỵ dân gian, by lunar date. */
const TAM_NUONG = [3, 7, 13, 18, 22, 27];
const NGUYET_KY = [5, 14, 23];
const DUONG_CONG: [number, number][] = [[1, 13], [2, 11], [3, 9], [4, 7], [5, 5], [6, 3], [7, 8], [7, 29], [8, 27], [9, 25], [10, 23], [11, 21], [12, 19]];

export type NgayInfo = {
  date: Ymd;
  thu: number; // 0 = Chủ nhật
  canChi: string;
  chi: number;
  am: { d: number; m: number; nhuan: boolean; y: number };
  thang: { zhi: number; tietMo: string; ngayGiaoTiet: boolean };
  truc: number; // index in TRUC
  tu: { ten: string; dieu: string; diem: Diem };
  than: { ten: string; minh: boolean };
  gioMinh: number[]; // branch indices of the six Minh Khám hours
  nguyetLiet: boolean; // day branch clashes with the month (always the Phá day)
  lietBich: boolean; // day branch clashes with the year
  ky: string[]; // Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật
};

export function ngay(date: Ymd): NgayInfo {
  const lunar = Solar.fromYmd(date.y, date.m, date.d).getLunar();
  const gz = lunar.getDayInGanZhi();
  const chi = ZH_BRANCH.indexOf(gz[1]);
  const can = ZH_STEM.indexOf(gz[0]);
  const thang = monthOf(date);
  const yearZhi = yearZhiOf(date);
  const truc = (chi - thang.zhi + 12) % 12; // on the day a month opens this repeats the day before, as the document says
  const tuIdx = (((TU_ANCHOR.index + dayNo(date) - dayNo(TU_ANCHOR)) % 28) + 28) % 28;
  const dieu = DIEU[tuIdx % 7];
  const than = THAN[(chi - THANH_LONG_START[thang.zhi] + 12) % 12];
  const lm = lunar.getMonth();
  const am = { d: lunar.getDay(), m: Math.abs(lm), nhuan: lm < 0, y: lunar.getYear() };
  const ky: string[] = [];
  if (TAM_NUONG.includes(am.d)) ky.push("Tam Nương");
  if (NGUYET_KY.includes(am.d)) ky.push("Nguyệt Kỵ");
  if (!am.nhuan && DUONG_CONG.some(([m, d]) => m === am.m && d === am.d)) ky.push("Dương Công Kỵ Nhật");
  return {
    date,
    thu: new Date(Date.UTC(date.y, date.m - 1, date.d)).getUTCDay(),
    canChi: `${STEMS[can]} ${BRANCHES[chi]}`,
    chi,
    am,
    thang,
    truc,
    tu: { ten: TU_TEN[tuIdx], dieu, diem: DIEU_DIEM[dieu] },
    than,
    gioMinh: GIO_MINH[chi],
    nguyetLiet: (chi - thang.zhi + 12) % 12 === 6,
    lietBich: (chi - yearZhi + 12) % 12 === 6,
    ky,
  };
}

/* ---------- the work ---------- */
export type Viec = { id: string; ten: string; diem: Diem; hop: number[]; ky: number[]; nienHan: ("kim-lau" | "hoang-oc" | "tam-tai" | "thai-tue")[]; haiNguoi?: boolean };
// trực indices: 0 Kiến 1 Trừ 2 Mãn 3 Bình 4 Định 5 Chấp 6 Phá 7 Nguy 8 Thành 9 Thu 10 Khai 11 Bế
const LON: Viec["nienHan"] = ["tam-tai", "thai-tue"];
const DUNG: Viec["nienHan"] = ["kim-lau", "hoang-oc", "tam-tai", "thai-tue"];
/** Mapped from the document's diệm table and the trực "việc hợp / việc kỵ" columns. */
export const VIEC: Viec[] = [
  { id: "nhap-trach", ten: "Nhập trạch", diem: "nhien-dang", hop: [4], ky: [5, 6], nienHan: DUNG },
  { id: "ky-ket", ten: "Ký kết", diem: "nhien-dang", hop: [4, 8], ky: [6], nienHan: LON },
  { id: "cuoi-ve-nha", ten: "Cưới · chặng về chung nhà", diem: "nhien-dang", hop: [4, 8], ky: [1, 6], nienHan: DUNG, haiNguoi: true },
  { id: "dong-tho", ten: "Động thổ, dựng nền", diem: "nhien-dang", hop: [3, 5, 8, 10], ky: [0, 2, 6], nienHan: DUNG },
  { id: "nhap-hoc", ten: "Nhập học", diem: "nhien-dang", hop: [4, 8], ky: [6], nienHan: [] },
  { id: "viec-dai-hoi", ten: "Bắt đầu việc dài hơi", diem: "nhien-dang", hop: [10, 0], ky: [6, 11], nienHan: LON },
  { id: "khai-truong", ten: "Khai trương", diem: "boi-quang", hop: [8, 10], ky: [3, 6, 11], nienHan: LON },
  { id: "cuoi-le", ten: "Cưới · chặng lễ", diem: "boi-quang", hop: [4, 8], ky: [1, 3, 6], nienHan: DUNG, haiNguoi: true },
  { id: "ra-mat", ten: "Ra mắt", diem: "boi-quang", hop: [8, 10], ky: [3, 6, 11], nienHan: LON },
  { id: "nham-chuc", ten: "Nhậm chức", diem: "boi-quang", hop: [0], ky: [3, 6, 11], nienHan: LON },
  { id: "khanh-thanh", ten: "Khánh thành", diem: "boi-quang", hop: [8, 10], ky: [3, 6, 11], nienHan: LON },
  { id: "pha-do", ten: "Phá dỡ", diem: "do-ty", hop: [6], ky: [], nienHan: [] },
  { id: "don-dep", ten: "Dọn dẹp", diem: "do-ty", hop: [1], ky: [], nienHan: [] },
  { id: "chua-benh", ten: "Chữa bệnh", diem: "do-ty", hop: [1, 6], ky: [], nienHan: [] },
  { id: "cat-hop-dong", ten: "Cắt hợp đồng", diem: "do-ty", hop: [6, 11], ky: [], nienHan: [] },
  { id: "ket-thuc", ten: "Kết thúc một giai đoạn", diem: "do-ty", hop: [11], ky: [], nienHan: [] },
];

/* ---------- judging the days ---------- */
export type Nguoi = { ten: string; namSinh: number }; // lunar birth year
export type Lop = { ten: string; goc: string; dau: "+" | "−" | "=" | "loại"; ghiChu: string };
export type KetQua = {
  info: NgayInfo;
  loai: string[]; // hard filters hit (the day is set aside)
  bac: number; // trực level: 2 fits the work, 1 neutral, 0 kỵ
  diem: number; // soft score within the level
  lop: Lop[]; // every layer, in the document's order, with its source name
};

export function xet(info: NgayInfo, viec: Viec, nguoi: Nguoi[]): KetQua {
  const lop: Lop[] = [];
  const loai: string[] = [];
  const t = TRUC[info.truc];
  // 1. chất vách
  lop.push({ ten: "Chất vách", goc: `Tháng ${BRANCHES[info.thang.zhi]} (từ ${info.thang.tietMo}), ngày ${info.canChi}`, dau: "=", ghiChu: info.thang.ngayGiaoTiet ? `Ngày giao tiết ${info.thang.tietMo}: trực lặp ngày trước.` : "" });
  // 2. hard filters
  if (info.nguyetLiet) { loai.push("Nguyệt Liệt"); lop.push({ ten: "Nguyệt Liệt", goc: "Nguyệt Phá", dau: "loại", ghiChu: `Chi ngày ${BRANCHES[info.chi]} xung chi tháng ${BRANCHES[info.thang.zhi]}.` }); }
  if (info.lietBich) { loai.push("Liệt Bích"); lop.push({ ten: "Liệt Bích", goc: "Tuế Phá", dau: "loại", ghiChu: `Chi ngày ${BRANCHES[info.chi]} xung chi năm.` }); }
  for (const p of nguoi) {
    const q = quanHe(info.chi, chiOfYear(p.namSinh));
    if (q.xung) { loai.push(`Đối Khám tuổi ${p.ten}`); lop.push({ ten: "Đối Khám", goc: "Xung", dau: "loại", ghiChu: `Ngày ${BRANCHES[info.chi]} xung tuổi ${BRANCHES[chiOfYear(p.namSinh)]} của ${p.ten}.` }); }
  }
  // 3. trực and the work
  const bac = viec.hop.includes(info.truc) ? 2 : viec.ky.includes(info.truc) ? 0 : 1;
  lop.push({ ten: `Trực ${t.ten}`, goc: `Trực ${t.goc}`, dau: bac === 2 ? "+" : bac === 0 ? "−" : "=", ghiChu: bac === 2 ? `Hợp ${viec.ten.toLowerCase()}.` : bac === 0 ? `Kỵ: ${t.ky.toLowerCase()}.` : `Không nằm trong việc hợp, cũng không kỵ ${viec.ten.toLowerCase()}.` });
  let diem = 0;
  if (t.diem === viec.diem) { diem += 1; lop.push({ ten: "Trực cùng diệm", goc: DIEM_TEN[t.diem], dau: "+", ghiChu: `Công đoạn ${t.ten} thuộc ${DIEM_TEN[t.diem]} diệm, như việc.` }); }
  // 4. Minh Khám and tú
  if (info.than.minh) diem += 2;
  lop.push({ ten: info.than.minh ? "Minh Khám" : "Ám Khám", goc: `${info.than.ten} (${info.than.minh ? "Hoàng đạo" : "Hắc đạo"})`, dau: info.than.minh ? "+" : "=", ghiChu: info.than.minh ? "Khám có đèn." : "Khám tắt đèn, không phải ngày cấm." });
  if (info.tu.diem === viec.diem) diem += 1;
  lop.push({ ten: `Tú ${info.tu.ten}`, goc: `Sao ${info.tu.ten} (${info.tu.dieu})`, dau: info.tu.diem === viec.diem ? "+" : "=", ghiChu: info.tu.diem === viec.diem ? `Cùng ${DIEM_TEN[viec.diem]} diệm với việc.` : `Thuộc ${DIEM_TEN[info.tu.diem]} diệm; khác diệm thì không trừ.` });
  // 5. the person's relations
  for (const p of nguoi) {
    const q = quanHe(info.chi, chiOfYear(p.namSinh));
    const ai = `tuổi ${BRANCHES[chiOfYear(p.namSinh)]} của ${p.ten}`;
    if (q.hopChieu) { diem += 1.5; lop.push({ ten: "Hợp Chiếu", goc: "Tam hợp", dau: "+", ghiChu: `Ngày ${BRANCHES[info.chi]} tam hợp ${ai}.` }); }
    if (q.amThong) { diem += 1.5; lop.push({ ten: "Ám Thông", goc: "Lục hợp", dau: "+", ghiChu: `Ngày ${BRANCHES[info.chi]} lục hợp ${ai}.` }); }
    if (q.hinh) { diem -= 1.5; lop.push({ ten: "Hình", goc: "Hình", dau: "−", ghiChu: `Ngày ${BRANCHES[info.chi]} hình ${ai}.` }); }
    if (q.hai) { diem -= 0.75; lop.push({ ten: "Hại", goc: "Hại", dau: "−", ghiChu: `Ngày ${BRANCHES[info.chi]} hại ${ai}.` }); }
  }
  // 6. folk days: soft only
  for (const k of info.ky) { diem -= 1.5; lop.push({ ten: k, goc: k, dau: "−", ghiChu: "Ngày kỵ dân gian, chỉ trừ điểm." }); }
  return { info, loai, bac, diem, lop };
}

/** All days in a range, judged; the best 2–3 first. When nothing passes the hard filters, the least-hit days come first. */
export function chonNgay(from: Ymd, to: Ymd, viec: Viec, nguoi: Nguoi[]) {
  const all: KetQua[] = [];
  for (let n = dayNo(from); n <= dayNo(to); n++) all.push(xet(ngay(fromDayNo(n)), viec, nguoi));
  const rank = (a: KetQua, b: KetQua) => a.loai.length - b.loai.length || b.bac - a.bac || b.diem - a.diem || dayNo(a.info.date) - dayNo(b.info.date);
  const pass = all.filter((k) => !k.loai.length).sort(rank);
  const chon = (pass.length ? pass : [...all].sort(rank)).slice(0, 3);
  return { all, chon, coNgayLot: pass.length > 0 };
}

export const ymd = (y: number, m: number, d: number): Ymd => ({ y, m, d });
export const ymdKey = ({ y, m, d }: Ymd) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
export const parseYmd = (s: string): Ymd | null => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); return m ? { y: +m[1], m: +m[2], d: +m[3] } : null; };
export const addDays = (a: Ymd, n: number) => fromDayNo(dayNo(a) + n);
export const daysBetween = (a: Ymd, b: Ymd) => dayNo(b) - dayNo(a);

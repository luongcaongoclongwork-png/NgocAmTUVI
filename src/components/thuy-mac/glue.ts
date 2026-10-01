/**
 * Vietnamese names and compound words read wrongly when a line break falls inside them
 * ("triều / Nguyễn", "góc / nhìn"). glue() ties the syllables of the house's own terms with
 * no-break spaces, so a title may wrap anywhere except inside one of them.
 */
const TERMS = [
  "Khâm Thiên Giám",
  "Xuyên Tam Diệm",
  "Đại Chủ Sự",
  "Ngọc Âm",
  "Xuyên vấn",
  "Diệm Bản",
  "Xuyên giả",
  "Chủ Sự",
  "Minh Mạng",
  "triều Nguyễn",
  "Tử Vi",
  "Phong Thuỷ",
  "Trà Đạo",
  "góc nhìn",
];

const NBSP = "\u00a0";
const PATTERN = new RegExp(TERMS.map((t) => t.replace(/ /g, "[ \u00a0]")).join("|"), "giu");

export function glue(text: string): string {
  return text.replace(PATTERN, (m) => m.replace(/ /g, NBSP));
}

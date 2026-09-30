import type { Service, ServiceGroup } from "@/lib/service-constants";

/**
 * "Điều gì đang khiến bạn cân nhắc?" — each answer points at the packages
 * that fit it. Packages are found by group + a word in their title, so the
 * owner can still rename, reprice or hide them in /admin.
 */
export const ASKS: {
  id: string;
  label: string;
  hint: string;
  reply: string;
  match: [ServiceGroup, string][];
  who: "co-minh-trang" | "thay-tinh";
}[] = [
  {
    id: "quyet-dinh",
    label: "Một quyết định lớn đang tới gần",
    hint: "công việc, hôn nhân, gia đình",
    reply: "Trước một quyết định lớn, điều cần nhất thường không phải lời khuyên, mà là nhìn rõ mình đang đứng ở đâu.",
    match: [["tu-vi", "chuyên sâu"], ["tu-vi", "tổng hợp toàn"]],
    who: "co-minh-trang",
  },
  {
    id: "hieu-minh",
    label: "Tôi muốn hiểu trọn bản thân",
    hint: "tính cách, sở trường, các giai đoạn của đời",
    reply: "Diệm Bản là tấm bản đồ những điều sẵn có trong bạn. Đọc trọn một lần, nhiều lựa chọn về sau sẽ rõ hơn.",
    match: [["tu-vi", "tổng hợp toàn"]],
    who: "co-minh-trang",
  },
  {
    id: "hai-nguoi",
    label: "Chuyện giữa hai người",
    hint: "vợ chồng, cha mẹ và con, người cộng sự",
    reply: "Hai người, hai Diệm Bản. Hiểu từng người và chỗ hai người gặp nhau, rồi mới bàn chuyện hợp hay không.",
    match: [["tu-vi", "2 diệm bản"]],
    who: "co-minh-trang",
  },
  {
    id: "khong-gian",
    label: "Nhà ở hoặc nơi làm việc",
    hint: "dọn về nhà mới, sắp xếp lại không gian",
    reply: "Nơi ở phản chiếu người ở. Tịnh không gian trước, rồi mới tính đến chuyện thêm bớt vật phẩm.",
    match: [["phong-thuy", "cả nhà"], ["phong-thuy", "một không gian"], ["phong-thuy", "văn phòng"]],
    who: "thay-tinh",
  },
  {
    id: "chon-ngay",
    label: "Chọn ngày cho việc lớn",
    hint: "khai trương, động thổ, hỷ sự, ký kết",
    reply: "Khâm Thiên Giám xưa làm lịch và chọn ngày cho việc của triều đình. Ngọc Âm giữ cách chọn ấy cho việc của bạn.",
    match: [["tu-vi", "ngày/giờ"], ["dai-chu-su", "ngày/giờ"]],
    who: "co-minh-trang",
  },
  {
    id: "doanh-nghiep",
    label: "Doanh nghiệp tôi đang cầm lái",
    hint: "định hướng, con người, tuyển dụng",
    reply: "Cơ nghiệp vận hành quanh người cầm lái. Hiểu rõ chính mình là việc đầu tiên trước khi dẫn dắt người khác.",
    match: [["dai-chu-su", "đại chủ sự"], ["dai-chu-su", "tuyển dụng"]],
    who: "co-minh-trang",
  },
  {
    id: "tiep-noi",
    label: "Tôi đã từng Xuyên vấn ở Ngọc Âm",
    hint: "có điều mới phát sinh",
    reply: "Diệm Bản của bạn đã được luận. Phiên tiếp nối đi thẳng vào điều mới, không bắt đầu lại từ đầu.",
    match: [["tu-vi", "tiếp nối"], ["dai-chu-su", "tiếp nối"]],
    who: "co-minh-trang",
  },
];

export function servicesFor(match: [ServiceGroup, string][], all: Service[]): Service[] {
  const out: Service[] = [];
  for (const [group, word] of match) {
    const s = all.find((x) => x.group === group && x.title.toLowerCase().includes(word) && !out.includes(x));
    if (s) out.push(s);
  }
  return out;
}

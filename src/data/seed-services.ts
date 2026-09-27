/**
 * The 9 services that used to be hardcoded in src/data/services.ts, now used
 * ONLY as the one-time seed for the new SQLite-backed `services` table (see
 * src/lib/db.ts) so the live site's content is unchanged right after the
 * cutover to the admin panel. Not imported anywhere else.
 */
export type SeedService = {
  group: "tu-vi" | "phong-thuy" | "dai-chu-su";
  title: string;
  desc: string;
  price: string;
  duration: string;
  note: string;
};

export const seedServices: SeedService[] = [
  {
    group: "tu-vi",
    title: "Phiên Xuyên vấn chuyên sâu một vấn đề",
    desc: "Tập trung phân tích một vấn đề cụ thể về sự nghiệp, hôn nhân, gia đình hoặc một việc lớn sắp phải quyết định. Phiên Xuyên vấn giúp nhìn rõ bản chất sự việc và lựa chọn hướng đi phù hợp.",
    price: "1.000.000",
    duration: "45 phút",
    note: "",
  },
  {
    group: "tu-vi",
    title: "Phiên Xuyên vấn Tổng hợp toàn Diệm Bản",
    desc: "Phân tích toàn diện Diệm Bản về tính cách, sở trường và những điều cần hoàn thiện, công danh, sự nghiệp, hôn nhân, gia đình cùng các giai đoạn chính của cuộc đời.",
    price: "2.000.000",
    duration: "90 phút",
    note: "",
  },
  {
    group: "tu-vi",
    title: "Phiên Xuyên vấn 2 Diệm Bản cùng thời điểm",
    desc: "Dành cho cha mẹ và con cái, hai người trong một cuộc hôn nhân, hoặc hai người cùng hợp tác trong công việc. Phiên Xuyên vấn phân tích từng Diệm Bản và mối tương quan giữa hai Diệm Bản.",
    price: "3.500.000",
    duration: "120 phút",
    note: "",
  },
  {
    group: "tu-vi",
    title: "Xuyên vấn ngày/giờ đẹp",
    desc: "Lựa chọn ngày/giờ phù hợp cho các sự kiện quan trọng như: động thổ, khai trương, hỷ sự, khánh thành...",
    price: "500.000",
    duration: "",
    note: "",
  },
  {
    group: "tu-vi",
    title: "Phiên Xuyên vấn tiếp nối",
    desc: "Áp dụng cho chủ sự đã tham gia Phiên tổng hợp toàn Diệm Bản hoặc phiên 2 Diệm Bản. Phiên Xuyên vấn dựa trên nền Diệm Bản đã được phân tích, tập trung giải quyết những vấn đề mới phát sinh hoặc định hướng cho giai đoạn tiếp theo.",
    price: "700.000",
    duration: "45 phút",
    note: "Dành cho Chủ Sự đã Xuyên Vấn tại Ngọc Âm",
  },
  {
    group: "phong-thuy",
    title: "Tư vấn Phong Thuỷ văn phòng / thương mại",
    desc: "Quan sát và điều chỉnh không gian làm việc, kinh doanh để hài hoà dòng khí và nhịp vận hành.",
    price: "Từ 2.000.000",
    duration: "",
    note: "",
  },
  {
    group: "phong-thuy",
    title: "Tư vấn Phong Thuỷ cục bộ cả nhà",
    desc: "Đánh giá tổng thể không gian sống, bố cục và hướng nhà theo nguyên lý hài hoà với môi trường.",
    price: "Từ 2.000.000",
    duration: "",
    note: "",
  },
  {
    group: "phong-thuy",
    title: "Tư vấn Phong Thuỷ một không gian",
    desc: "Tập trung vào một khu vực cụ thể — phòng ngủ, phòng thờ, bếp hoặc góc làm việc.",
    price: "Từ 500.000",
    duration: "",
    note: "",
  },
  {
    group: "phong-thuy",
    title: "Phong Thuỷ tối giản kết hợp với lối sống",
    desc: "Ứng dụng nguyên lý Phong Thuỷ theo hướng tối giản, phù hợp nhịp sống và không gian hiện đại.",
    price: "Từ 2.000.000",
    duration: "",
    note: "",
  },
  {
    group: "phong-thuy",
    title: "Tư vấn Phong Thuỷ Âm Trạch",
    desc: "Tham vấn về vị trí và hướng an táng theo nguyên lý địa lý truyền thống.",
    price: "Liên hệ",
    duration: "",
    note: "",
  },
  {
    group: "dai-chu-su",
    title: "Xuyên vấn Đại Chủ Sự",
    desc: "2 buổi – 2 ngày. Buổi 1: luận Diệm Bản theo Tử Vi Xuyên Tam Diệm — tính cách, sở trường, cách ra quyết định và cách vận hành tự nhiên của chính Đại Chủ Sự. Buổi 2: chọn một đến hai vấn đề hệ trọng nhất của doanh nghiệp để đi vào chiều sâu, dẫn dắt bằng hệ thống câu hỏi lãnh đạo của Maxwell Leadership để Đại Chủ Sự tự tìm ra hướng xử lý.",
    price: "5.000.000",
    duration: "2 buổi · 2 ngày",
    note: "",
  },
  {
    group: "dai-chu-su",
    title: "Xuyên vấn phong thuỷ tuyển dụng",
    desc: "Diệm Bản của từng ứng viên được đối chiếu với người cầm lái và đội ngũ hiện tại, làm rõ mức độ hoà hợp và những khác biệt cần lường trước. Đây là lớp thông tin bổ sung, đi cùng chứ không thay thế quy trình đánh giá năng lực sẵn có.",
    price: "Từ 1.500.000",
    duration: "90 phút",
    note: "",
  },
  {
    group: "dai-chu-su",
    title: "Xuyên vấn ngày/giờ đẹp cho doanh nghiệp",
    desc: "Lựa chọn ngày/giờ phù hợp cho những cột mốc của doanh nghiệp như khai trương, động thổ, ký kết, ra mắt sản phẩm.",
    price: "800.000",
    duration: "Theo sự kiện",
    note: "",
  },
  {
    group: "dai-chu-su",
    title: "Phiên Xuyên vấn tiếp nối Doanh nghiệp",
    desc: "Trên nền Diệm Bản đã được phân tích từ phiên trước, phiên này nối tiếp Xuyên vấn rõ vai trò của Đại Chủ Sự trong chính doanh nghiệp đang điều hành.",
    price: "2.500.000",
    duration: "90 phút",
    note: "Dành cho Đại Chủ Sự đã Xuyên Vấn tại Ngọc Âm",
  },
];

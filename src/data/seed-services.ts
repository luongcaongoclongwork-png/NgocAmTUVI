/**
 * The 9 services that used to be hardcoded in src/data/services.ts, now used
 * ONLY as the one-time seed for the new SQLite-backed `services` table (see
 * src/lib/db.ts) so the live site's content is unchanged right after the
 * cutover to the admin panel. Not imported anywhere else.
 */
export type SeedService = {
  group: "tu-vi" | "phong-thuy";
  title: string;
  desc: string;
  price: string;
};

export const seedServices: SeedService[] = [
  {
    group: "tu-vi",
    title: "Phiên khai vấn chuyên sâu một vấn đề",
    desc: "Đào sâu một chủ đề cụ thể trong lá số — sự nghiệp, tình duyên, sức khoẻ hoặc một quyết định bạn đang cân nhắc.",
    price: "1.000.000",
  },
  {
    group: "tu-vi",
    title: "Phiên khai vấn tổng hợp toàn lá số",
    desc: "Nhìn toàn cảnh 12 cung trên lá số, các giai đoạn vận trình và những điểm cần lưu tâm trong hành trình sắp tới.",
    price: "2.000.000",
  },
  {
    group: "tu-vi",
    title: "Phiên khai vấn tổng hợp hai lá số cùng thời điểm",
    desc: "Đối chiếu hai lá số trong cùng một giai đoạn — phù hợp cho vợ chồng, đối tác hoặc các quyết định chung.",
    price: "3.500.000",
  },
  {
    group: "tu-vi",
    title: "Khai vấn Ngày / Giờ Hoàng Đạo",
    desc: "Chọn ngày và giờ tốt cho các việc hệ trọng — khai trương, cưới hỏi, nhập trạch, xuất hành hoặc ký kết.",
    price: "500.000",
  },
  {
    group: "phong-thuy",
    title: "Tư vấn Phong Thuỷ văn phòng / thương mại",
    desc: "Quan sát và điều chỉnh không gian làm việc, kinh doanh để hài hoà dòng khí và nhịp vận hành.",
    price: "2.000.000",
  },
  {
    group: "phong-thuy",
    title: "Tư vấn Phong Thuỷ cục bộ cả nhà",
    desc: "Đánh giá tổng thể không gian sống, bố cục và hướng nhà theo nguyên lý hài hoà với môi trường.",
    price: "2.000.000",
  },
  {
    group: "phong-thuy",
    title: "Tư vấn Phong Thuỷ một không gian",
    desc: "Tập trung vào một khu vực cụ thể — phòng ngủ, phòng thờ, bếp hoặc góc làm việc.",
    price: "500.000",
  },
  {
    group: "phong-thuy",
    title: "Phong Thuỷ tối giản kết hợp với lối sống",
    desc: "Ứng dụng nguyên lý Phong Thuỷ theo hướng tối giản, phù hợp nhịp sống và không gian hiện đại.",
    price: "2.000.000",
  },
  {
    group: "phong-thuy",
    title: "Tư vấn Phong Thuỷ Âm Trạch",
    desc: "Tham vấn về vị trí và hướng an táng theo nguyên lý địa lý truyền thống.",
    price: "Liên hệ",
  },
];

export type Product = {
  name: string;
  desc: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  intro: string;
  items: Product[];
};

export const productCategories: ProductCategory[] = [
  {
    id: "ngoc-phi-thuy",
    name: "Ngọc Phỉ Thuý",
    intro:
      "Tuyển chọn theo màu sắc và độ trong, phù hợp đeo hằng ngày hoặc lưu giữ lâu dài.",
    items: [
      { name: "Mặt Phỉ Thuý tròn", desc: "Dáng tròn cổ điển, phù hợp cả nam và nữ." },
      { name: "Vòng tay Phỉ Thuý", desc: "Đường kính theo số đo cổ tay, đánh bóng thủ công." },
      { name: "Mặt Phỉ Thuý khắc chữ", desc: "Khắc một chữ Hán-Nôm theo lựa chọn, mang ý nghĩa riêng." },
    ],
  },
  {
    id: "ngoc-hoa-dien",
    name: "Ngọc Hoà Điền",
    intro:
      "Chất ngọc ấm, bền theo thời gian — thường được chọn làm vật phẩm truyền lại qua nhiều thế hệ.",
    items: [
      { name: "Mặt Hoà Điền hình Như Ý", desc: "Biểu tượng cổ điển, chế tác tinh giản." },
      { name: "Vòng tay Hoà Điền", desc: "Hạt tròn đều, độ bóng tự nhiên." },
    ],
  },
  {
    id: "da-phong-thuy",
    name: "Đá Phong Thuỷ",
    intro:
      "Lựa chọn theo bản mệnh và mục đích sử dụng, tư vấn trực tiếp cùng Thầy Tịnh.",
    items: [
      { name: "Vòng tay Thạch Anh", desc: "Nhiều màu theo ngũ hành, kèm tư vấn chọn theo mệnh." },
      { name: "Trụ đá để bàn", desc: "Đặt bàn làm việc hoặc góc học tập, kích thước nhỏ gọn." },
      { name: "Đá lăn phong thuỷ", desc: "Dùng trong bố cục phòng khách hoặc không gian tiếp khách." },
    ],
  },
  {
    id: "do-phong-thuy",
    name: "Đồ Phong Thuỷ",
    intro:
      "Vật phẩm hỗ trợ theo từng bố cục không gian cụ thể, luôn đi kèm tư vấn vị trí đặt.",
    items: [
      { name: "Tỳ Hưu gỗ", desc: "Chế tác từ gỗ tự nhiên, kèm hướng dẫn vị trí đặt." },
      { name: "Chuông gió đồng", desc: "Dùng điều hoà luồng khí tại cửa chính hoặc ban công." },
      { name: "Bình phong mini", desc: "Điều chỉnh tầm nhìn và luồng khí cho không gian nhỏ." },
    ],
  },
];

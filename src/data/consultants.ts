import { khuong } from "./traDao";

export const ROLE_TAGLINE = "Kế thừa tri thức cổ — Ứng dụng vào đời sống hiện đại";

export type Consultant = {
  id: string;
  name: string;
  field: string;
  initials: string;
  bio: string;
};

export const consultants: Consultant[] = [
  {
    id: "co-minh-trang",
    name: "Cô Nguyễn Minh Trang",
    field: "Khai vấn Tử Vi",
    initials: "MT",
    bio:
      "Là truyền nhân của Khâm Thiên Giám dưới triều vua Minh Mạng, cô Nguyễn Minh Trang có cơ duyên tiếp cận và kế thừa những tri thức phương Đông được lưu truyền qua nhiều thế hệ. Với hơn 10 năm nghiên cứu và thực hành Tử Vi – Phong Thuỷ, cô đồng hành cùng nhiều quý hữu tìm ra con đường phát triển phù hợp với bản thân, chuyển hoá những điều bất như ý trong lá số thành cơ hội để trưởng thành và an nhiên hơn.",
  },
  {
    id: "thay-tinh",
    name: "Thầy Tịnh",
    field: "Tư vấn Phong Thuỷ",
    initials: "T",
    bio:
      "Là hậu nhân của một vị Thượng thư Bộ Hộ, từng kiêm quản Khâm Thiên Giám dưới triều vua Minh Mạng, Thầy Tịnh sinh trưởng trong một gia đình có truyền thống gắn với địa lý và Phong Thuỷ. Thầy dành nhiều tâm sức nghiên cứu Phong Thuỷ Dương Trạch và Âm Trạch — nhà ở, đất đai, không gian sống và việc lựa chọn vị trí an táng — như một nghệ thuật quan sát mối quan hệ giữa con người, không gian và môi trường sống.",
  },
  {
    id: "khuong",
    name: khuong.name,
    field: khuong.title,
    initials: "KH",
    bio: khuong.homeBio,
  },
];

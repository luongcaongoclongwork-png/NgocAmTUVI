/**
 * The 3 consultants that used to be hardcoded in src/data/consultants.ts, now
 * used ONLY as the one-time seed for the new SQLite-backed `consultants`
 * table (see src/lib/db.ts) so the live site's content is unchanged right
 * after the cutover to the admin panel. Not imported anywhere else.
 *
 * Khương's bio is copied from traDao.ts's khuong.homeBio at seed time only —
 * after this, the homepage consultant card (DB, editable via admin) and the
 * /tra-dao page (traDao.ts, not admin-editable) are two independent sources.
 */
import { khuong } from "./traDao";

export type SeedConsultant = {
  slug: string;
  name: string;
  field: string;
  initials: string;
  bio: string;
};

export const seedConsultants: SeedConsultant[] = [
  {
    slug: "co-minh-trang",
    name: "Cô Nguyễn Minh Trang",
    field: "Khai vấn Tử Vi",
    initials: "MT",
    bio: "Là truyền nhân của Khâm Thiên Giám dưới triều vua Minh Mạng, cô Nguyễn Minh Trang có cơ duyên tiếp cận và kế thừa những tri thức phương Đông được lưu truyền qua nhiều thế hệ. Với hơn 10 năm nghiên cứu và thực hành Tử Vi – Phong Thuỷ, cô đồng hành cùng nhiều quý hữu tìm ra con đường phát triển phù hợp với bản thân, chuyển hoá những điều bất như ý trong lá số thành cơ hội để trưởng thành và an nhiên hơn.",
  },
  {
    slug: "thay-tinh",
    name: "Thầy Tịnh",
    field: "Tư vấn Phong Thuỷ",
    initials: "T",
    bio: "Là hậu nhân của một vị Thượng thư Bộ Hộ, từng kiêm quản Khâm Thiên Giám dưới triều vua Minh Mạng, Thầy Tịnh sinh trưởng trong một gia đình có truyền thống gắn với địa lý và Phong Thuỷ. Thầy dành nhiều tâm sức nghiên cứu Phong Thuỷ Dương Trạch và Âm Trạch — nhà ở, đất đai, không gian sống và việc lựa chọn vị trí an táng — như một nghệ thuật quan sát mối quan hệ giữa con người, không gian và môi trường sống.",
  },
  {
    slug: "khuong",
    name: khuong.name,
    field: khuong.title,
    initials: "KH",
    bio: khuong.homeBio,
  },
];

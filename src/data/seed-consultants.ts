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
    field: "Xuyên Giả Tử Vi",
    initials: "MT",
    bio: "Cô Nguyễn Minh Trang là truyền nhân của vị quan kiêm quản Khâm Thiên Giám dưới triều vua Minh Mạng. Từ cơ duyên ấy, cô được tiếp cận và kế thừa những tri thức phương Đông lưu truyền qua nhiều thế hệ. Hơn 10 năm nghiên cứu và thực hành Tử Vi, Phong Thủy đã giúp cô hình thành cách tiếp cận cẩn trọng, chú trọng việc ứng dụng tri thức vào những vấn đề cụ thể trong đời sống.\n\nTrong quá trình đồng hành cùng quý hữu, cô vận dụng Tử Vi và Phong Thủy để giúp mỗi người hiểu rõ bản thân, nhìn nhận hoàn cảnh thấu đáo và tìm hướng phát triển phù hợp. Qua việc đọc Diệm Bản và Xuyên vấn, cô hỗ trợ quý hữu nhận diện những vướng mắc, từng bước chuyển hóa điều bất như ý thành cơ hội học hỏi và trưởng thành.\n\nVới cô Trang, giá trị của tri thức cổ còn nằm ở khả năng hỗ trợ con người đưa ra quyết định trong hiện tại. Sự điềm tĩnh và cẩn trọng được bồi đắp qua nhiều năm thực hành là nền tảng cho những định hướng cô chia sẻ. Cô mong mỗi người có thể chủ động tháo gỡ khó khăn, vững tâm trước biến động và nuôi dưỡng sự bình an trên hành trình tu dưỡng nội tâm.",
  },
  {
    slug: "thay-tinh",
    name: "Thầy Tịnh",
    field: "Phong Thuỷ Sư",
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

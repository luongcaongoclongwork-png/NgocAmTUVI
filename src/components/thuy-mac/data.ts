import "server-only";
import { getServicesByGroup } from "@/lib/services";
import { getConsultants } from "@/lib/consultants";
import { getFeaturedArticles } from "@/lib/articles";
import { getSiteSettings } from "@/lib/site-settings";

/**
 * Everything the v2 homepage drafts show, read from the same database the
 * live site and /admin use — the drafts only change presentation.
 */
export async function getHomeData() {
  const [tuVi, phongThuy, daiChuSu, consultants, articles, settings] = await Promise.all([
    getServicesByGroup("tu-vi"),
    getServicesByGroup("phong-thuy"),
    getServicesByGroup("dai-chu-su"),
    getConsultants(),
    getFeaturedArticles(3),
    getSiteSettings(),
  ]);
  const bySlug = Object.fromEntries(consultants.map((c) => [c.slug, c]));
  return {
    groups: [
      { id: "tu-vi", name: "Tử Vi Xuyên Tam Diệm", han: "紫微", href: "/tu-vi", items: tuVi },
      { id: "phong-thuy", name: "Phong Thuỷ Là Tịnh", han: "風水", href: "/phong-thuy", items: phongThuy },
      { id: "dai-chu-su", name: "Xuyên Vấn Đại Chủ Sự", han: "大主事", href: "/dai-chu-su", items: daiChuSu },
    ] as const,
    trang: bySlug["co-minh-trang"],
    tinh: bySlug["thay-tinh"],
    khuong: bySlug["khuong"],
    articles,
    settings,
  };
}

export type HomeData = Awaited<ReturnType<typeof getHomeData>>;

/** The three paths, in the brand's own words (skill v2 §1). */
export const PATHS = [
  {
    id: "tu-vi",
    name: "Tử Vi Xuyên Tam Diệm",
    han: "紫微",
    line: "Xuyên vấn, định hướng, phát triển nội lực, chuyển hoá điều bất như ý.",
    desc: "Đọc Diệm Bản cùng Xuyên giả để thấu hiểu bản thân và tự chọn hướng đi.",
    href: "/tu-vi",
    cta: "Xem các phiên Xuyên vấn",
  },
  {
    id: "phong-thuy",
    name: "Phong Thuỷ Là Tịnh",
    han: "風水",
    line: "Hoà hợp quy luật của đất, tịnh hoá không gian và nội tâm.",
    desc: "Thấy sự thật nguyên bản của nơi ở, nơi làm việc, để tự chủ hướng đến thịnh vượng đích thực.",
    href: "/phong-thuy",
    cta: "Xem tư vấn Phong Thuỷ",
  },
  {
    id: "dai-chu-su",
    name: "Xuyên Vấn Đại Chủ Sự",
    han: "大主事",
    line: "Vững vàng trước khi dẫn dắt người khác.",
    desc: "Dành cho người cầm lái doanh nghiệp: hiểu rõ chính mình trước những quyết định lớn.",
    href: "/dai-chu-su",
    cta: "Xem gói doanh nghiệp",
  },
] as const;

/** A real sequence, so numbering is information here. */
export const STEPS = [
  { title: "Gửi đôi dòng", desc: "Bạn chọn phiên và để lại điều đang cần được làm rõ." },
  { title: "Ngọc Âm liên hệ", desc: "Chúng tôi gọi lại trong một ngày làm việc để hẹn giờ." },
  { title: "Phiên Xuyên vấn", desc: "Cùng Xuyên giả luận Diệm Bản theo thời lượng của gói đã chọn, không vội kết luận." },
  { title: "Đồng hành tiếp", desc: "Phiên tiếp nối khi có điều mới phát sinh, trên nền Diệm Bản đã luận." },
] as const;

export const LINEAGE = {
  title: "Hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn",
  quote: "Kế thừa tri thức chiêm tinh, lịch pháp và phong thuỷ cung đình từ Khâm Thiên Giám thời vua Minh Mạng.",
  body: "Ngọc Âm tiếp cận tri thức ấy không phải để dự đoán, mà để cùng bạn quan sát rõ hơn bản thân và hoàn cảnh, từ đó đưa ra những lựa chọn có cân nhắc và vững vàng hơn.",
};

import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import About from "@/components/About";
import Consultants from "@/components/Consultants";
import Philosophy from "@/components/Philosophy";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Về Ngọc Âm",
  description:
    "Ngọc Âm — hậu nhân Khâm Thiên Giám dưới triều vua Minh Mạng, triều Nguyễn. Câu chuyện thương hiệu, đội ngũ khai vấn và tinh thần Khương – Lạc – Tịnh.",
};

export default function VeNgocAmPage() {
  return (
    <>
      <PageBanner
        eyebrow="Về Ngọc Âm"
        heading="Một mạch truyền thừa, không phải một lời tiên tri."
        description="Ngọc Âm ra đời từ một dòng tri thức phương Đông được gìn giữ qua nhiều thế hệ — không để dự đoán thay bạn, mà để cùng bạn nhìn rõ hơn con đường phía trước."
        image="/images/04-phong-thuy-dia-the.webp"
        imageAlt="Quần thể kiến trúc cổ Việt Nam nhìn từ trên cao"
      />
      <About />
      <Consultants />
      <Philosophy />
      <CtaBand />
    </>
  );
}

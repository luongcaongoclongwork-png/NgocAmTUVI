import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import PhilosophyPillars from "@/components/PhilosophyPillars";
import ConsultantProfile from "@/components/ConsultantProfile";
import ServiceList from "@/components/ServiceList";
import ConsultationProcess from "@/components/ConsultationProcess";
import CtaBand from "@/components/CtaBand";
import { getServicesByGroup } from "@/lib/services";
import { getConsultantBySlug } from "@/lib/consultants";
import { BASE_GLOSSARY_TERMS } from "@/data/xuyenVanGlossary";

export const metadata: Metadata = {
  title: "Tử Vi Xuyên Tam Diệm — Ngọc Âm",
  description:
    "Xuyên vấn Tử Vi tại Ngọc Âm: Xuyên vấn, định hướng, phát triển nội lực và chuyển hoá điều bất như ý, cùng Xuyên giả Nguyễn Minh Trang.",
};

const pillars = [
  {
    word: "Xuyên vấn",
    desc: "Không phải xem để biết trước, mà để mở ra một cuộc đối thoại — giữa bạn với chính Diệm Bản của mình, giữa hiện tại với những gì đã qua.",
  },
  {
    word: "Định hướng",
    desc: "Từ những gì quan sát được, gợi mở các hướng đi khả dĩ, để bạn tự cân nhắc và lựa chọn thay vì bị dẫn dắt.",
  },
  {
    word: "Phát triển nội lực",
    desc: "Hiểu rõ điểm mạnh, điểm yếu và chu kỳ của bản thân là nền tảng để xây dựng nội lực bền vững, không phụ thuộc vào may rủi.",
  },
  {
    word: "Chuyển hoá điều bất như ý",
    desc: "Những giai đoạn khó khăn trong Diệm Bản không phải để né tránh, mà để chuẩn bị — và chuyển hoá thành bài học trưởng thành.",
  },
];

export default async function TuViPage() {
  const [trang, tuViServices] = await Promise.all([
    getConsultantBySlug("co-minh-trang"),
    getServicesByGroup("tu-vi"),
  ]);

  return (
    <>
      <PageBanner
        eyebrow="Tử Vi Xuyên Tam Diệm"
        heading="Không phải để biết trước, mà để hiểu rõ hơn."
        description="Tử Vi tại Ngọc Âm không dừng ở việc dự đoán. Đó là một công cụ Xuyên vấn — giúp bạn nhìn rõ bản thân, hoàn cảnh và những chu kỳ đang vận hành, để chủ động hơn trên hành trình của chính mình."
        image="/images/tu-vi/page-banner.webp"
        imageAlt="Diệm Bản Tử Vi Xuyên Tam Diệm, ấn ngọc và trầm hương trên bàn gỗ cổ"
      />
      <PhilosophyPillars
        eyebrow="Triết lý"
        heading="Bốn giai đoạn của một phiên Xuyên vấn Tử Vi."
        pillars={pillars}
      />
      {/* Hidden or trashed in /admin: the page stays, only the profile is omitted. */}
      {trang && (
        <ConsultantProfile
          consultant={trang}
          image={trang.photo || "/images/consultants/minh-trang.webp"}
          imageAlt={trang.photo ? `Chân dung ${trang.name}` : "Diệm Bản Tử Vi viết tay trên bàn gỗ cổ"}
          contactTopic="tu-vi"
          ctaVerb="Xuyên vấn"
        />
      )}
      <ServiceList
        eyebrow="Dịch vụ"
        heading="Xuyên vấn Tử Vi"
        items={tuViServices}
        background="bg-ivory"
      />
      <PhilosophyPillars
        eyebrow="Chú giải thuật ngữ"
        heading="Ngôn ngữ riêng của Ngọc Âm."
        pillars={BASE_GLOSSARY_TERMS}
        footnote="Xuyên Giả: Nguyễn Minh Trang"
        background="bg-parchment/60"
      />
      <ConsultationProcess />
      <CtaBand />
    </>
  );
}

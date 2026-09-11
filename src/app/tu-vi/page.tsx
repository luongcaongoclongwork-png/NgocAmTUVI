import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import PhilosophyPillars from "@/components/PhilosophyPillars";
import ConsultantProfile from "@/components/ConsultantProfile";
import ServiceList from "@/components/ServiceList";
import ConsultationProcess from "@/components/ConsultationProcess";
import CtaBand from "@/components/CtaBand";
import { tuViServices } from "@/data/services";
import { consultants } from "@/data/consultants";

export const metadata: Metadata = {
  title: "Tử Vi Xuyên Tam Diệm — Ngọc Âm",
  description:
    "Khai vấn Tử Vi tại Ngọc Âm: khai vấn, định hướng, phát triển nội lực và chuyển hoá điều bất như ý, cùng cô Nguyễn Minh Trang.",
};

const pillars = [
  {
    word: "Khai vấn",
    desc: "Không phải xem để biết trước, mà để mở ra một cuộc đối thoại — giữa bạn với chính lá số của mình, giữa hiện tại với những gì đã qua.",
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
    desc: "Những giai đoạn khó khăn trong lá số không phải để né tránh, mà để chuẩn bị — và chuyển hoá thành bài học trưởng thành.",
  },
];

const trang = consultants.find((c) => c.id === "co-minh-trang")!;

export default function TuViPage() {
  return (
    <>
      <PageBanner
        eyebrow="Tử Vi Xuyên Tam Diệm"
        heading="Không phải để biết trước, mà để hiểu rõ hơn."
        description="Tử Vi tại Ngọc Âm không dừng ở việc dự đoán. Đó là một công cụ khai vấn — giúp bạn nhìn rõ bản thân, hoàn cảnh và những chu kỳ đang vận hành, để chủ động hơn trên hành trình của chính mình."
        image="/images/01-hero-ngoc-am.webp"
        imageAlt="Phong cảnh núi non Việt Nam trong sương sớm"
      />
      <PhilosophyPillars
        eyebrow="Triết lý"
        heading="Bốn giai đoạn của một phiên khai vấn Tử Vi."
        pillars={pillars}
      />
      <ConsultantProfile
        consultant={trang}
        image="/images/21-homepage-tu-vi-manuscript.webp"
        imageAlt="Lá số Tử Vi viết tay trên bàn gỗ cổ"
      />
      <ServiceList
        eyebrow="Dịch vụ"
        heading="Khai vấn Tử Vi"
        items={tuViServices}
        background="bg-ivory"
      />
      <ConsultationProcess />
      <CtaBand />
    </>
  );
}

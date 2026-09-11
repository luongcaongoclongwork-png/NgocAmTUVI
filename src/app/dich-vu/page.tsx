import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Services from "@/components/Services";
import ConsultationProcess from "@/components/ConsultationProcess";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Dịch vụ tư vấn — Ngọc Âm",
  description:
    "Các phiên khai vấn Tử Vi và tư vấn Phong Thuỷ tại Ngọc Âm — từ một vấn đề chuyên sâu đến tổng quan toàn lá số hoặc không gian sống.",
};

export default function DichVuPage() {
  return (
    <>
      <PageBanner
        eyebrow="Dịch vụ tư vấn"
        heading="Chọn phiên khai vấn phù hợp với điều bạn đang tìm kiếm."
        description="Mỗi phiên khai vấn tại Ngọc Âm được chuẩn bị riêng theo câu hỏi và hoàn cảnh của bạn — không có câu trả lời soạn sẵn."
        image="/images/27-homepage-phong-thuy-dia-the.webp"
        imageAlt="Phong cảnh núi sông Việt Nam trong sương sớm"
      />
      <Services />
      <ConsultationProcess />
      <CtaBand />
    </>
  );
}

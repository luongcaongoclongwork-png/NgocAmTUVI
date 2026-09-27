import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import PhilosophyPillars from "@/components/PhilosophyPillars";
import ServiceList from "@/components/ServiceList";
import ConsultationProcess from "@/components/ConsultationProcess";
import CtaBand from "@/components/CtaBand";
import { getServicesByGroup } from "@/lib/services";
import { BASE_GLOSSARY_TERMS, DAI_CHU_SU_TERM } from "@/data/xuyenVanGlossary";

export const metadata: Metadata = {
  title: "Xuyên Vấn Đại Chủ Sự — Ngọc Âm",
  description:
    "Xuyên Vấn Đại Chủ Sự — dành riêng cho business coaching. Luận Diệm Bản cùng Đại Chủ Sự để hiểu rõ chính mình trước khi dẫn dắt người khác.",
};

const pillars = [
  {
    word: "Đại",
    desc: "Không nằm ở quy mô cơ nghiệp, mà ở tầm vóc bên trong của người cầm lái.",
  },
  {
    word: "Chủ",
    desc: "Là người chịu trách nhiệm sau cùng cho những quyết định lớn.",
  },
  {
    word: "Sự",
    desc: "Là cơ nghiệp vận hành xoay quanh chủ nhân tâm.",
  },
];

export default async function DaiChuSuPage() {
  const services = await getServicesByGroup("dai-chu-su");

  return (
    <>
      <PageBanner
        eyebrow="Xuyên Vấn Đại Chủ Sự"
        heading="Vững vàng trước khi dẫn dắt người khác."
        description="Đại Chủ Sự không phải một chức danh, mà là người đủ vững vàng giữ cơ nghiệp đi qua mọi biến động — minh triết hiểu rõ chính mình trước khi dẫn dắt người khác. Dành riêng cho business coaching."
        image="/images/23-homepage-heritage-study.webp"
        imageAlt="Không gian thư phòng cổ, nơi bàn định hướng lớn cho người cầm lái doanh nghiệp"
      />

      <PhilosophyPillars eyebrow="Ba chữ" heading="Đại Chủ Sự nghĩa là gì." pillars={pillars} />

      {/* Packages live in /admin/dich-vu (group "Đại Chủ Sự"), like Tử Vi and Phong Thuỷ. */}
      <ServiceList eyebrow="Dịch vụ" heading="Xuyên vấn Đại Chủ Sự" items={services} background="bg-ivory" />

      <PhilosophyPillars
        eyebrow="Chú giải thuật ngữ"
        heading="Ngôn ngữ riêng của Ngọc Âm."
        pillars={[...BASE_GLOSSARY_TERMS, DAI_CHU_SU_TERM]}
        footnote="Xuyên Giả: Nguyễn Minh Trang"
        background="bg-parchment/60"
      />

      <ConsultationProcess />
      <CtaBand />
    </>
  );
}

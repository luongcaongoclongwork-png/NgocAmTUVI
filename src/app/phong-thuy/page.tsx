import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageBanner from "@/components/PageBanner";
import PhilosophyPillars from "@/components/PhilosophyPillars";
import ConsultantProfile from "@/components/ConsultantProfile";
import ServiceList from "@/components/ServiceList";
import CtaBand from "@/components/CtaBand";
import { CourtyardScene } from "@/components/illustrations";
import { phongThuyServices } from "@/data/services";
import { consultants } from "@/data/consultants";

export const metadata: Metadata = {
  title: "Phong Thuỷ Là Tịnh — Ngọc Âm",
  description:
    "Tư vấn Phong Thuỷ Dương Trạch và Âm Trạch tại Ngọc Âm, cùng Thầy Tịnh — quan sát, tịnh hoá, hài hoà và tự chủ hướng đến thịnh vượng chân thật.",
};

const pillars = [
  {
    word: "Quan sát",
    desc: "Trước khi điều chỉnh bất cứ điều gì, Phong Thuỷ bắt đầu từ việc quan sát kỹ lưỡng không gian, con người và mối quan hệ giữa chúng.",
  },
  {
    word: "Tịnh hoá",
    desc: "Thanh lọc không gian sống và làm việc khỏi những yếu tố gây nhiễu, để dòng khí lưu chuyển tự nhiên và rõ ràng hơn.",
  },
  {
    word: "Hài hoà",
    desc: "Tìm sự cân bằng giữa con người và môi trường sống, thay vì áp đặt những quy tắc cứng nhắc lên không gian.",
  },
  {
    word: "Tự chủ",
    desc: "Trang bị cho bạn khả năng tự nhận biết và điều chỉnh không gian sống của mình, không phụ thuộc vào sự can thiệp liên tục từ bên ngoài.",
  },
  {
    word: "Thịnh vượng chân thật",
    desc: "Không phải sự giàu có nhất thời, mà là sự ổn định và an nhiên bền vững đến từ một không gian sống hài hoà.",
  },
];

const tinh = consultants.find((c) => c.id === "thay-tinh")!;

export default function PhongThuyPage() {
  return (
    <>
      <PageBanner
        eyebrow="Phong Thuỷ Là Tịnh"
        heading="Một nghệ thuật quan sát, không phải phép thuật."
      >
        <Reveal delay={220}>
          <blockquote className="mt-8 max-w-2xl border-l-2 border-gold pl-6 text-[15px] italic leading-relaxed text-bronze">
            &ldquo;Sự quan sát bao trùm để hoà hợp với quy luật thiêng liêng
            của đất. Từ việc tịnh hoá không gian và nội tâm để chuyển hoá mọi
            biến động ngoại cảnh, mở ra góc nhìn thấu suốt sự thật nguyên bản,
            tự chủ hướng đến sự thịnh vượng đích thực.&rdquo;
          </blockquote>
        </Reveal>
      </PageBanner>
      <PhilosophyPillars
        eyebrow="Triết lý"
        heading="Năm nguyên lý của Phong Thuỷ Là Tịnh."
        pillars={pillars}
      />
      <ConsultantProfile consultant={tinh} Art={CourtyardScene} reverse />
      <ServiceList
        eyebrow="Dịch vụ"
        heading="Tư vấn Phong Thuỷ"
        items={phongThuyServices}
        background="bg-ivory"
      />
      <CtaBand />
    </>
  );
}

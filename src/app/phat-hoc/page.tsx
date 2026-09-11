import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import PhilosophyPillars from "@/components/PhilosophyPillars";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Phật học — Ngọc Âm",
  description:
    "Ngọc Âm ứng dụng tinh thần Phật học — vô thường, nhân quả, tỉnh thức và buông xả — vào cách khai vấn Tử Vi và tư vấn Phong Thuỷ.",
};

const pillars = [
  {
    word: "Vô thường",
    desc: "Không có điều gì đứng yên mãi mãi — kể cả những giai đoạn khó khăn nhất trong một lá số. Hiểu vô thường giúp nhìn vận hạn nhẹ nhàng hơn, không phải để lo sợ mà để chuẩn bị.",
  },
  {
    word: "Nhân quả",
    desc: "Mỗi lựa chọn đều để lại dấu vết. Nhân quả không phải một sự trừng phạt, mà là quy luật tự nhiên nhắc mỗi người có trách nhiệm với quyết định của chính mình.",
  },
  {
    word: "Tỉnh thức",
    desc: "Trước khi hành động, dừng lại để quan sát chính mình. Sự tỉnh thức là nền tảng để một buổi khai vấn hay một điều chỉnh Phong Thuỷ thực sự có ý nghĩa.",
  },
  {
    word: "Buông xả",
    desc: "Không phải từ bỏ trách nhiệm, mà là biết đặt xuống những điều đã qua để nhẹ nhàng bước tiếp trên hành trình phía trước.",
  },
];

const phatHocArticles = articles.filter((a) => a.category === "Phật học");

export default function PhatHocPage() {
  return (
    <>
      <PageBanner
        eyebrow="Phật học"
        heading="Một tinh thần nền, không phải một giáo lý áp đặt."
        description="Ngọc Âm không truyền đạo. Nhưng tinh thần Phật học — nhìn vạn sự vô thường, tôn trọng nhân quả, giữ sự tỉnh thức — là nền tảng cho cách chúng tôi khai vấn Tử Vi và tư vấn Phong Thuỷ."
      />
      <PhilosophyPillars
        eyebrow="Tinh thần"
        heading="Bốn điều Ngọc Âm mang theo trong mỗi phiên khai vấn."
        pillars={pillars}
      />

      {phatHocArticles.length > 0 && (
        <section className="bg-parchment/60 py-24 lg:py-28">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <Reveal>
              <p className="tracking-label text-[12px] font-medium uppercase text-gold">
                Đọc thêm
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 max-w-xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
                Góc nhìn Phật học từ Ngọc Âm Kiến Thức.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {phatHocArticles.map((a, idx) => (
                <ArticleCard key={a.slug} article={a} delay={idx * 90} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}

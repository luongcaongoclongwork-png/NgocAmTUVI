import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import ArticleCard from "@/components/ArticleCard";
import CtaBand from "@/components/CtaBand";
import { getArticles } from "@/lib/articles";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ngọc Âm Kiến Thức",
  description:
    "Tử Vi, Phong Thuỷ, Phật học, văn hoá và phát triển nội lực — tri thức phương Đông đọc theo nhịp sống hiện đại.",
};

export default async function KienThucPage() {
  const articles = await getArticles();
  return (
    <>
      <PageBanner
        eyebrow="Ngọc Âm Kiến Thức"
        heading="Tri thức phương Đông, đọc theo nhịp sống hiện đại."
        description="Những bài viết ngắn gọn về Tử Vi, Phong Thuỷ, Phật học và văn hoá — không phải để tin ngay, mà để suy ngẫm."
        image="/images/09-trang-an-son-thuy-3d.webp"
        imageAlt="Sông núi Tràng An trong sương sớm"
      />

      <section className="bg-ivory py-20 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, idx) => (
              <ArticleCard key={a.slug} article={a} delay={(idx % 3) * 90} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

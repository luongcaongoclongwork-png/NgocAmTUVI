import type { Metadata } from "next";
import { getArticles } from "@/lib/articles";
import { InkClose, InkHero, InkNotes, InkPage, InkSection } from "@/components/thuy-mac/kit";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sổ tay Ngọc Âm",
  description: "Tử Vi, Phong Thuỷ, Phật học, văn hoá và phát triển nội lực: tri thức phương Đông đọc theo nhịp sống hiện đại.",
};

export default async function SoTayPage() {
  const articles = await getArticles();

  return (
    <InkPage>
      <InkHero
        compact
        image="/images/09-trang-an-son-thuy-3d.webp"
        alt="Sông núi Tràng An trong sương sớm"
        scrolls={["Sổ tay", "Ngọc Âm"]}
        lede={
          <>
            <p>Tri thức phương Đông, đọc theo nhịp sống hiện đại.</p>
            <small>Những bài viết ngắn về Tử Vi, Phong Thuỷ, Phật học và văn hoá, không phải để tin ngay, mà để suy ngẫm. Mỗi bài ghi ngày theo âm lịch.</small>
          </>
        }
      />
      <InkSection>
        <InkNotes articles={articles} lead />
      </InkSection>
      <InkClose />
    </InkPage>
  );
}

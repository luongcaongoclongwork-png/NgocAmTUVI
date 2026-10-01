import type { Metadata } from "next";
import { getArticles } from "@/lib/articles";
import { InkClose, InkEngrave, InkHero, InkNotes, InkPage, InkSection, Scrolls } from "@/components/thuy-mac/kit";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sổ Tay Ngọc Âm: Kiến thức và Phật học",
  description:
    "Sổ tay Ngọc Âm gồm hai phần. Kiến thức: Tử Vi, Phong Thuỷ, văn hoá và phát triển nội lực. Phật học: vô thường, nhân quả, tỉnh thức và buông xả trong cách Ngọc Âm Xuyên vấn.",
};

const PHAT_HOC = "Phật học";

const spirit = [
  { word: "Vô thường", desc: "Không có điều gì đứng yên mãi mãi, kể cả những giai đoạn khó khăn nhất trong một Diệm Bản. Hiểu vô thường giúp nhìn vận hạn nhẹ nhàng hơn, không phải để lo sợ mà để chuẩn bị." },
  { word: "Nhân quả", desc: "Mỗi lựa chọn đều để lại dấu vết. Nhân quả không phải một sự trừng phạt, mà là quy luật tự nhiên nhắc mỗi người có trách nhiệm với quyết định của chính mình." },
  { word: "Tỉnh thức", desc: "Trước khi hành động, dừng lại để quan sát chính mình. Sự tỉnh thức là nền tảng để một phiên Xuyên vấn hay một điều chỉnh Phong Thuỷ thực sự có ý nghĩa." },
  { word: "Buông xả", desc: "Không phải từ bỏ trách nhiệm, mà là biết đặt xuống những điều đã qua để nhẹ nhàng bước tiếp trên hành trình phía trước." },
];

/** Sổ tay: one page, two parts. Kiến thức holds every article outside the Phật học category; Phật học holds its spirit and its own articles. */
export default async function SoTayPage() {
  const articles = await getArticles();
  const knowledge = articles.filter((a) => a.category !== PHAT_HOC);
  const buddhist = articles.filter((a) => a.category === PHAT_HOC);

  return (
    <InkPage>
      <InkHero
        compact
        image="/images/09-trang-an-son-thuy-3d.webp"
        alt="Sông núi Tràng An trong sương sớm"
        scrolls={["Sổ Tay", "Ngọc Âm"]}
        lede={
          <>
            <p>Tri thức phương Đông, đọc theo nhịp sống hiện đại.</p>
            <small>Sổ Tay có hai phần: Kiến thức và Phật học. Những bài viết ngắn không phải để tin ngay, mà để suy ngẫm. Mỗi bài ghi ngày theo âm lịch.</small>
          </>
        }
      />

      <nav className="ipParts" aria-label="Các phần của Sổ tay">
        <a href="#kien-thuc">Kiến thức</a>
        <a href="#phat-hoc">Phật học</a>
      </nav>

      <div id="kien-thuc" className="ipPart">
        <InkSection title="Kiến thức" intro={<p>Tử Vi, Phong Thuỷ, văn hoá và phát triển nội lực.</p>}>
          <InkNotes articles={knowledge} lead />
        </InkSection>
      </div>

      <div id="phat-hoc" className="ipPart">
        <InkSection
          tone="raised"
          title="Phật học"
          intro={
            <>
              <p>Một tinh thần nền, không phải một giáo lý áp đặt.</p>
              <p>Ngọc Âm không truyền đạo. Nhưng tinh thần Phật học (nhìn vạn sự vô thường, tôn trọng nhân quả, giữ sự tỉnh thức) là nền tảng cho cách chúng tôi Xuyên vấn Tử Vi và tư vấn Phong Thuỷ.</p>
            </>
          }
          backdrop={{ image: "/images/18-tuyen-lam-tinh-suong-3d.webp" }}
        >
          <Scrolls items={spirit} />
        </InkSection>
        <InkEngrave />
        {buddhist.length > 0 && (
          <InkSection title="Góc nhìn Phật học">
            <InkNotes articles={buddhist} />
          </InkSection>
        )}
      </div>

      <InkClose />
    </InkPage>
  );
}

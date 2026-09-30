import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import { InkClose, InkEngrave, InkHero, InkNotes, InkPage, InkSection, Scrolls } from "@/components/thuy-mac/kit";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Phật học — Ngọc Âm",
  description:
    "Ngọc Âm ứng dụng tinh thần Phật học (vô thường, nhân quả, tỉnh thức và buông xả) vào cách Xuyên vấn Tử Vi và tư vấn Phong Thuỷ.",
};

const spirit = [
  { word: "Vô thường", desc: "Không có điều gì đứng yên mãi mãi, kể cả những giai đoạn khó khăn nhất trong một Diệm Bản. Hiểu vô thường giúp nhìn vận hạn nhẹ nhàng hơn, không phải để lo sợ mà để chuẩn bị." },
  { word: "Nhân quả", desc: "Mỗi lựa chọn đều để lại dấu vết. Nhân quả không phải một sự trừng phạt, mà là quy luật tự nhiên nhắc mỗi người có trách nhiệm với quyết định của chính mình." },
  { word: "Tỉnh thức", desc: "Trước khi hành động, dừng lại để quan sát chính mình. Sự tỉnh thức là nền tảng để một phiên Xuyên vấn hay một điều chỉnh Phong Thuỷ thực sự có ý nghĩa." },
  { word: "Buông xả", desc: "Không phải từ bỏ trách nhiệm, mà là biết đặt xuống những điều đã qua để nhẹ nhàng bước tiếp trên hành trình phía trước." },
];

export default async function PhatHocPage() {
  const articles = await getArticlesByCategory("Phật học");

  return (
    <InkPage>
      <InkHero
        image="/images/18-tuyen-lam-tinh-suong-3d.webp"
        alt="Hồ Tuyền Lâm tĩnh lặng trong sương sớm"
        scrolls={["Phật học"]}
        lede={
          <>
            <p>Một tinh thần nền, không phải một giáo lý áp đặt.</p>
            <small>Ngọc Âm không truyền đạo. Nhưng tinh thần Phật học (nhìn vạn sự vô thường, tôn trọng nhân quả, giữ sự tỉnh thức) là nền tảng cho cách chúng tôi Xuyên vấn Tử Vi và tư vấn Phong Thuỷ.</small>
          </>
        }
      />

      <InkSection id="tinh-than" title="Bốn điều Ngọc Âm mang theo trong mỗi phiên Xuyên vấn">
        <Scrolls items={spirit} />
      </InkSection>

      <InkEngrave />

      {articles.length > 0 && (
        <InkSection tone="raised" id="doc-them" title="Góc nhìn Phật học trong Sổ tay">
          <InkNotes articles={articles} />
        </InkSection>
      )}

      <InkClose />
    </InkPage>
  );
}

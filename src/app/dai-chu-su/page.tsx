import type { Metadata } from "next";
import { getServicesByGroup } from "@/lib/services";
import { getConsultantBySlug } from "@/lib/consultants";
import { BASE_GLOSSARY_TERMS, DAI_CHU_SU_TERM } from "@/data/xuyenVanGlossary";
import { InkClose, InkEngrave, InkHero, InkPage, InkPerson, InkSection, InkServices, InkSteps, Scrolls } from "@/components/thuy-mac/kit";

export const metadata: Metadata = {
  title: "Xuyên Vấn Đại Chủ Sự — Ngọc Âm",
  description:
    "Xuyên Vấn Đại Chủ Sự, dành riêng cho business coaching. Luận Diệm Bản cùng Đại Chủ Sự để hiểu rõ chính mình trước khi dẫn dắt người khác.",
};

const threeWords = [
  { word: "Đại", desc: "Không nằm ở quy mô cơ nghiệp, mà ở tầm vóc bên trong của người cầm lái." },
  { word: "Chủ", desc: "Là người chịu trách nhiệm sau cùng cho những quyết định lớn." },
  { word: "Sự", desc: "Là cơ nghiệp vận hành xoay quanh chủ nhân tâm." },
];

export default async function DaiChuSuPage() {
  const [services, trang] = await Promise.all([getServicesByGroup("dai-chu-su"), getConsultantBySlug("co-minh-trang")]);

  return (
    <InkPage>
      <InkHero
        image="/images/23-homepage-heritage-study.webp"
        alt="Thư phòng cổ, nơi bàn định hướng lớn cho người cầm lái doanh nghiệp"
        scrolls={["Đại", "Chủ", "Sự"]}
        lede={
          <>
            <p>Vững vàng trước khi dẫn dắt người khác.</p>
            <small>Đại Chủ Sự không phải một chức danh, mà là người đủ vững vàng giữ cơ nghiệp đi qua mọi biến động: minh triết hiểu rõ chính mình trước khi dẫn dắt người khác. Dành riêng cho business coaching.</small>
          </>
        }
      />

      <InkSection id="ba-chu" title="Ba chữ Đại Chủ Sự">
        <Scrolls items={threeWords} />
      </InkSection>

      {/* the Xuyên giả of this path, as on the Tử Vi page */}
      {trang && (
        <InkSection tone="raised">
          <InkPerson
            name={trang.name}
            role="Xuyên Giả Xuyên Vấn Đại Chủ Sự"
            photo={trang.photo}
            bio={trang.bio}
            href="/lien-he?topic=dai-chu-su"
            cta="Đặt Lịch Đại Chủ Sự Cùng Cô"
          />
        </InkSection>
      )}

      <InkSection id="goi" title="Xuyên vấn cho người cầm lái" intro={<p>Buổi đầu luận Diệm Bản của chính Đại Chủ Sự; những buổi sau đi vào vấn đề hệ trọng của doanh nghiệp.</p>}>
        <InkServices items={services} />
      </InkSection>

      <InkEngrave />

      <InkSection id="thuat-ngu" title="Ngôn ngữ riêng của Ngọc Âm" intro={<p>Xuyên giả: Nguyễn Minh Trang</p>}>
        <Scrolls items={[...BASE_GLOSSARY_TERMS, DAI_CHU_SU_TERM]} />
      </InkSection>

      <InkSection tone="raised" id="quy-trinh" title="Một phiên Xuyên vấn diễn ra thế nào">
        <InkSteps />
      </InkSection>

      <InkClose href="/lien-he?topic=dai-chu-su" label="Đặt Lịch Đại Chủ Sự" />
    </InkPage>
  );
}

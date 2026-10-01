import type { Metadata } from "next";
import Link from "next/link";
import { getServicesByGroup } from "@/lib/services";
import { getConsultantBySlug } from "@/lib/consultants";
import { BASE_GLOSSARY_TERMS } from "@/data/xuyenVanGlossary";
import { InkClose, InkEngrave, InkHero, InkPage, InkPerson, InkSection, InkServices, InkSteps, Scrolls } from "@/components/thuy-mac/kit";

export const metadata: Metadata = {
  title: "Tử Vi Xuyên Tam Diệm — Ngọc Âm",
  description:
    "Xuyên vấn Tử Vi tại Ngọc Âm: Xuyên vấn, định hướng, phát triển nội lực và chuyển hoá điều bất như ý, cùng Xuyên giả Nguyễn Minh Trang.",
};

const stages = [
  { word: "Xuyên vấn", desc: "Không phải xem để biết trước, mà để mở ra một cuộc đối thoại: giữa bạn với chính Diệm Bản của mình, giữa hiện tại với những gì đã qua." },
  { word: "Định hướng", desc: "Từ những gì quan sát được, gợi mở các hướng đi khả dĩ, để bạn tự cân nhắc và lựa chọn thay vì bị dẫn dắt." },
  { word: "Phát triển nội lực", desc: "Hiểu rõ điểm mạnh, điểm yếu và chu kỳ của bản thân là nền tảng để xây dựng nội lực bền vững, không phụ thuộc vào may rủi." },
  { word: "Chuyển hoá điều bất như ý", desc: "Những giai đoạn khó khăn trong Diệm Bản không phải để né tránh, mà để chuẩn bị, và chuyển hoá thành bài học trưởng thành." },
];

export default async function TuViPage() {
  const [trang, services] = await Promise.all([getConsultantBySlug("co-minh-trang"), getServicesByGroup("tu-vi")]);

  return (
    <InkPage>
      <InkHero
        image="/images/tu-vi/page-banner.webp"
        alt="Diệm Bản Tử Vi Xuyên Tam Diệm, ấn ngọc và trầm hương trên bàn gỗ cổ"
        scrolls={["Tử Vi", "Xuyên Tam Diệm"]}
        lede={
          <>
            <p>Không phải để biết trước, mà để hiểu rõ hơn.</p>
            <small>Tử Vi tại Ngọc Âm là một công cụ Xuyên vấn: nhìn rõ bản thân, hoàn cảnh và những chu kỳ đang vận hành, để chủ động hơn trên hành trình của chính mình.</small>
          </>
        }
      />

      <InkSection id="giai-doan" title="Bốn giai đoạn của một phiên Xuyên vấn">
        <Scrolls items={stages} />
      </InkSection>

      {trang && (
        <InkSection tone="raised">
          <InkPerson
            name={trang.name}
            role="Xuyên Giả Tử Vi Xuyên Tam Diệm"
            photo={trang.photo}
            bio={trang.bio}
            href="/lien-he?topic=tu-vi"
            cta="Đặt Lịch Xuyên Vấn Cùng Cô"
          />
        </InkSection>
      )}

      <InkSection id="cac-phien" title="Các phiên Xuyên vấn" intro={<p>Giá và thời lượng từng phiên. Chọn một phiên để gửi đôi dòng; Ngọc Âm liên hệ lại để hẹn giờ.</p>}>
        <InkServices items={services} />
      </InkSection>

      <InkSection tone="ink" id="dung-thu" title="Xem trước Diệm Bản của bạn" intro={<p>Công cụ lập lá số miễn phí của Ngọc Âm cho bạn thấy tấm bản đồ 12 cung. Phiên Xuyên vấn là lúc cùng Xuyên giả đọc tấm bản đồ ấy.</p>}>
        <p>
          <Link href="/lap-la-so" className="ipBtn">Lập Lá Số Miễn Phí</Link>
        </p>
      </InkSection>

      <InkSection id="thuat-ngu" title="Ngôn ngữ riêng của Ngọc Âm">
        <Scrolls items={BASE_GLOSSARY_TERMS} />
      </InkSection>

      <InkEngrave />

      <InkSection id="quy-trinh" title="Một phiên Xuyên vấn diễn ra thế nào">
        <InkSteps />
      </InkSection>

      <InkClose href="/lien-he?topic=tu-vi" />
    </InkPage>
  );
}

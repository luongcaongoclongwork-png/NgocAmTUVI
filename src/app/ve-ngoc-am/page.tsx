import type { Metadata } from "next";
import { getConsultants } from "@/lib/consultants";
import { InkClose, InkEngrave, InkHero, InkPage, InkPerson, InkProse, InkSection } from "@/components/thuy-mac/kit";
import Philosophy from "@/components/Philosophy";

export const metadata: Metadata = {
  title: "Về Ngọc Âm",
  description:
    "Ngọc Âm, hậu nhân Khâm Thiên Giám dưới triều vua Minh Mạng, triều Nguyễn. Mạch truyền thừa, những người Xuyên vấn và tinh thần Khương – Lạc – Tịnh.",
};

const ROLE: Record<string, { role: string; href?: string; cta?: string }> = {
  "co-minh-trang": { role: "Xuyên giả Tử Vi Xuyên Tam Diệm", href: "/lien-he?topic=tu-vi", cta: "Đặt Lịch Xuyên Vấn Cùng Cô" },
  "thay-tinh": { role: "Tư vấn Phong Thuỷ", href: "/lien-he?topic=phong-thuy", cta: "Đặt Lịch Tư Vấn Cùng Thầy" },
  khuong: { role: "Trà Sư Ngọc Âm", href: "/tra-dao", cta: "Đến Với Trà Đạo" },
};

export default async function VeNgocAmPage() {
  const people = await getConsultants();

  return (
    <InkPage>
      <InkHero
        image="/images/04-phong-thuy-dia-the.webp"
        alt="Quần thể kiến trúc cổ Việt Nam nhìn từ trên cao"
        scrolls={["Về", "Ngọc Âm"]}
        lede={
          <>
            <p>Một mạch truyền thừa, không phải một lời tiên tri.</p>
            <small>Ngọc Âm ra đời từ một dòng tri thức phương Đông được gìn giữ qua nhiều thế hệ, không để dự đoán thay bạn, mà để cùng bạn nhìn rõ hơn con đường phía trước.</small>
          </>
        }
      />

      <InkSection id="truyen-thua" narrow title="Hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn">
        <InkProse>
          <blockquote>Kế thừa tri thức chiêm tinh, lịch pháp và phong thuỷ cung đình từ Khâm Thiên Giám thời vua Minh Mạng, triều Nguyễn.</blockquote>
          <p>
            Ngọc Âm được hình thành từ một mạch truyền thừa tri thức phương Đông (chiêm tinh, lịch pháp, địa lý và phong thuỷ) vốn được lưu giữ và nghiên cứu qua nhiều thế hệ trong dòng họ có liên hệ với Khâm Thiên Giám dưới triều Nguyễn.
          </p>
          <p>
            Chúng tôi tiếp cận tri thức ấy không phải để dự đoán, mà để cùng bạn quan sát rõ hơn bản thân và hoàn cảnh, từ đó đưa ra những lựa chọn có cân nhắc và vững vàng hơn trên hành trình phát triển của chính mình.
          </p>
        </InkProse>
      </InkSection>

      <InkEngrave />

      {people.map((p, i) => (
        <InkSection key={p.id} tone={i % 2 ? "paper" : "raised"}>
          <InkPerson name={p.name} role={ROLE[p.slug]?.role ?? p.field} photo={p.photo} bio={p.bio} href={ROLE[p.slug]?.href} cta={ROLE[p.slug]?.cta} reverse={i % 2 === 1} />
        </InkSection>
      ))}

      {/* as on the home page: the first site's section, unchanged */}
      <div id="tinh-than" className="hSpiritV1">
        <Philosophy />
      </div>

      <InkClose />
    </InkPage>
  );
}

import type { Metadata } from "next";
import { getServicesByGroup } from "@/lib/services";
import { getConsultantBySlug } from "@/lib/consultants";
import { InkClose, InkEngrave, InkHero, InkPage, InkPerson, InkSection, InkServices, InkSteps, Scrolls } from "@/components/thuy-mac/kit";

export const metadata: Metadata = {
  title: "Phong Thuỷ Là Tịnh — Ngọc Âm",
  description:
    "Tư vấn Phong Thuỷ Dương Trạch và Âm Trạch tại Ngọc Âm, cùng Thầy Tịnh: quan sát, tịnh hoá, hài hoà và tự chủ hướng đến thịnh vượng chân thật.",
};

const principles = [
  { word: "Quan sát", desc: "Trước khi điều chỉnh bất cứ điều gì, Phong Thuỷ bắt đầu từ việc quan sát kỹ lưỡng không gian, con người và mối quan hệ giữa chúng." },
  { word: "Tịnh hoá", desc: "Thanh lọc không gian sống và làm việc khỏi những yếu tố gây nhiễu, để dòng khí lưu chuyển tự nhiên và rõ ràng hơn." },
  { word: "Hài hoà", desc: "Tìm sự cân bằng giữa con người và môi trường sống, thay vì áp đặt những quy tắc cứng nhắc lên không gian." },
  { word: "Tự chủ", desc: "Trang bị cho bạn khả năng tự nhận biết và điều chỉnh không gian sống của mình, không phụ thuộc vào sự can thiệp liên tục từ bên ngoài." },
  { word: "Thịnh vượng chân thật", desc: "Không phải sự giàu có nhất thời, mà là sự ổn định và an nhiên bền vững đến từ một không gian sống hài hoà." },
];

export default async function PhongThuyPage() {
  const [tinh, services] = await Promise.all([getConsultantBySlug("thay-tinh"), getServicesByGroup("phong-thuy")]);

  return (
    <InkPage>
      <InkHero
        image="/images/25-homepage-phong-thuy-son-thuy.webp"
        alt="Nhà cổ bên sông nhìn ra núi trong sương sớm"
        scrolls={["Phong Thuỷ", "Là Tịnh"]}
        lede={<p>Một nghệ thuật quan sát, không phải phép thuật.</p>}
        quote="Sự quan sát bao trùm để hoà hợp với quy luật thiêng liêng của đất. Từ việc tịnh hoá không gian và nội tâm để chuyển hoá mọi biến động ngoại cảnh, mở ra góc nhìn thấu suốt sự thật nguyên bản, tự chủ hướng đến sự thịnh vượng đích thực."
      />

      <InkSection id="nguyen-ly" title="Năm nguyên lý của Phong Thuỷ Là Tịnh">
        <Scrolls items={principles} />
      </InkSection>

      {tinh && (
        <InkSection tone="raised">
          <InkPerson name={tinh.name} role={tinh.field} photo={tinh.photo} bio={tinh.bio} href="/lien-he?topic=phong-thuy" cta="Đặt lịch tư vấn cùng thầy" reverse />
        </InkSection>
      )}

      <InkSection id="dich-vu" title="Tư vấn Phong Thuỷ" intro={<p>Dương trạch và âm trạch, từ một góc làm việc đến cả ngôi nhà. Giá ghi là giá khởi điểm cho từng loại không gian.</p>}>
        <InkServices items={services} />
      </InkSection>

      <InkEngrave />

      <InkSection id="quy-trinh" title="Một buổi tư vấn diễn ra thế nào">
        <InkSteps />
      </InkSection>

      <InkClose href="/lien-he?topic=phong-thuy" label="Đặt lịch tư vấn Phong Thuỷ" />
    </InkPage>
  );
}

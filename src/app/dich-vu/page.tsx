import type { Metadata } from "next";
import Link from "next/link";
import { getServicesByGroup } from "@/lib/services";
import { InkClose, InkHero, InkPage, InkSection, InkServices, InkSteps } from "@/components/thuy-mac/kit";

export const metadata: Metadata = {
  title: "Bảng giá — Ngọc Âm",
  description:
    "Toàn bộ các phiên Xuyên vấn Tử Vi, tư vấn Phong Thuỷ và Xuyên Vấn Đại Chủ Sự tại Ngọc Âm, kèm giá và thời lượng.",
};

const GROUPS = [
  { id: "tu-vi", name: "Tử Vi Xuyên Tam Diệm", href: "/tu-vi", line: "Xuyên vấn, định hướng, phát triển nội lực, chuyển hoá điều bất như ý." },
  { id: "phong-thuy", name: "Phong Thuỷ Là Tịnh", href: "/phong-thuy", line: "Hoà hợp quy luật của đất, tịnh hoá không gian và nội tâm." },
  { id: "dai-chu-su", name: "Xuyên Vấn Đại Chủ Sự", href: "/dai-chu-su", line: "Vững vàng trước khi dẫn dắt người khác." },
] as const;

export default async function BangGiaPage() {
  const lists = await Promise.all(GROUPS.map((g) => getServicesByGroup(g.id)));

  return (
    <InkPage>
      <InkHero
        compact
        image="/images/27-homepage-phong-thuy-dia-the.webp"
        alt="Phong cảnh núi sông Việt Nam trong sương sớm"
        scrolls={["Bảng giá"]}
        lede={
          <>
            <p>Chọn phiên hợp với điều bạn đang tìm kiếm.</p>
            <small>Mỗi phiên được chuẩn bị riêng theo câu hỏi và hoàn cảnh của bạn.</small>
          </>
        }
      />

      {GROUPS.map((g, i) => (
        <InkSection key={g.id} id={g.id} tone={i % 2 ? "raised" : "paper"} title={g.name} intro={<p>{g.line} <Link href={g.href} className="ipLink">Tìm hiểu thêm</Link></p>}>
          <InkServices items={lists[i]} />
        </InkSection>
      ))}

      <InkSection id="quy-trinh" title="Một phiên diễn ra thế nào">
        <InkSteps />
      </InkSection>

      <InkClose />
    </InkPage>
  );
}

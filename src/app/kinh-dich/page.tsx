import type { Metadata } from "next";
import { ViewTransition } from "react";
import { InkClose, InkHero, InkPage, InkSection } from "@/components/thuy-mac/kit";
import { nen } from "@/components/thuy-mac/Painting";
import Link from "next/link";
import HexLines from "@/components/thuy-mac/kinh-dich/HexLines";
import { HEXAGRAMS } from "@/lib/kinh-dich";
import KinhDichTool from "@/components/thuy-mac/kinh-dich/KinhDichTool";

/* Kinh Dịch Xuyên Tam Diệm: a free casting tool, the 64 hexagrams, and a quiet path to a Xuyên vấn. */
export const metadata: Metadata = {
  title: "Kinh Dịch Xuyên Tam Diệm — Ngọc Âm",
  description: "Tự gieo một quẻ Kinh Dịch bằng ba đồng tiền, xem Hiện Bích, Hóa Bích, Nội Bích và tra cứu 64 quẻ theo cách gọi Xuyên Tam Diệm của Ngọc Âm. Lưu ảnh, xuất PDF hoặc in tờ quẻ.",
  alternates: { canonical: "/kinh-dich" },
};

export default async function KinhDichPage({ searchParams }: { searchParams: Promise<{ q?: string; k?: string }> }) {
  const { q, k } = await searchParams;
  return (
    <InkPage>
      <InkHero
        {...nen("H11")}
        alt="Khúc sông vắng trong sương sớm"
        scrolls={["Kinh Dịch"]}
        lede={
          <>
            <p>Kinh Dịch Xuyên Tam Diệm</p>
            <small>Một quẻ là tấm gương soi việc bạn đang hỏi: thế đang ở đâu, đang chuyển về đâu. Không phải để biết trước, mà để nhìn rõ hơn trước khi chọn.</small>
          </>
        }
      />
      <InkSection id="thinh-bich">
        <KinhDichTool initialCode={q} initialKham={Number(k)} />
      </InkSection>
      <InkSection id="sau-muoi-tu-que" title="Sáu mươi tư quẻ" tone="raised">
        <ul className="kdIndex">
          {HEXAGRAMS.map((q) => (
            <li key={q.so}>
              <Link href={`/kinh-dich/que/${q.so}`}>
                <ViewTransition name={`kd-que-${q.so}`} share="kdMorph" default="none">
                  <HexLines lines={q.hao} small label="" />
                </ViewTransition>
                <span className="kdIndex-so">{q.so}</span>
                <span className="kdIndex-ten">{q.ten_xtd}</span>
                <span className="kdIndex-goc">{q.ten_goc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </InkSection>
      <InkClose />
    </InkPage>
  );
}

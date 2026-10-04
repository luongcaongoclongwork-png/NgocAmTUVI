import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductCategoriesWithItems } from "@/lib/products";
import { InkClose, InkHero, InkPage, InkSection } from "@/components/thuy-mac/kit";
import { nen } from "@/components/thuy-mac/Painting";

export const metadata: Metadata = {
  title: "Vật Phẩm Ngọc Âm",
  description:
    "Ngọc phỉ thuý, ngọc Hoà Điền, đá phong thuỷ và đồ phong thuỷ được Ngọc Âm tuyển chọn. Liên hệ để được tư vấn trực tiếp trước khi đặt.",
};

/** Asking about one piece carries its name to the form, so nobody has to type it again. */
function askHref(name: string): string {
  return `/lien-he?topic=vat-pham&item=${encodeURIComponent(name)}`;
}

export default async function VatPhamPage() {
  const categories = await getProductCategoriesWithItems();

  return (
    <InkPage>
      <InkHero
        compact
        {...nen("H10")}
        alt="Tranh thuỷ mặc sông núi Việt Nam"
        scrolls={["Vật Phẩm"]}
        lede={
          <>
            <p>Vật phẩm đồng hành, không phải trọng tâm.</p>
            <small>Mỗi vật phẩm tại Ngọc Âm đều đi kèm tư vấn trực tiếp về chất liệu, ý nghĩa và cách dùng phù hợp với bản mệnh hoặc không gian của bạn. Đây không phải một gian hàng để chọn mua nhanh.</small>
          </>
        }
      />

      {categories.map((cat, i) => (
        <InkSection key={cat.id} id={cat.slug} tone={i % 2 ? "raised" : "paper"} title={cat.name} intro={cat.intro ? <p>{cat.intro}</p> : undefined}>
          {cat.image && (
            <span className="ipFigure ip-r" style={{ display: "block", aspectRatio: "21 / 9", marginTop: 32 }}>
              <Image src={cat.image} alt={cat.imageAlt ?? cat.name} fill sizes="(min-width: 1200px) 1180px, 100vw" />
            </span>
          )}
          <div className="ipCols">
            {cat.items.map((item) => (
              <div key={item.id} className="ipItem ip-r">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <Link href={askHref(item.name)} className="ipLink">Hỏi về vật phẩm này</Link>
              </div>
            ))}
          </div>
        </InkSection>
      ))}

      <InkClose href="/lien-he?topic=vat-pham" label="Hỏi Về Vật Phẩm" title="Chọn vật phẩm cùng người hiểu nó." text="Ngọc Âm tư vấn trực tiếp trước khi bạn đặt, trong một ngày làm việc." />
    </InkPage>
  );
}

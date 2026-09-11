import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { StillLifeStone } from "@/components/illustrations";
import { productCategories } from "@/data/products";

export const metadata: Metadata = {
  title: "Vật phẩm Ngọc Âm",
  description:
    "Ngọc phỉ thuý, ngọc Hoà Điền, đá phong thuỷ và đồ phong thuỷ được Ngọc Âm tuyển chọn — liên hệ để được tư vấn trực tiếp trước khi đặt.",
};

export default function CuaHangPage() {
  return (
    <>
      <PageBanner
        eyebrow="Vật phẩm Ngọc Âm"
        heading="Vật phẩm đồng hành, không phải trọng tâm."
        description="Mỗi vật phẩm tại Ngọc Âm đều đi kèm tư vấn trực tiếp — về chất liệu, ý nghĩa và cách sử dụng phù hợp với bản mệnh hoặc không gian của bạn. Đây không phải một gian hàng để chọn mua nhanh."
        image="/images/06-thuy-mac-song-huong.webp"
        imageAlt="Tranh thuỷ mặc sông núi Việt Nam"
      />

      {productCategories.map((cat, catIdx) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`py-20 lg:py-24 ${
            catIdx % 2 === 0 ? "bg-ivory" : "bg-parchment/60"
          }`}
        >
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <Reveal>
              <h2 className="font-heading text-2xl text-ink sm:text-3xl">
                {cat.name}
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/70">
                {cat.intro}
              </p>
            </Reveal>

            {cat.image && (
              <Reveal delay={90}>
                <div className="relative mt-8 h-64 w-full overflow-hidden border border-walnut/15 sm:h-80 lg:h-96">
                  <Image
                    src={cat.image}
                    alt={cat.imageAlt ?? cat.name}
                    fill
                    sizes="(min-width: 1024px) 1200px, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            )}

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item, idx) => (
                <Reveal key={item.name} delay={idx * 90}>
                  <div className="group">
                    <div className="aspect-square w-full overflow-hidden border border-walnut/15">
                      <StillLifeStone className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="mt-5 font-heading text-lg text-ink">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">
                      {item.desc}
                    </p>
                    <a
                      href="/#lien-he"
                      className="tracking-label mt-4 inline-block border-b border-gold pb-0.5 text-[10px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
                    >
                      Liên hệ để đặt
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}

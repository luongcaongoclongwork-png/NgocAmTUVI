import Image from "next/image";
import Link from "next/link";
import { StillLifeStone } from "./illustrations";
import Reveal from "./Reveal";
import SectionBackdrop from "./SectionBackdrop";
import { productCategories } from "@/data/products";

export default function Products() {
  return (
    <section id="cua-hang" className="relative overflow-hidden bg-walnut/5 py-24 lg:py-32">
      <SectionBackdrop
        image="/images/08-vat-pham-ngoc-am.png"
        tint="bg-ivory/85"
        position="top"
      />
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="tracking-label text-[12px] font-medium uppercase text-gold">
                Vật phẩm Ngọc Âm
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 max-w-xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
                Vật phẩm đồng hành, không phải trọng tâm.
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
                Ngọc phỉ thuý, đá phong thuỷ và đồ phong thuỷ được Ngọc Âm
                tuyển chọn như một phần mở rộng của hành trình tư vấn — không
                phải một gian hàng.
              </p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Link
              href="/cua-hang"
              className="tracking-label border-b border-gold pb-1 text-[11px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
            >
              Xem tất cả
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((c, idx) => (
            <Reveal key={c.id} delay={idx * 100}>
              <Link href="/cua-hang" className="group block">
                <div className="relative aspect-square w-full overflow-hidden border border-walnut/15">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.imageAlt ?? c.name}
                      fill
                      sizes="(min-width: 1024px) 300px, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <StillLifeStone className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                  )}
                </div>
                <h3 className="tracking-label mt-5 text-[12px] font-semibold uppercase text-ink">
                  {c.name}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

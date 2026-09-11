import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";
import SectionBackdrop from "./SectionBackdrop";
import { tuViServices, phongThuyServices } from "@/data/services";

export default function Services({ backdrop = false }: { backdrop?: boolean }) {
  return (
    <section id="dich-vu" className="relative overflow-hidden bg-ivory py-24 lg:py-32">
      {backdrop && (
        <SectionBackdrop
          image="/images/27-homepage-phong-thuy-dia-the.webp"
          tint="bg-ivory/78"
        />
      )}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            Dịch vụ tư vấn
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            Mỗi phiên khai vấn là một góc nhìn được chuẩn bị riêng cho bạn.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-16 gap-y-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="tracking-label border-b border-walnut/20 pb-4 text-[13px] font-semibold uppercase text-walnut">
                Khai vấn Tử Vi
              </p>
            </Reveal>
            <div>
              {tuViServices.map((s, idx) => (
                <ServiceCard key={s.title} {...s} delay={idx * 90} />
              ))}
            </div>
          </div>

          <div>
            <Reveal delay={60}>
              <p className="tracking-label border-b border-walnut/20 pb-4 text-[13px] font-semibold uppercase text-walnut">
                Tư vấn Phong Thuỷ
              </p>
            </Reveal>
            <div>
              {phongThuyServices.map((s, idx) => (
                <ServiceCard key={s.title} {...s} delay={idx * 90} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

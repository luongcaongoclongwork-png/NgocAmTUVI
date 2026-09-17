import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";
import SectionBackdrop from "./SectionBackdrop";
import { getServicesByGroup } from "@/lib/services";

export default async function Services({ backdrop = false }: { backdrop?: boolean }) {
  const [tuViServices, phongThuyServices] = await Promise.all([
    getServicesByGroup("tu-vi"),
    getServicesByGroup("phong-thuy"),
  ]);

  return (
    <section id="dich-vu" className="relative overflow-hidden bg-ivory py-24 lg:py-32">
      {backdrop && (
        <SectionBackdrop
          image="/images/03-dich-vu-tu-van.png"
          tint="bg-ivory/78"
          position="bottom"
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

        <div className="mt-16 flex flex-col gap-16">
          <div>
            <Reveal>
              <p className="tracking-label border-b border-walnut/20 pb-4 text-[13px] font-semibold uppercase text-walnut">
                Khai vấn Tử Vi
              </p>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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

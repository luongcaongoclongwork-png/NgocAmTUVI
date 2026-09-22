import Link from "next/link";
import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";
import SectionBackdrop from "./SectionBackdrop";
import { getServicesByGroup } from "@/lib/services";

export default async function Services({
  backdrop = false,
  preview = false,
}: {
  backdrop?: boolean;
  /** Homepage mode: show only a taste of each group, link out to the full catalogue. */
  preview?: boolean;
}) {
  const [tuViServicesAll, phongThuyServicesAll] = await Promise.all([
    getServicesByGroup("tu-vi"),
    getServicesByGroup("phong-thuy"),
  ]);
  const tuViServices = preview ? tuViServicesAll.slice(0, 3) : tuViServicesAll;
  const phongThuyServices = preview ? phongThuyServicesAll.slice(0, 3) : phongThuyServicesAll;

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
          <p className="tracking-label text-[12px] font-medium uppercase text-gold-deep">
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

        {preview && (
          <Reveal delay={120}>
            <div className="mt-14 flex justify-center">
              <Link
                href="/dich-vu"
                className="tracking-label border border-walnut px-8 py-3.5 text-[11px] font-semibold uppercase text-walnut transition-colors hover:border-gold-deep hover:text-gold-deep"
              >
                Xem tất cả dịch vụ
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

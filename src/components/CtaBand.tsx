import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export default function CtaBand() {
  return (
    <section id="dat-lich" className="relative overflow-hidden bg-walnut py-24 lg:py-28">
      <Image
        src="/images/06-dat-lich-mac-tram.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover"
        style={{ objectPosition: "bottom" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-walnut/20" />

      <div className="relative mx-auto max-w-[1000px] px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="font-heading text-3xl leading-snug text-ivory sm:text-4xl">
            Một góc nhìn rõ ràng có thể thay đổi cách bạn bước tiếp.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/lien-he"
              className="tracking-label bg-gold px-8 py-3.5 text-[11px] font-semibold uppercase text-ink transition-colors hover:bg-ivory"
            >
              Đặt lịch tư vấn
            </Link>
            <Link
              href="/dich-vu"
              className="tracking-label border border-ivory/50 px-8 py-3.5 text-[11px] font-semibold uppercase text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              Tìm hiểu dịch vụ
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export default function CtaBand() {
  return (
    <section id="lien-he" className="relative overflow-hidden bg-walnut py-24 lg:py-28">
      <Image
        src="/images/14-song-huong-binh-minh-3d.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-walnut/72" />
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-25"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,150 L160,90 340,140 540,70 740,130 940,80 1140,140 1320,90 1440,120 L1440,200 L0,200 Z"
          fill="#af8a50"
        />
      </svg>

      <div className="relative mx-auto max-w-[1000px] px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="font-heading text-3xl leading-snug text-ivory sm:text-4xl">
            Một góc nhìn rõ ràng có thể thay đổi cách bạn bước tiếp.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dich-vu"
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

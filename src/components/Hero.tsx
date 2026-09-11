import { HeroMountainScape } from "./illustrations";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-parchment">
      <HeroMountainScape />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1280px] px-6 pb-20 pt-40 lg:px-10">
        <Reveal>
          <p className="tracking-label mb-6 text-[12px] font-medium uppercase text-parchment/90">
            Ngọc Âm · Tử Vi · Phong Thuỷ
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="max-w-3xl font-heading text-4xl leading-[1.15] text-ivory sm:text-5xl lg:text-6xl">
            Hiểu mình. Thuận thế. Kiến tạo thịnh vượng.
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/85 sm:text-lg">
            Từ sự quan sát, khai vấn và định hướng, tìm về sự hài hoà giữa
            con người và hoàn cảnh.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#dich-vu"
              className="tracking-label bg-gold px-7 py-3.5 text-[11px] font-semibold uppercase text-ink transition-colors hover:bg-ivory"
            >
              Khám phá tư vấn
            </a>
            <a
              href="#ve-ngoc-am"
              className="tracking-label border border-ivory/60 px-7 py-3.5 text-[11px] font-semibold uppercase text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              Tìm hiểu Ngọc Âm
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

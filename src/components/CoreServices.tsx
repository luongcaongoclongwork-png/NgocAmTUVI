import Link from "next/link";
import { CourtyardScene, StudyDeskScene } from "./illustrations";
import Reveal from "./Reveal";

const pillars = [
  {
    id: "tu-vi",
    eyebrow: "Tử Vi Xuyên Tam Diệm",
    words: ["Khai vấn", "Định hướng", "Phát triển nội lực", "Chuyển hoá điều bất như ý"],
    cta: "Tìm hiểu Khai vấn Tử Vi",
    href: "/tu-vi",
    Art: StudyDeskScene,
  },
  {
    id: "phong-thuy",
    eyebrow: "Phong Thuỷ Là Tịnh",
    words: ["Quan sát", "Tịnh hoá", "Hài hoà", "Tự chủ", "Thịnh vượng chân thật"],
    cta: "Tìm hiểu Tư vấn Phong Thuỷ",
    href: "/phong-thuy",
    Art: CourtyardScene,
  },
];

export default function CoreServices() {
  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            Hai trụ cột triết học
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            Kế thừa tri thức cổ — Ứng dụng vào đời sống hiện đại.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-12">
          {pillars.map((p, idx) => (
            <Reveal key={p.id} delay={idx * 140}>
              <article id={p.id} className="flex h-full flex-col">
                <div className="overflow-hidden border border-walnut/10">
                  <p.Art className="h-64 w-full object-cover" />
                </div>
                <h3 className="mt-8 font-heading text-2xl text-ink">
                  {p.eyebrow}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm text-bronze">
                  {p.words.map((w, i) => (
                    <li key={w} className="flex items-center gap-3">
                      {i !== 0 && <span className="h-1 w-1 rounded-full bg-gold" />}
                      {w}
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className="tracking-label mt-8 inline-flex w-fit items-center gap-2 border-b border-gold pb-1 text-[11px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
                >
                  {p.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

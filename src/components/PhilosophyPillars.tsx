import Reveal from "./Reveal";

export type Pillar = { word: string; desc: string };

export default function PhilosophyPillars({
  eyebrow,
  heading,
  pillars,
  footnote,
  background = "bg-ivory",
}: {
  eyebrow: string;
  heading: string;
  pillars: Pillar[];
  /** Small centered attribution line under the grid, e.g. "Xuyên Giả: Nguyễn Minh Trang". */
  footnote?: string;
  background?: string;
}) {
  return (
    <section className={`${background} py-24 lg:py-28`}>
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold-deep">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            {heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {pillars.map((p, idx) => (
            <Reveal key={p.word} delay={idx * 90}>
              <div className="border-t border-walnut/20 pt-6">
                <h3 className="font-heading text-xl text-walnut">{p.word}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {footnote && (
          <Reveal delay={pillars.length * 90}>
            <p className="tracking-label mt-16 text-center text-[11px] uppercase text-walnut/45">
              {footnote}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

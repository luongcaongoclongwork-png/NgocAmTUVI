import Reveal from "./Reveal";
import { BaguaMark } from "./illustrations";
import { consultants, ROLE_TAGLINE } from "@/data/consultants";

export default function Consultants() {
  return (
    <section className="bg-parchment/60 py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            Đội ngũ khai vấn
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            Người đồng hành cùng bạn trên hành trình hiểu mình.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-12">
          {consultants.map((c, idx) => (
            <Reveal key={c.id} delay={idx * 140}>
              <article className="flex h-full flex-col border-t border-walnut/20 pt-8">
                <div className="flex items-center gap-5">
                  <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold">
                    <span className="font-heading text-lg">{c.initials}</span>
                    <BaguaMark className="absolute -bottom-1.5 -right-1.5 h-5 w-5 text-gold opacity-70" />
                  </span>
                  <div>
                    <p className="tracking-label text-[11px] font-semibold uppercase text-walnut">
                      {c.name}
                    </p>
                    <p className="mt-1 text-sm italic text-bronze">{c.field}</p>
                  </div>
                </div>

                <p className="tracking-label mt-6 text-[11px] font-semibold uppercase text-gold">
                  {ROLE_TAGLINE}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
                  {c.bio}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

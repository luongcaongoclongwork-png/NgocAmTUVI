import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";
import type { Service } from "@/lib/service-constants";

export default function ServiceList({
  eyebrow,
  heading,
  items,
  background = "bg-parchment/60",
}: {
  eyebrow: string;
  heading: string;
  items: Service[];
  background?: string;
}) {
  return (
    <section className={`${background} py-24 lg:py-28`}>
      <div className="mx-auto max-w-[900px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            {heading}
          </h2>
        </Reveal>

        <div className="mt-14">
          {items.map((s, idx) => (
            <ServiceCard key={s.title} {...s} delay={idx * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

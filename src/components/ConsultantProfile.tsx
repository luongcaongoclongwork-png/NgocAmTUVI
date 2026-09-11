import type { ComponentType } from "react";
import Reveal from "./Reveal";
import { ROLE_TAGLINE, type Consultant } from "@/data/consultants";

export default function ConsultantProfile({
  consultant,
  Art,
  reverse = false,
}: {
  consultant: Consultant;
  Art: ComponentType<{ className?: string }>;
  reverse?: boolean;
}) {
  return (
    <section className="bg-parchment/60 py-24 lg:py-32">
      <div
        className={`mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal>
          <div className="overflow-hidden border border-walnut/15">
            <Art className="h-[420px] w-full" />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            {consultant.field}
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-tight text-ink sm:text-4xl">
            {consultant.name}
          </h2>
          <p className="mt-4 text-[15px] font-semibold uppercase tracking-label text-bronze">
            {ROLE_TAGLINE}
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-ink/80">
            {consultant.bio}
          </p>
          <a
            href="/#lien-he"
            className="tracking-label mt-8 inline-flex w-fit items-center gap-2 border-b border-gold pb-1 text-[11px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
          >
            Đặt lịch khai vấn cùng {consultant.name}
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

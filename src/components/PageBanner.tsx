import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function PageBanner({
  eyebrow,
  heading,
  description,
  children,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-walnut/10 bg-parchment/50 pb-16 pt-36 lg:pb-20 lg:pt-44">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-3 max-w-2xl font-heading text-4xl leading-tight text-ink sm:text-5xl">
            {heading}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70">
              {description}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

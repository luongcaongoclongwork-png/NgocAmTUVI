import type { ReactNode } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function PageBanner({
  eyebrow,
  heading,
  description,
  image,
  imageAlt,
  children,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-walnut/10 bg-parchment/50 pb-16 pt-36 lg:pb-20 lg:pt-44">
      {image && (
        <>
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-parchment via-parchment/80 to-parchment/45" />
        </>
      )}
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
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

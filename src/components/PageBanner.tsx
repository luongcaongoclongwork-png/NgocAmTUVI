import type { ReactNode } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function PageBanner({
  eyebrow,
  heading,
  description,
  image,
  imageAlt,
  scrim = false,
  children,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  /**
   * Renders the same text-protection gradient the `image` prop normally
   * brings, without rendering an `<Image>` of its own — for callers that
   * paint their own background behind this component (e.g. a page-level
   * background shared with the content below it) but still need the
   * heading readable over whatever ends up there. Defaults to false so
   * every existing caller (image-less banners on a plain bg-parchment/50,
   * or image banners that already get this gradient) is unchanged.
   */
  scrim?: boolean;
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
          <div className="absolute inset-0 bg-gradient-to-r from-parchment via-parchment/80 to-parchment/35" />
        </>
      )}
      {!image && scrim && (
        // Localized around the text column instead of a full-width
        // left-to-right wash — the old gradient (still used for `image`
        // above) dimmed the ENTIRE left half of the banner just because
        // text happens to start there, leaving the right side looking
        // accidentally much clearer by comparison. This one only fades
        // the image right behind the eyebrow/heading/description; the
        // rest of the background (both left of the text and the whole
        // right side) stays as visible as that right side already was.
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 640px 420px at 30% 50%, var(--parchment) 0%, color-mix(in srgb, var(--parchment) 70%, transparent) 45%, transparent 78%)",
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold-deep">
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

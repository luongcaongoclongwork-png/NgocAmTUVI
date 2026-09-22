import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { ROLE_TAGLINE, type Consultant } from "@/lib/consultant-constants";

export default function ConsultantProfile({
  consultant,
  image,
  imageAlt,
  reverse = false,
  contactTopic,
}: {
  consultant: Consultant;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  /** Which /lien-he topic alias this consultant's own CTA should carry. */
  contactTopic: "tu-vi" | "phong-thuy";
}) {
  return (
    <section className="bg-parchment/60 py-24 lg:py-32">
      <div
        className={`mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal>
          <div className="relative h-[420px] w-full overflow-hidden border border-walnut/15">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold-deep">
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
          <Link
            href={`/lien-he?topic=${contactTopic}`}
            className="tracking-label mt-8 inline-flex w-fit items-center gap-2 border-b border-gold pb-1 text-[11px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
          >
            Đặt lịch khai vấn cùng {consultant.name}
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

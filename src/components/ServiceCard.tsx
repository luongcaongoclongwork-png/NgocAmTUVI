import Link from "next/link";
import Reveal from "./Reveal";
import type { Service } from "@/lib/service-constants";

export default function ServiceCard({
  title,
  desc,
  price,
  delay = 0,
}: Service & { delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="flex flex-col justify-between border-t border-walnut/15 py-7 first:border-t-0 sm:flex-row sm:items-start sm:gap-10">
        <div className="sm:max-w-sm">
          <h3 className="font-heading text-lg leading-snug text-ink">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{desc}</p>
        </div>
        <div className="mt-6 flex items-end justify-between gap-6 sm:mt-0 sm:flex-col sm:items-end sm:text-right">
          <div>
            <p className="tracking-label text-[10px] uppercase text-bronze">
              Từ
            </p>
            <p className="font-heading text-lg text-walnut">
              {price}
              {price !== "Liên hệ" && (
                <span className="ml-1 text-xs text-bronze"> đ</span>
              )}
            </p>
          </div>
          <Link
            href="/#lien-he"
            className="tracking-label border-b border-gold pb-0.5 text-[10px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
          >
            Đặt lịch
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

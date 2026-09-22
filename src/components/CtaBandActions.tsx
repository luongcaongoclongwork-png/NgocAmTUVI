"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PHONE_TEL = "tel:+84775448989";
const PHONE_DISPLAY = "0775 448 989";
const ZALO_HREF = "https://zalo.me/0775448989";

export default function CtaBandActions() {
  const params = useSearchParams();
  const goi = params.get("goi");

  return (
    <>
      {goi && (
        <p className="tracking-label mb-6 text-[11px] font-semibold uppercase text-gold">
          Bạn đang quan tâm — {goi}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href={PHONE_TEL}
          className="tracking-label bg-gold px-8 py-3.5 text-[11px] font-semibold uppercase text-ink transition-colors hover:bg-ivory"
        >
          Gọi ngay — {PHONE_DISPLAY}
        </a>
        <a
          href={ZALO_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="tracking-label border border-ivory/50 px-8 py-3.5 text-[11px] font-semibold uppercase text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          Nhắn Zalo
        </a>
      </div>

      <Link
        href="/dich-vu"
        className="tracking-label mt-6 inline-block text-[11px] font-medium uppercase text-ivory/70 underline decoration-ivory/30 underline-offset-4 transition-colors hover:text-gold"
      >
        Xem tất cả dịch vụ
      </Link>
    </>
  );
}

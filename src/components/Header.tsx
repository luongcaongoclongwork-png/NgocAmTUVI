"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV_ITEMS, isNavItemActive } from "./nav/navItems";
import ExploreMenu from "./nav/ExploreMenu";
import MobileNav from "./nav/MobileNav";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 site-header border-b border-walnut/10">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="Ngọc Âm — Trang chủ">
          <Image src="/images/logo-mark.png" alt="" width={32} height={32} className="h-8 w-8 shrink-0" />
          <span className="hidden whitespace-nowrap font-heading text-lg tracking-[0.2em] text-ink sm:inline">
            NGỌC ÂM
          </span>
        </Link>

        <nav aria-label="Chính" className="hidden flex-1 items-center justify-center gap-5 xl:flex">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`tracking-label text-[11px] font-medium uppercase transition-colors hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
                  active ? "text-gold-deep" : "text-walnut"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <ExploreMenu />
        </nav>

        <div className="flex items-center gap-2 text-walnut sm:gap-4">
          <Link
            href="/dich-vu"
            className="tracking-label flex h-11 items-center whitespace-nowrap border border-walnut px-3 text-[11px] font-medium uppercase text-walnut transition-colors hover:border-gold-deep hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:px-4"
          >
            Đặt lịch
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

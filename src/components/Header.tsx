"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV_ITEMS, isNavItemActive } from "./nav/navItems";
import ExploreMenu from "./nav/ExploreMenu";
import MobileNav from "./nav/MobileNav";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="12.3" y1="12.3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6.2" r="3.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.8 16c1.1-3.1 3.6-4.6 6.2-4.6s5.1 1.5 6.2 4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-walnut/10 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-3">
          <Image src="/images/logo-mark.png" alt="Ngọc Âm" width={32} height={32} className="h-8 w-8" />
          <span className="font-heading text-lg tracking-[0.2em] text-ink">NGỌC ÂM</span>
        </Link>

        <nav aria-label="Chính" className="hidden flex-1 items-center justify-center gap-5 xl:flex">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`tracking-label text-[11px] font-medium uppercase transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
                  active ? "text-gold" : "text-walnut/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <ExploreMenu />
        </nav>

        <div className="flex items-center gap-2 text-walnut/80 sm:gap-4">
          <button
            aria-label="Tìm kiếm"
            className="hidden h-11 w-11 items-center justify-center transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:flex"
          >
            <SearchIcon />
          </button>
          <button
            aria-label="Tài khoản"
            className="hidden h-11 w-11 items-center justify-center transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:flex"
          >
            <AccountIcon />
          </button>
          <Link
            href="/dich-vu"
            className="tracking-label flex h-11 items-center border border-walnut px-4 text-[11px] font-medium uppercase text-walnut transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            Đặt lịch
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

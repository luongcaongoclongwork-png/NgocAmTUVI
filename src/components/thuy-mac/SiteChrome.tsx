"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Compass from "./Compass";
import { bookingFor, HEADER_LINKS, isBareRoute } from "./nav";
import "./chrome.css";

/**
 * Every public page: a labelled header over v1's cloud-and-mountain painting
 * (links always in view on a wide screen, the la bàn for everything else),
 * a booking button that names the page's own service, and on a phone a
 * bottom bar with booking and Zalo within thumb's reach.
 */
export default function SiteChrome({ zalo }: { zalo: { url: string; phone: string } }) {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isBareRoute(pathname)) return null;
  const booking = bookingFor(pathname);
  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined);
  const tel = zalo.phone.replace(/[^\d+]/g, "");

  return (
    <div className="tm">
      <a href="#noi-dung" className="tmSkip">Chuyển đến nội dung</a>
      <header className={`tmHead ${scrolled ? "is-scrolled" : ""}`}>
        <Link href="/" className="tmBrand" aria-label="Ngọc Âm, về trang chủ">
          <Image src="/images/logo-mark.png" alt="" width={38} height={38} priority />
          <span>Ngọc Âm</span>
        </Link>
        <nav aria-label="Chính" className="tmNav">
          <ul>
            {HEADER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={current(l.href)}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Compass />
        {booking && (
          <Link href={booking.href} className="tmBook">
            <span className="tmPill-dot" aria-hidden="true" />
            {booking.label}
          </Link>
        )}
      </header>

      {booking && (
        <nav aria-label="Đặt lịch nhanh" className="tmBar">
          <Link href={booking.href} className="tmBar-book">{booking.short}</Link>
          {zalo.url ? (
            <a href={zalo.url} className="tmBar-alt">Nhắn Zalo</a>
          ) : (
            tel && <a href={`tel:${tel}`} className="tmBar-alt">Gọi</a>
          )}
        </nav>
      )}
    </div>
  );
}

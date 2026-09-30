"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Compass from "./Compass";
import { bookingFor, isBareRoute } from "./nav";
import "./chrome.css";

/** Brand mark, la bàn menu and the floating booking button, on every public page. */
export default function SiteChrome() {
  const pathname = usePathname() ?? "/";
  if (isBareRoute(pathname)) return null;
  const booking = bookingFor(pathname);
  return (
    <div className="tm">
      <Link href="/" className="tmBrand" aria-label="Ngọc Âm, về trang chủ">
        <Image src="/images/logo-mark.png" alt="" width={34} height={34} />
        <span>Ngọc Âm</span>
      </Link>
      <Compass />
      {booking && (
        <Link href={booking.href} className="tmPill">
          <span className="tmPill-dot" aria-hidden="true" />
          {booking.label}
        </Link>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";

const NAV: { href: string; label: string; exact?: boolean; badge?: boolean }[] = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/lien-he", label: "Khách liên hệ", badge: true },
  { href: "/admin/bai-viet", label: "Bài viết" },
  { href: "/admin/dich-vu", label: "Dịch vụ" },
  { href: "/admin/tu-van-vien", label: "Tư vấn viên" },
  { href: "/admin/san-pham", label: "Sản phẩm" },
  { href: "/admin/thung-rac", label: "Thùng rác" },
  { href: "/admin/cai-dat", label: "Cài đặt" },
  { href: "/admin/tai-khoan", label: "Tài khoản" },
];

/**
 * Two rows (brand + account actions, then a swipeable nav row) up to 2xl;
 * one row only from 1536px, where all ten items truly fit (at 1024–1280px
 * the single row pushed "Đăng xuất" off-screen). The old single flex row forced a 494px-wide page on a
 * 390px phone, broke every label onto several lines and cut off "Đăng xuất".
 */
export default function AdminHeader({ username, newLeads }: { username: string; newLeads: number }) {
  const pathname = usePathname() ?? "";
  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-walnut/15 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-1 px-4 pt-3 sm:px-6 lg:px-10 2xl:max-w-[1440px] 2xl:flex-nowrap 2xl:py-3">
        <Link href="/admin" className="shrink-0 whitespace-nowrap font-heading text-lg text-ink">
          Ngọc Âm · Quản trị
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-4 text-[13px] text-walnut/70 2xl:order-3">
          <span className="hidden sm:inline">{username}</span>
          <Link href="/" className="whitespace-nowrap hover:text-gold">
            Xem trang web ↗
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="whitespace-nowrap hover:text-lacquer">
              Đăng xuất
            </button>
          </form>
        </div>

        <nav
          aria-label="Quản trị"
          className="-mx-4 flex w-[calc(100%+2rem)] gap-1 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 lg:-mx-10 lg:w-[calc(100%+5rem)] lg:px-10 2xl:order-2 2xl:mx-0 2xl:w-auto 2xl:flex-1 2xl:overflow-visible 2xl:p-0"
        >
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 whitespace-nowrap border-b-2 px-2.5 py-2 text-[14px] transition-colors ${
                  active ? "border-gold text-ink" : "border-transparent text-walnut/70 hover:text-gold"
                }`}
              >
                {item.label}
                {item.badge && newLeads > 0 && (
                  <span
                    aria-label={`${newLeads} khách mới`}
                    className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-lacquer px-1.5 text-[11px] font-semibold leading-5 text-ivory"
                  >
                    {newLeads}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

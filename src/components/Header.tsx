import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS: { label: string; href?: string }[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Lập lá số" },
  { label: "Tử vi", href: "/tu-vi" },
  { label: "Phong thuỷ", href: "/phong-thuy" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Phật học", href: "/phat-hoc" },
  { label: "Kiến thức", href: "/kien-thuc" },
  { label: "Cửa hàng", href: "/cua-hang" },
  { label: "Về Ngọc Âm", href: "/ve-ngoc-am" },
  { label: "Liên hệ", href: "/#lien-he" },
];

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
  return (
    <header className="sticky top-0 z-50 border-b border-walnut/10 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-mark.png"
            alt="Ngọc Âm"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-heading text-lg tracking-[0.2em] text-ink">
            NGỌC ÂM
          </span>
        </Link>

        <nav className="hidden flex-1 justify-center gap-5 xl:flex">
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="tracking-label text-[11px] font-medium uppercase text-walnut/80 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="tracking-label flex items-center gap-1 text-[11px] font-medium uppercase text-walnut/35"
                title="Sắp ra mắt"
              >
                {item.label}
                <span className="text-[8px] normal-case text-gold/70">
                  sắp ra mắt
                </span>
              </span>
            )
          )}
        </nav>

        <div className="flex items-center gap-4 text-walnut/80">
          <button aria-label="Tìm kiếm" className="hidden transition-colors hover:text-gold sm:block">
            <SearchIcon />
          </button>
          <button aria-label="Tài khoản" className="hidden transition-colors hover:text-gold sm:block">
            <AccountIcon />
          </button>
          <Link
            href="/dich-vu"
            className="tracking-label border border-walnut px-4 py-2 text-[11px] font-medium uppercase text-walnut transition-colors hover:border-gold hover:text-gold"
          >
            Đặt lịch
          </Link>
        </div>
      </div>
    </header>
  );
}

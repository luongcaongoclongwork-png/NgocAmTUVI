import Image from "next/image";
import Link from "next/link";

const columns: {
  title: string;
  href: string;
  links: { label: string; href?: string }[];
}[] = [
  {
    title: "Tử vi",
    href: "/tu-vi",
    links: [
      { label: "Lập lá số", href: "/lap-la-so" },
      { label: "Khai vấn chuyên sâu", href: "/tu-vi" },
      { label: "Khai vấn toàn lá số", href: "/tu-vi" },
      { label: "Xem ngày giờ đẹp", href: "/tu-vi" },
    ],
  },
  {
    title: "Phong thuỷ",
    href: "/phong-thuy",
    links: [
      { label: "Dương trạch", href: "/phong-thuy" },
      { label: "Âm trạch", href: "/phong-thuy" },
      { label: "Không gian sống", href: "/phong-thuy" },
      { label: "Văn phòng / thương mại", href: "/phong-thuy" },
    ],
  },
  {
    title: "Dịch vụ",
    href: "/dich-vu",
    links: [
      { label: "Bảng giá", href: "/dich-vu" },
      { label: "Đặt lịch tư vấn", href: "/dich-vu" },
    ],
  },
  {
    title: "Kiến thức",
    href: "/kien-thuc",
    links: [
      { label: "Tử vi", href: "/kien-thuc" },
      { label: "Phong thuỷ", href: "/kien-thuc" },
      { label: "Phật học", href: "/phat-hoc" },
      { label: "Văn hoá", href: "/kien-thuc" },
    ],
  },
  {
    title: "Cửa hàng",
    href: "/cua-hang",
    links: [
      { label: "Ngọc phỉ thuý", href: "/cua-hang#ngoc-phi-thuy" },
      { label: "Ngọc hoà điền", href: "/cua-hang#ngoc-hoa-dien" },
      { label: "Đá phong thuỷ", href: "/cua-hang#da-phong-thuy" },
    ],
  },
  {
    title: "Về Ngọc Âm",
    href: "/ve-ngoc-am",
    links: [
      { label: "Câu chuyện thương hiệu", href: "/ve-ngoc-am" },
      { label: "Đội ngũ khai vấn", href: "/ve-ngoc-am" },
      { label: "Liên hệ", href: "/#lien-he" },
    ],
  },
];

const social: { label: string; href: string }[] = [
  { label: "TikTok", href: "https://www.tiktok.com/@ngocam.tuviphongthuy" },
  { label: "Facebook", href: "https://www.facebook.com/Tuviphongthuyngocam" },
  { label: "Instagram", href: "https://www.instagram.com/ngocam_tuviphongthuy/" },
  { label: "trangsucngocam.work@gmail.com", href: "mailto:trangsucngocam.work@gmail.com" },
  { label: "0775 448 989", href: "tel:+84775448989" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-earth-brown text-ivory">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        aria-hidden="true"
      >
        <pattern id="dongson" width="64" height="64" patternUnits="userSpaceOnUse">
          <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dongson)" />
      </svg>

      <div className="relative mx-auto max-w-[1280px] px-6 pb-10 pt-14 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-ivory ring-1 ring-gold/50">
                <Image
                  src="/images/logo-mark.png"
                  alt="Ngọc Âm"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-heading text-lg tracking-[0.2em]">NGỌC ÂM</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
              Tử Vi, Phong Thuỷ hậu nhân Khâm Thiên Giám — vua Minh Mạng, triều
              Nguyễn. Khai vấn, định hướng và đồng hành trên hành trình hiểu
              mình.
            </p>
          </div>

          <div className="grid grid-cols-2 items-center gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            {columns.map((col) => (
              <Link
                key={col.title}
                href={col.href}
                className="tracking-label text-[11px] font-semibold uppercase text-gold transition-colors hover:text-ivory"
              >
                {col.title}
              </Link>
            ))}
          </div>

          <div>
            <h4 className="tracking-label text-[11px] font-semibold uppercase text-gold">
              Kết nối
            </h4>
            <ul className="mt-3 space-y-1.5">
              {social.map((s) => {
                const external = s.href.startsWith("http");
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="text-sm text-ivory/75 transition-colors hover:text-ivory"
                    >
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-ivory/15 pt-8 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ngọc Âm. Mọi quyền được bảo lưu.</p>
          <p>Nội dung Tử Vi, Phong Thuỷ mang tính tham khảo và định hướng, không thay thế quyết định của bạn.</p>
        </div>
      </div>
    </footer>
  );
}

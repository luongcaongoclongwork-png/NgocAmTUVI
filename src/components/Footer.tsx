import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, socialLinks, telHref } from "@/lib/site-settings";

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
      { label: "Dịch vụ", href: "/dich-vu" },
      { label: "Đặt lịch tư vấn", href: "/lien-he" },
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
      { label: "Liên hệ", href: "/lien-he" },
    ],
  },
];

export default async function Footer() {
  // Contact details come from /admin/cai-dat (empty = not shown).
  const settings = await getSiteSettings();
  const social = [
    ...socialLinks(settings),
    ...(settings.email ? [{ label: settings.email, href: `mailto:${settings.email}` }] : []),
    ...(settings.phone ? [{ label: settings.phone, href: telHref(settings.phone) }] : []),
  ];
  const legal = [settings.businessName, settings.taxCode && `MST: ${settings.taxCode}`].filter(Boolean).join(" · ");

  return (
    <footer className="site-footer relative overflow-hidden text-ivory">
      <div className="relative mx-auto max-w-[1280px] px-6 pb-10 pt-14 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr_1fr]">
          <div>
            <Image src="/images/logo/ngoc-am-horizontal-reversed.svg" alt="Ngọc Âm" width={811} height={256} unoptimized className="h-11 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/90 [text-shadow:0_1px_3px_rgba(30,20,10,0.55)]">
              Tử Vi, Phong Thuỷ hậu nhân Khâm Thiên Giám — vua Minh Mạng, triều
              Nguyễn. Khai vấn, định hướng và đồng hành trên hành trình hiểu
              mình.
            </p>
            {(settings.address || settings.workingHours) && (
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ivory/80 [text-shadow:0_1px_3px_rgba(30,20,10,0.55)]">
                {settings.address && <span className="block">{settings.address}</span>}
                {settings.workingHours && <span className="block">{settings.workingHours}</span>}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 items-center gap-x-8 gap-y-2 pointer-coarse:gap-y-0 sm:grid-cols-3 lg:grid-cols-6">
            {columns.map((col) => (
              <Link
                key={col.title}
                href={col.href}
                className="tap tracking-label text-[11px] font-semibold uppercase text-beige [text-shadow:0_1px_3px_rgba(30,20,10,0.55)] transition-colors hover:text-ivory"
              >
                {col.title}
              </Link>
            ))}
          </div>

          <div>
            <h4 className="tracking-label text-[11px] font-semibold uppercase text-beige [text-shadow:0_1px_3px_rgba(30,20,10,0.55)]">
              Kết nối
            </h4>
            <ul className="mt-2 space-y-0.5 pointer-coarse:space-y-0">
              {social.map((s) => {
                const external = s.href.startsWith("http");
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="tap text-sm text-ivory/95 [text-shadow:0_1px_3px_rgba(30,20,10,0.55)] transition-colors hover:text-ivory"
                    >
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-ivory/15 pt-8 text-xs text-ivory/75 [text-shadow:0_1px_2px_rgba(30,20,10,0.5)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Ngọc Âm. Mọi quyền được bảo lưu.
            {legal && <span className="block pt-1 sm:inline sm:pl-2 sm:pt-0">{legal}</span>}
          </p>
          <p>Nội dung Tử Vi, Phong Thuỷ mang tính tham khảo và định hướng, không thay thế quyết định của bạn.</p>
        </div>
      </div>
    </footer>
  );
}

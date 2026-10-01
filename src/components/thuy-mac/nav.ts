/** Site navigation for the Thuỷ Mặc design: the three paths, then everything else. */
export const PATH_LINKS = [
  { href: "/tu-vi", label: "Tử Vi Xuyên Tam Diệm" },
  { href: "/phong-thuy", label: "Phong Thuỷ Là Tịnh" },
  { href: "/dai-chu-su", label: "Xuyên Vấn Đại Chủ Sự" },
] as const;

export const MORE_LINKS = [
  { href: "/lap-la-so", label: "Lập Lá Số" },
  { href: "/tra-dao", label: "Trà Đạo" },
  { href: "/dich-vu", label: "Bảng Giá" },
  // Sổ tay holds both Kiến thức and Phật học (one page, two parts); it lives here, not in the header
  { href: "/kien-thuc", label: "Sổ Tay" },
  { href: "/cua-hang", label: "Vật Phẩm" },
  { href: "/ve-ngoc-am", label: "Về Ngọc Âm" },
  { href: "/lien-he", label: "Liên Hệ" },
] as const;

/** The labelled links always in view on a wide screen (v1's strength); the la bàn holds the rest. */
export const HEADER_LINKS = [
  { href: "/tu-vi", label: "Tử Vi" },
  { href: "/phong-thuy", label: "Phong Thuỷ" },
  { href: "/dai-chu-su", label: "Đại Chủ Sự" },
  { href: "/lap-la-so", label: "Lập Lá Số" },
  { href: "/tra-dao", label: "Trà Đạo" },
  { href: "/dich-vu", label: "Bảng Giá" },
] as const;

export type Booking = { label: string; short: string; href: string };

/** What the booking button says (and where it goes) on each page; `short` fits the phone's bottom bar. */
export function bookingFor(pathname: string): Booking | null {
  // the form is already here
  if (pathname.startsWith("/lien-he")) return null;
  // after a chart: read it with a Xuyên giả (the button sits in the header now, never over the palaces)
  if (pathname.startsWith("/la-so") || pathname.startsWith("/lap-la-so")) return { label: "Đặt Phiên Luận Lá Số", short: "Luận Lá Số", href: "/lien-he?topic=tu-vi" };
  if (pathname.startsWith("/phong-thuy")) return { label: "Đặt Lịch Tư Vấn Phong Thuỷ", short: "Đặt Lịch Phong Thuỷ", href: "/lien-he?topic=phong-thuy" };
  if (pathname.startsWith("/dai-chu-su")) return { label: "Đặt Lịch Đại Chủ Sự", short: "Đặt Lịch Đại Chủ Sự", href: "/lien-he?topic=dai-chu-su" };
  // tea and pieces are asked about, not booked; each opens the form on its own topic
  if (pathname.startsWith("/tra-dao") || pathname.startsWith("/xuyen-gia/khuong")) return { label: "Hỏi Về Trà", short: "Hỏi Về Trà", href: "/lien-he?topic=tra" };
  if (pathname.startsWith("/cua-hang")) return { label: "Hỏi Về Vật Phẩm", short: "Hỏi Về Vật Phẩm", href: "/lien-he?topic=vat-pham" };
  if (pathname.startsWith("/xuyen-gia/thay-tinh")) return { label: "Đặt Lịch Tư Vấn Phong Thuỷ", short: "Đặt Lịch Phong Thuỷ", href: "/lien-he?topic=phong-thuy" };
  if (pathname.startsWith("/tu-vi")) return { label: "Đặt Lịch Xuyên Vấn Tử Vi", short: "Đặt Lịch Tử Vi", href: "/lien-he?topic=tu-vi" };
  return { label: "Đặt Lịch Xuyên Vấn", short: "Đặt Lịch Xuyên Vấn", href: "/lien-he" };
}

/** Pages that draw no site chrome at all. */
export function isBareRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/la-so/print");
}

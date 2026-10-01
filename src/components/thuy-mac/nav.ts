/** Site navigation for the Thuỷ Mặc design: the three paths, then everything else. */
export const PATH_LINKS = [
  { href: "/tu-vi", label: "Tử Vi Xuyên Tam Diệm" },
  { href: "/phong-thuy", label: "Phong Thuỷ Là Tịnh" },
  { href: "/dai-chu-su", label: "Xuyên Vấn Đại Chủ Sự" },
] as const;

export const MORE_LINKS = [
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/tra-dao", label: "Trà Đạo" },
  { href: "/dich-vu", label: "Bảng giá" },
  // Sổ tay holds both Kiến thức and Phật học (one page, two parts); it lives here, not in the header
  { href: "/kien-thuc", label: "Sổ tay" },
  { href: "/cua-hang", label: "Vật phẩm" },
  { href: "/ve-ngoc-am", label: "Về Ngọc Âm" },
  { href: "/lien-he", label: "Liên hệ" },
] as const;

/** The labelled links always in view on a wide screen (v1's strength); the la bàn holds the rest. */
export const HEADER_LINKS = [
  { href: "/tu-vi", label: "Tử Vi" },
  { href: "/phong-thuy", label: "Phong Thuỷ" },
  { href: "/dai-chu-su", label: "Đại Chủ Sự" },
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/tra-dao", label: "Trà Đạo" },
  { href: "/dich-vu", label: "Bảng giá" },
] as const;

export type Booking = { label: string; short: string; href: string };

/** What the booking button says (and where it goes) on each page; `short` fits the phone's bottom bar. */
export function bookingFor(pathname: string): Booking | null {
  // the form is already here
  if (pathname.startsWith("/lien-he")) return null;
  // after a chart: read it with a Xuyên giả (the button sits in the header now, never over the palaces)
  if (pathname.startsWith("/la-so") || pathname.startsWith("/lap-la-so")) return { label: "Đặt phiên luận lá số", short: "Luận lá số", href: "/lien-he?topic=tu-vi" };
  if (pathname.startsWith("/phong-thuy")) return { label: "Đặt lịch tư vấn Phong Thuỷ", short: "Đặt lịch Phong Thuỷ", href: "/lien-he?topic=phong-thuy" };
  if (pathname.startsWith("/dai-chu-su")) return { label: "Đặt lịch Đại Chủ Sự", short: "Đặt lịch Đại Chủ Sự", href: "/lien-he?topic=dai-chu-su" };
  if (pathname.startsWith("/cua-hang") || pathname.startsWith("/tra-dao")) return { label: "Hỏi về vật phẩm", short: "Hỏi về vật phẩm", href: "/lien-he?topic=vat-pham" };
  if (pathname.startsWith("/tu-vi")) return { label: "Đặt lịch Xuyên vấn Tử Vi", short: "Đặt lịch Tử Vi", href: "/lien-he?topic=tu-vi" };
  return { label: "Đặt lịch Xuyên vấn", short: "Đặt lịch Xuyên vấn", href: "/lien-he" };
}

/** Pages that draw no site chrome at all. */
export function isBareRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/la-so/print");
}

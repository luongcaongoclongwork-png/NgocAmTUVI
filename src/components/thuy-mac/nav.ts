/** Site navigation for the Thuỷ Mặc design: the three paths, then everything else. */
export const PATH_LINKS = [
  { href: "/tu-vi", label: "Tử Vi Xuyên Tam Diệm" },
  { href: "/phong-thuy", label: "Phong Thuỷ Là Tịnh" },
  { href: "/dai-chu-su", label: "Xuyên Vấn Đại Chủ Sự" },
] as const;

export const MORE_LINKS = [
  { href: "/dich-vu", label: "Bảng giá" },
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/kien-thuc", label: "Sổ tay" },
  { href: "/tra-dao", label: "Trà Đạo" },
  { href: "/phat-hoc", label: "Phật học" },
  { href: "/cua-hang", label: "Vật phẩm" },
  { href: "/ve-ngoc-am", label: "Về Ngọc Âm" },
  { href: "/lien-he", label: "Liên hệ" },
] as const;

/** What the floating booking button says (and where it goes) on each page. */
export function bookingFor(pathname: string): { label: string; href: string } | null {
  if (pathname === "/" || pathname.startsWith("/lien-he")) return null; // the home has its own; the form is already here
  if (pathname.startsWith("/phong-thuy")) return { label: "Đặt lịch tư vấn Phong Thuỷ", href: "/lien-he?topic=phong-thuy" };
  if (pathname.startsWith("/dai-chu-su")) return { label: "Đặt lịch Đại Chủ Sự", href: "/lien-he?topic=dai-chu-su" };
  if (pathname.startsWith("/cua-hang") || pathname.startsWith("/tra-dao")) return { label: "Hỏi về vật phẩm", href: "/lien-he?topic=vat-pham" };
  return { label: "Đặt lịch Xuyên vấn", href: "/lien-he?topic=tu-vi" };
}

/** Pages that draw no site chrome at all. */
export function isBareRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/la-so/print");
}

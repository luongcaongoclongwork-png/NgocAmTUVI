export interface NavItem {
  label: string;
  href: string;
}

/** Shown directly in the desktop nav bar — kept short so labels never wrap at ~1280px. */
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Lập lá số", href: "/lap-la-so" },
  { label: "Tử vi", href: "/tu-vi" },
  { label: "Phong thuỷ", href: "/phong-thuy" },
  { label: "Trà đạo", href: "/tra-dao" },
  { label: "Dịch vụ", href: "/dich-vu" },
];

/** Secondary items, grouped under the "Khám phá" disclosure on desktop and listed in full in the mobile drawer. */
export const EXPLORE_NAV_ITEMS: NavItem[] = [
  { label: "Phật học", href: "/phat-hoc" },
  { label: "Kiến thức", href: "/kien-thuc" },
  { label: "Cửa hàng", href: "/cua-hang" },
  { label: "Về Ngọc Âm", href: "/ve-ngoc-am" },
  { label: "Liên hệ", href: "/lien-he" },
];

export const ALL_NAV_ITEMS: NavItem[] = [...PRIMARY_NAV_ITEMS, ...EXPLORE_NAV_ITEMS];

/** Active-route check: exact match for "/", prefix match otherwise (so /kien-thuc/[slug] still highlights "Kiến thức"). A hash-only link (e.g. "/#gioi-thieu") is never "active" — it's a same-page anchor, not a distinct route. */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

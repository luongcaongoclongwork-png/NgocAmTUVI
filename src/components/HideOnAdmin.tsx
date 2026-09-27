"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function isAdminPath(pathname: string | null): boolean {
  return !!pathname && (pathname === "/admin" || pathname.startsWith("/admin/"));
}

/**
 * Renders the public site chrome (e.g. the server-rendered <Footer />
 * passed in as children) everywhere except /admin, which has its own
 * header — otherwise admin pages showed two stacked menus plus the public
 * "Đặt lịch" button and footer.
 */
export default function HideOnAdmin({ children }: { children: ReactNode }) {
  return isAdminPath(usePathname()) ? null : children;
}

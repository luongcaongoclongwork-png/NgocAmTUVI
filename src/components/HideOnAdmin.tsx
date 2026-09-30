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
  const pathname = usePathname();
  // /thu-nghiem/* are the v2 redesign drafts; each draws its own header and footer.
  const isDraft = !!pathname && pathname.startsWith("/thu-nghiem");
  return isAdminPath(pathname) || isDraft ? null : children;
}

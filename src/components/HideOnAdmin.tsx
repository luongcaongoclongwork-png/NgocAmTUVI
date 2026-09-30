"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isBareRoute } from "@/components/thuy-mac/nav";

export function isAdminPath(pathname: string | null): boolean {
  return !!pathname && (pathname === "/admin" || pathname.startsWith("/admin/"));
}

/**
 * Renders the public site chrome (e.g. the server-rendered footer passed in
 * as children) everywhere except /admin, which has its own header, and the
 * printable lá số, which is a bare sheet.
 */
export default function HideOnAdmin({ children }: { children: ReactNode }) {
  return isBareRoute(usePathname()) ? null : children;
}

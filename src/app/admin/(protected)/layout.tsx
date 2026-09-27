import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";

/**
 * Real authorization boundary for every /admin page (src/proxy.ts is only
 * the optimistic outer redirect — see that file's own comment). Everything
 * under the (protected) route group renders behind this check; /admin/login
 * sits OUTSIDE the group specifically so it isn't wrapped by it (avoids a
 * redirect loop back to itself).
 *
 * The public Header/Footer are hidden on /admin by <HideOnAdmin> in the root
 * layout, which also already provides the page's single <main>.
 */
export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const session = await verifySession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ivory">
      <AdminHeader username={session.username} />
      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
    </div>
  );
}

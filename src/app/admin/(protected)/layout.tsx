import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

/**
 * Real authorization boundary for every /admin page (src/proxy.ts is only
 * the optimistic outer redirect — see that file's own comment). Everything
 * under the (protected) route group renders behind this check; /admin/login
 * sits OUTSIDE the group specifically so it isn't wrapped by it (avoids a
 * redirect loop back to itself).
 */
export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const session = await verifySession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ivory">
      <header className="flex items-center justify-between border-b border-walnut/15 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-heading text-lg text-ink">
            Ngọc Âm · Quản trị
          </Link>
          <nav className="flex items-center gap-4 text-[13px] text-walnut/70">
            <Link href="/admin" className="hover:text-gold">
              Bài viết
            </Link>
            <Link href="/admin/bai-viet/moi" className="hover:text-gold">
              Viết bài mới
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[13px] text-walnut/70">
          <span>{session.username}</span>
          <Link href="/" className="hover:text-gold">
            ← Về trang chủ
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="hover:text-lacquer">
              Đăng xuất
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}

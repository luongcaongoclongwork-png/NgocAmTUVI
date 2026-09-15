import Link from "next/link";
import { getAllArticlesForAdmin } from "@/lib/articles";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton";

export default async function AdminDashboardPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Bài viết</h1>
        <Link
          href="/admin/bai-viet/moi"
          className="tracking-label h-10 border border-walnut/30 px-4 text-[13px] font-medium uppercase leading-10 text-walnut hover:border-gold hover:text-gold"
        >
          Viết bài mới
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">Chưa có bài viết nào.</p>
      ) : (
        <div className="mt-8 divide-y divide-walnut/10 border-y border-walnut/10">
          {articles.map((article) => (
            <div key={article.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`tracking-label inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                      article.status === "published"
                        ? "bg-sage/15 text-sage"
                        : "bg-gold/15 text-gold"
                    }`}
                  >
                    {article.status === "published" ? "Đã đăng" : "Nháp"}
                  </span>
                  <span className="tracking-label text-[11px] uppercase text-walnut/60">
                    {article.category}
                  </span>
                </div>
                <p className="mt-1 truncate font-heading text-[16px] text-ink">{article.title}</p>
                <p className="text-[12px] text-ink/50">{article.readTime}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-[13px]">
                <Link href={`/kien-thuc/${article.slug}`} className="text-walnut/70 hover:text-gold">
                  Xem
                </Link>
                <Link href={`/admin/bai-viet/${article.id}`} className="text-walnut/70 hover:text-gold">
                  Sửa
                </Link>
                <DeleteArticleButton id={article.id} title={article.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import AdminArticleForm from "@/components/admin/AdminArticleForm";
import { getArticleByIdForAdmin } from "@/lib/articles";
import { updateArticleAction } from "@/app/admin/bai-viet/actions";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleByIdForAdmin(Number(id));
  if (!article) notFound();

  const boundAction = updateArticleAction.bind(null, article.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Sửa bài viết</h1>
      <div className="mt-8 max-w-2xl">
        <AdminArticleForm action={boundAction} article={article} />
      </div>
    </div>
  );
}

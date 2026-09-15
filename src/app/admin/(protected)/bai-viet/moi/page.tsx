import AdminArticleForm from "@/components/admin/AdminArticleForm";
import { createArticleAction } from "@/app/admin/bai-viet/actions";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Viết bài mới</h1>
      <div className="mt-8 max-w-2xl">
        <AdminArticleForm action={createArticleAction} />
      </div>
    </div>
  );
}

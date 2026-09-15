"use client";

import { useTransition } from "react";
import { deleteArticleAction } from "@/app/admin/actions";

export default function DeleteArticleButton({ id, title }: { id: number; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Xoá bài viết "${title}"? Không thể hoàn tác.`)) return;
        startTransition(() => {
          deleteArticleAction(id);
        });
      }}
      className="text-[13px] text-lacquer hover:underline disabled:opacity-50"
    >
      {pending ? "Đang xoá…" : "Xoá"}
    </button>
  );
}

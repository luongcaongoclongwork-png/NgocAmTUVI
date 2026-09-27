"use client";

import { useTransition } from "react";
import { deleteProductCategoryAction } from "@/app/admin/actions";

export default function DeleteProductCategoryButton({ id, name }: { id: number; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          !window.confirm(
            `Chuyển danh mục "${name}" (kèm các sản phẩm bên trong) vào thùng rác? Có thể khôi phục trong 30 ngày.`
          )
        )
          return;
        startTransition(() => {
          deleteProductCategoryAction(id);
        });
      }}
      className="text-[13px] text-lacquer hover:underline disabled:opacity-50"
    >
      {pending ? "Đang xoá…" : "Xoá"}
    </button>
  );
}

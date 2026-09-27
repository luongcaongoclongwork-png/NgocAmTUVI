"use client";

import { useTransition } from "react";
import { deleteProductAction } from "@/app/admin/actions";

export default function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Chuyển sản phẩm "${name}" vào thùng rác? Có thể khôi phục trong 30 ngày.`)) return;
        startTransition(() => {
          deleteProductAction(id);
        });
      }}
      className="text-[13px] text-lacquer hover:underline disabled:opacity-50"
    >
      {pending ? "Đang xoá…" : "Xoá"}
    </button>
  );
}

"use client";

import { useTransition } from "react";
import { deleteServiceAction } from "@/app/admin/actions";

export default function DeleteServiceButton({ id, title }: { id: number; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Chuyển dịch vụ "${title}" vào thùng rác? Có thể khôi phục trong 30 ngày.`)) return;
        startTransition(() => {
          deleteServiceAction(id);
        });
      }}
      className="text-[13px] text-lacquer hover:underline disabled:opacity-50"
    >
      {pending ? "Đang xoá…" : "Xoá"}
    </button>
  );
}

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
        if (!window.confirm(`Xoá dịch vụ "${title}"? Không thể hoàn tác.`)) return;
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

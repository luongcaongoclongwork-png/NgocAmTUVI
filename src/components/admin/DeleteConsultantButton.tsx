"use client";

import { useTransition } from "react";
import { deleteConsultantAction } from "@/app/admin/actions";

export default function DeleteConsultantButton({ id, name }: { id: number; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Xoá tư vấn viên "${name}"? Không thể hoàn tác.`)) return;
        startTransition(() => {
          deleteConsultantAction(id);
        });
      }}
      className="text-[13px] text-lacquer hover:underline disabled:opacity-50"
    >
      {pending ? "Đang xoá…" : "Xoá"}
    </button>
  );
}

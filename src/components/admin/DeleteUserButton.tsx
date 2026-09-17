"use client";

import { useTransition } from "react";
import { deleteUserAction } from "@/app/admin/actions";

export default function DeleteUserButton({ id, username }: { id: number; username: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Xoá tài khoản "${username}"? Không thể hoàn tác.`)) return;
        startTransition(async () => {
          const result = await deleteUserAction(id);
          if (result.error) window.alert(result.error);
        });
      }}
      className="text-[13px] text-lacquer hover:underline disabled:opacity-50"
    >
      {pending ? "Đang xoá…" : "Xoá"}
    </button>
  );
}

"use client";

import { useActionState } from "react";
import type { Consultant } from "@/lib/consultant-constants";
import type { ConsultantFormState } from "@/app/admin/tu-van-vien/actions";

const initialState: ConsultantFormState = { error: null };

export default function AdminConsultantForm({
  action,
  consultant,
}: {
  action: (prev: ConsultantFormState, formData: FormData) => Promise<ConsultantFormState>;
  /** Present when editing an existing consultant; absent when creating one. */
  consultant?: Consultant;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Tên
        <input
          name="name"
          type="text"
          required
          defaultValue={consultant?.name}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Danh xưng / lĩnh vực (hiện dưới tên)
        <input
          name="field"
          type="text"
          required
          defaultValue={consultant?.field}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Chữ viết tắt trong huy hiệu tròn (ví dụ: MT)
        <input
          name="initials"
          type="text"
          required
          maxLength={3}
          defaultValue={consultant?.initials}
          className="w-24 border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Tiểu sử
        <textarea
          name="bio"
          required
          rows={8}
          defaultValue={consultant?.bio}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Thứ tự hiển thị (số nhỏ hơn hiện trước)
        <input
          name="sortOrder"
          type="number"
          required
          defaultValue={consultant?.sortOrder ?? 0}
          className="w-32 border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-lacquer">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="tracking-label h-11 border border-gold bg-gold/10 px-4 text-[13px] font-medium uppercase text-gold hover:bg-gold/20 disabled:opacity-50"
        >
          {pending ? "Đang lưu…" : consultant ? "Lưu thay đổi" : "Tạo tư vấn viên"}
        </button>
      </div>
    </form>
  );
}

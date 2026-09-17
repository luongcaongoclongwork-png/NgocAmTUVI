"use client";

import { useActionState } from "react";
import { SERVICE_GROUPS, type Service } from "@/lib/service-constants";
import type { ServiceFormState } from "@/app/admin/dich-vu/actions";

const initialState: ServiceFormState = { error: null };

export default function AdminServiceForm({
  action,
  service,
}: {
  action: (prev: ServiceFormState, formData: FormData) => Promise<ServiceFormState>;
  /** Present when editing an existing service; absent when creating one. */
  service?: Service;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Nhóm
        <select
          name="group"
          required
          defaultValue={service?.group ?? ""}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        >
          <option value="" disabled>
            — Chọn nhóm —
          </option>
          {SERVICE_GROUPS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Tiêu đề
        <input
          name="title"
          type="text"
          required
          defaultValue={service?.title}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Mô tả
        <textarea
          name="desc"
          required
          rows={3}
          defaultValue={service?.desc}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Giá (nhập số, ví dụ 1.000.000 — hoặc &ldquo;Liên hệ&rdquo;)
        <input
          name="price"
          type="text"
          required
          defaultValue={service?.price}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Thứ tự hiển thị (số nhỏ hơn hiện trước)
        <input
          name="sortOrder"
          type="number"
          required
          defaultValue={service?.sortOrder ?? 0}
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
          {pending ? "Đang lưu…" : service ? "Lưu thay đổi" : "Tạo dịch vụ"}
        </button>
      </div>
    </form>
  );
}

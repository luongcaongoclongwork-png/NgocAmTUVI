"use client";

import { useActionState, useState } from "react";
import type { ProductCategory } from "@/lib/product-constants";
import type { ProductCategoryFormState } from "@/app/admin/san-pham/actions";

const initialState: ProductCategoryFormState = { error: null };

export default function AdminProductCategoryForm({
  action,
  category,
}: {
  action: (prev: ProductCategoryFormState, formData: FormData) => Promise<ProductCategoryFormState>;
  /** Present when editing an existing category; absent when creating one. */
  category?: ProductCategory;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [preview, setPreview] = useState<string | null>(category?.image ?? null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Tên danh mục
        <input
          name="name"
          type="text"
          required
          defaultValue={category?.name}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Mô tả ngắn
        <textarea
          name="intro"
          required
          rows={2}
          defaultValue={category?.intro}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Ảnh danh mục {category ? "(để trống nếu giữ ảnh cũ, hoặc bỏ hẳn ảnh)" : "(không bắt buộc)"}
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink file:mr-3 file:border-0 file:bg-walnut/10 file:px-3 file:py-1.5"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Xem trước ảnh danh mục" className="mt-2 h-40 w-auto border border-walnut/15 object-cover" />
        )}
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Thứ tự hiển thị (số nhỏ hơn hiện trước)
        <input
          name="sortOrder"
          type="number"
          required
          defaultValue={category?.sortOrder ?? 0}
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
          {pending ? "Đang lưu…" : category ? "Lưu thay đổi" : "Tạo danh mục"}
        </button>
      </div>
    </form>
  );
}

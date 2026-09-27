"use client";

import KeepValuesForm from "./KeepValuesForm";
import { useActionState } from "react";
import type { ProductCategory } from "@/lib/product-constants";
import type { ProductCategoryFormState } from "@/app/admin/san-pham/actions";
import ImageUploadField from "./ImageUploadField";

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

  return (
    <KeepValuesForm action={formAction} className="flex flex-col gap-6">
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

      <ImageUploadField
        name="image"
        label="Ảnh danh mục (không bắt buộc)"
        currentUrl={category?.image ?? null}
        allowRemove={!!category}
        previewClassName="h-40 w-40"
        hint="Ảnh vuông. Không chọn ảnh mới thì giữ ảnh cũ."
      />

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
    </KeepValuesForm>
  );
}

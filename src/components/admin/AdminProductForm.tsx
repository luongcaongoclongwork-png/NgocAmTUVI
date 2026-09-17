"use client";

import { useActionState } from "react";
import type { Product, ProductCategory } from "@/lib/product-constants";
import type { ProductFormState } from "@/app/admin/san-pham/actions";

const initialState: ProductFormState = { error: null };

export default function AdminProductForm({
  action,
  categories,
  product,
}: {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: ProductCategory[];
  /** Present when editing an existing product; absent when creating one. */
  product?: Product;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Danh mục
        <select
          name="categoryId"
          required
          defaultValue={product?.categoryId ?? ""}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        >
          <option value="" disabled>
            — Chọn danh mục —
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Tên sản phẩm
        <input
          name="name"
          type="text"
          required
          defaultValue={product?.name}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Mô tả
        <textarea
          name="desc"
          required
          rows={3}
          defaultValue={product?.desc}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Thứ tự hiển thị (số nhỏ hơn hiện trước)
        <input
          name="sortOrder"
          type="number"
          required
          defaultValue={product?.sortOrder ?? 0}
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
          {pending ? "Đang lưu…" : product ? "Lưu thay đổi" : "Tạo sản phẩm"}
        </button>
      </div>
    </form>
  );
}

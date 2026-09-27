"use client";

import KeepValuesForm from "./KeepValuesForm";
import { useActionState } from "react";
import { CATEGORIES, type Article } from "@/lib/article-constants";
import type { ArticleFormState } from "@/app/admin/bai-viet/actions";
import ImageUploadField from "./ImageUploadField";

const initialState: ArticleFormState = { error: null };

export default function AdminArticleForm({
  action,
  article,
}: {
  action: (prev: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  /** Present when editing an existing article; absent when creating one. */
  article?: Article;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const bodyDefault = article?.body.join("\n\n") ?? "";

  return (
    <KeepValuesForm action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Tiêu đề
        <input
          name="title"
          type="text"
          required
          defaultValue={article?.title}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Chuyên mục
        <select
          name="category"
          required
          defaultValue={article?.category ?? ""}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        >
          <option value="" disabled>
            — Chọn chuyên mục —
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Mô tả ngắn (hiện ở thẻ bài viết)
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={article?.excerpt}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <ImageUploadField
        name="image"
        label="Ảnh bìa"
        currentUrl={article?.image ?? null}
        previewClassName="h-40 w-auto"
        hint={article ? "Không chọn ảnh mới thì giữ ảnh cũ." : "Ảnh ngang, tỷ lệ khoảng 16:9."}
      />

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Nội dung (để 1 dòng trống giữa các đoạn văn)
        <textarea
          name="body"
          required
          rows={14}
          defaultValue={bodyDefault}
          className="border border-walnut/30 bg-transparent px-3 py-2 font-mono text-[13px] leading-relaxed text-ink focus:border-gold focus:outline-none"
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
          name="status"
          value="draft"
          disabled={pending}
          className="tracking-label h-11 border border-walnut/30 px-4 text-[13px] font-medium uppercase text-walnut hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {pending ? "Đang lưu…" : "Lưu nháp"}
        </button>
        <button
          type="submit"
          name="status"
          value="published"
          disabled={pending}
          className="tracking-label h-11 border border-gold bg-gold/10 px-4 text-[13px] font-medium uppercase text-gold hover:bg-gold/20 disabled:opacity-50"
        >
          {pending ? "Đang đăng…" : article ? "Lưu & đăng bài" : "Đăng bài"}
        </button>
      </div>
    </KeepValuesForm>
  );
}

"use client";

import { useId, useRef, useState } from "react";
import ArticleBody from "@/components/ArticleBody";
import { parseBody } from "@/lib/article-markdown";

type Tool = { label: string; title: string; run: (sel: string) => { text: string; select?: [number, number] } };

/** Toolbar actions: wrap the selection, or prefix every selected line. */
const TOOLS: Tool[] = [
  { label: "Tiêu đề phụ", title: "Tiêu đề phụ (##)", run: (s) => ({ text: `\n\n## ${s || "Tiêu đề phụ"}\n\n` }) },
  { label: "B", title: "In đậm", run: (s) => ({ text: `**${s || "chữ đậm"}**` }) },
  { label: "I", title: "In nghiêng", run: (s) => ({ text: `*${s || "chữ nghiêng"}*` }) },
  { label: "Link", title: "Chèn đường link", run: (s) => ({ text: `[${s || "chữ hiển thị"}](https://)` }) },
  {
    label: "• Danh sách",
    title: "Danh sách gạch đầu dòng",
    run: (s) => ({ text: `\n\n${(s || "mục thứ nhất\nmục thứ hai").split("\n").map((l) => `- ${l.replace(/^[-*]\s+/, "")}`).join("\n")}\n\n` }),
  },
  {
    label: "1. Danh sách số",
    title: "Danh sách có số thứ tự",
    run: (s) => ({ text: `\n\n${(s || "bước một\nbước hai").split("\n").map((l, i) => `${i + 1}. ${l.replace(/^\d+[.)]\s+/, "")}`).join("\n")}\n\n` }),
  },
  { label: "❝ Trích dẫn", title: "Trích dẫn", run: (s) => ({ text: `\n\n${(s || "câu trích dẫn").split("\n").map((l) => `> ${l}`).join("\n")}\n\n` }) },
];

/**
 * Article body editor: a plain textarea (name="body") with a formatting
 * toolbar and a live preview rendered by the same <ArticleBody> the public
 * article page uses, so "Xem trước" is exactly what visitors will see.
 */
export default function ArticleBodyEditor({ defaultValue }: { defaultValue: string }) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [previewText, setPreviewText] = useState(defaultValue);

  const apply = (tool: Tool) => {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: a, selectionEnd: b, value } = ta;
    const { text } = tool.run(value.slice(a, b));
    ta.setRangeText(text, a, b, "end");
    ta.focus();
  };

  const tabBtn = (t: "write" | "preview", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === t}
      onClick={() => {
        if (t === "preview") setPreviewText(ref.current?.value ?? "");
        setTab(t);
      }}
      className={`border-b-2 px-3 py-2 text-[14px] ${tab === t ? "border-gold text-ink" : "border-transparent text-walnut/60 hover:text-gold"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-2 text-sm text-ink/80">
      <label htmlFor={id}>Nội dung</label>
      <div role="tablist" className="flex gap-1 border-b border-walnut/15">
        {tabBtn("write", "Soạn")}
        {tabBtn("preview", "Xem trước")}
      </div>

      {/* Kept mounted while previewing so the form still submits the text. */}
      <div hidden={tab !== "write"} className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Định dạng">
          {TOOLS.map((t) => (
            <button
              key={t.title}
              type="button"
              title={t.title}
              onClick={() => apply(t)}
              className={`min-h-9 border border-walnut/25 px-3 text-[13px] text-walnut hover:border-gold hover:text-gold ${
                t.label === "B" ? "font-bold" : t.label === "I" ? "italic" : ""
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          id={id}
          name="body"
          // No `required`: while "Xem trước" is open this field is hidden, and a
          // hidden required field silently blocks submitting. The server checks it.
          rows={18}
          defaultValue={defaultValue}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-[15px] leading-relaxed text-ink focus:border-gold focus:outline-none"
        />
        <p className="text-[12px] leading-relaxed text-ink/50">
          Để một dòng trống giữa các đoạn. Chọn chữ rồi bấm nút để định dạng, hoặc gõ trực tiếp: <code>## Tiêu đề phụ</code>, <code>**đậm**</code>,{" "}
          <code>*nghiêng*</code>, <code>[chữ](https://…)</code>, <code>- danh sách</code>, <code>&gt; trích dẫn</code>.
        </p>
      </div>

      {tab === "preview" && (
        <div className="border border-walnut/15 bg-ivory px-5 py-6">
          <div className="max-w-[680px] space-y-6 text-[16px] leading-relaxed text-ink/80">
            {parseBody(previewText).length ? (
              <ArticleBody paragraphs={parseBody(previewText)} reveal={false} />
            ) : (
              <p className="text-ink/45">Chưa có nội dung.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

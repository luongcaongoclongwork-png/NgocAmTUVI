"use client";

import { useId, useRef, useState } from "react";

/**
 * Vietnamese image picker for admin forms: replaces the browser's own
 * "Choose File / No file chosen" (whose language follows the browser), shows
 * a preview, and optionally lets the admin remove the current image
 * (submits `${name}Remove=1`).
 */
export default function ImageUploadField({
  name,
  label,
  currentUrl,
  hint,
  allowRemove = false,
  required = false,
  previewClassName = "h-40 w-auto",
}: {
  name: string;
  label: string;
  currentUrl?: string | null;
  hint?: string;
  allowRemove?: boolean;
  required?: boolean;
  previewClassName?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 text-sm text-ink/80">
      <label htmlFor={id}>{label}</label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="tracking-label h-10 border border-walnut/30 px-4 text-[12px] font-medium uppercase text-walnut hover:border-gold hover:text-gold"
        >
          {preview ? "Đổi ảnh…" : "Chọn ảnh…"}
        </button>
        <span className="text-[13px] text-ink/55">{fileName ?? (preview ? "Đang dùng ảnh hiện tại" : "Chưa có ảnh")}</span>
        {allowRemove && preview && (
          <button
            type="button"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              setPreview(null);
              setFileName(null);
              setRemoved(true);
            }}
            className="text-[13px] text-lacquer hover:underline"
          >
            Xoá ảnh
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required={required && !preview}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setPreview(URL.createObjectURL(file));
          setFileName(file.name);
          setRemoved(false);
        }}
      />
      {removed && <input type="hidden" name={`${name}Remove`} value="1" />}
      {hint && <span className="text-[12px] text-ink/50">{hint}</span>}
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element -- local blob: preview, not an optimisable asset
        <img src={preview} alt="Xem trước" className={`mt-2 border border-walnut/15 object-cover ${previewClassName}`} />
      )}
    </div>
  );
}

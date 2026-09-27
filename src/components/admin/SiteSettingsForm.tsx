"use client";

import KeepValuesForm from "./KeepValuesForm";
import { useActionState } from "react";
import { saveSettingsAction, type SettingsFormState } from "@/app/admin/cai-dat/actions";
import { SETTING_FIELDS, SETTING_GROUPS, type SiteSettings } from "@/lib/site-settings-schema";

const initial: SettingsFormState = { error: null, fieldErrors: {}, savedAt: null, values: null };

export default function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, initial);

  return (
    <KeepValuesForm action={action} noValidate className="flex flex-col gap-12">
      {SETTING_GROUPS.map((g) => (
        <fieldset key={g.id} className="flex flex-col gap-5">
          {/* Description lives inside the legend: a legend is not a flex item,
              so a sibling paragraph with negative margin overlapped it. */}
          <legend className="mb-1">
            <span className="tracking-label block text-[12px] font-semibold uppercase text-walnut/60">{g.title}</span>
            <span className="mt-1 block text-[13px] text-ink/55">{g.desc}</span>
          </legend>
          {SETTING_FIELDS.filter((f) => f.group === g.id).map((f) => {
            const err = state.fieldErrors[f.key];
            return (
              <label key={f.key} className="flex max-w-xl flex-col gap-1.5 text-sm text-ink/80">
                {f.label}
                <input
                  name={f.key}
                  type={f.kind === "email" ? "email" : f.kind === "url" ? "url" : f.kind === "phone" ? "tel" : "text"}
                  inputMode={f.kind === "phone" ? "tel" : undefined}
                  defaultValue={state.values?.[f.key] ?? settings[f.key]}
                  placeholder={f.kind === "url" ? "https://…" : undefined}
                  aria-invalid={err ? true : undefined}
                  aria-describedby={err ? `err-${f.key}` : undefined}
                  className="min-h-11 border border-walnut/30 bg-transparent px-3 text-[15px] text-ink focus:border-gold focus:outline-none aria-invalid:border-lacquer/70"
                />
                {f.hint && !err && <span className="text-[12px] text-ink/50">{f.hint}</span>}
                {err && (
                  <span id={`err-${f.key}`} className="text-[13px] text-lacquer">
                    {err}
                  </span>
                )}
              </label>
            );
          })}
        </fieldset>
      ))}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-4 border-t border-walnut/15 bg-ivory/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
        <button
          type="submit"
          disabled={pending}
          className="tracking-label h-11 border border-walnut bg-walnut px-6 text-[12px] font-semibold uppercase text-ivory hover:bg-gold-deep disabled:opacity-60"
        >
          {pending ? "Đang lưu…" : "Lưu cài đặt"}
        </button>
        {state.error && (
          <p role="alert" className="text-[13px] font-medium text-lacquer">
            {state.error}
          </p>
        )}
        {state.savedAt && !state.error && (
          <p role="status" className="text-[13px] text-sage">
            ✓ Đã lưu lúc {state.savedAt}. Website đã cập nhật.
          </p>
        )}
      </div>
    </KeepValuesForm>
  );
}

"use client";

import { useActionState, useRef, useTransition } from "react";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/contact-leads-constants";
import {
  addLeadNoteAction,
  deleteLeadAction,
  saveAppointmentAction,
  setLeadStatusAction,
  type LeadFormState,
} from "@/app/admin/lien-he/actions";
import { STATUS_STYLE } from "./LeadStatusPill";

const initial: LeadFormState = { error: null, savedAt: null };
const btn =
  "tracking-label h-10 border border-walnut/30 px-4 text-[12px] font-medium uppercase text-walnut hover:border-gold hover:text-gold disabled:opacity-50";

function Feedback({ state }: { state: LeadFormState }) {
  if (state.error)
    return (
      <p role="alert" className="text-[13px] font-medium text-lacquer">
        {state.error}
      </p>
    );
  if (state.savedAt)
    return (
      <p role="status" className="text-[13px] text-sage">
        ✓ Đã lưu lúc {state.savedAt}
      </p>
    );
  return null;
}

/** Status: one tap per stage, no separate "save" step. */
export function LeadStatusControl({ id, status }: { id: number; status: LeadStatus }) {
  const [state, action, pending] = useActionState(setLeadStatusAction.bind(null, id), initial);
  return (
    <form action={action} className="flex flex-col gap-2">
      <div role="group" aria-label="Trạng thái" className="flex flex-wrap gap-2">
        {LEAD_STATUSES.map((s) => {
          const current = s.value === status;
          return (
            <button
              key={s.value}
              type="submit"
              name="status"
              value={s.value}
              disabled={pending}
              aria-pressed={current}
              className={`min-h-10 border px-3 text-[13px] transition-colors disabled:opacity-60 ${
                current ? `${STATUS_STYLE[s.value]} font-semibold` : "border-walnut/20 text-ink/65 hover:border-gold hover:text-gold"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <Feedback state={state} />
    </form>
  );
}

export function LeadAppointmentControl({ id, inputValue, label }: { id: number; inputValue: string; label: string | null }) {
  const [state, action, pending] = useActionState(saveAppointmentAction.bind(null, id), initial);
  return (
    <form action={action} className="flex flex-col gap-3">
      {label && <p className="font-heading text-[17px] text-ink">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor={`appt-${id}`}>
          Ngày giờ hẹn
        </label>
        <input
          // Remount when the saved value changes (e.g. after "Huỷ lịch") so the
          // uncontrolled field shows the new state, without resetting the form's feedback.
          key={inputValue}
          id={`appt-${id}`}
          type="datetime-local"
          name="appointmentAt"
          defaultValue={inputValue}
          className="min-h-10 border border-walnut/30 bg-transparent px-3 text-[15px] text-ink focus:border-gold focus:outline-none"
        />
        <button type="submit" disabled={pending} className={btn}>
          {pending ? "Đang lưu…" : label ? "Đổi lịch" : "Đặt lịch hẹn"}
        </button>
        {label && (
          <button type="submit" name="clear" value="1" disabled={pending} className="text-[13px] text-lacquer hover:underline disabled:opacity-50">
            Huỷ lịch
          </button>
        )}
      </div>
      <p className="text-[12px] text-ink/50">Giờ Việt Nam. Đặt lịch sẽ tự chuyển trạng thái sang “Đã đặt lịch”.</p>
      <Feedback state={state} />
    </form>
  );
}

export function LeadNoteForm({ id }: { id: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (prev: LeadFormState, fd: FormData) => {
    const next = await addLeadNoteAction(id, prev, fd);
    if (!next.error) formRef.current?.reset();
    return next;
  }, initial);
  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <label className="sr-only" htmlFor={`note-${id}`}>
        Ghi chú mới
      </label>
      <textarea
        id={`note-${id}`}
        name="body"
        rows={3}
        maxLength={2000}
        placeholder="Ví dụ: Đã gọi, khách hẹn gọi lại sáng thứ Bảy…"
        className="border border-walnut/30 bg-transparent px-3 py-2 text-[15px] text-ink focus:border-gold focus:outline-none"
      />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={btn}>
          {pending ? "Đang lưu…" : "Thêm ghi chú"}
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function DeleteLeadButton({ id, name }: { id: number; name: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Xoá vĩnh viễn khách “${name}” và toàn bộ ghi chú? Chỉ nên dùng cho tin rác hoặc tin thử.`)) return;
        startTransition(() => deleteLeadAction(id));
      }}
      className="text-[13px] text-lacquer hover:underline disabled:opacity-50"
    >
      {pending ? "Đang xoá…" : "Xoá khách này (tin rác / tin thử)"}
    </button>
  );
}

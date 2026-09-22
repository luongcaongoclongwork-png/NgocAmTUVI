"use client";

import { useActionState } from "react";
import { LEAD_STATUSES, type ContactLead } from "@/lib/contact-leads-constants";
import { updateLeadStatusAction, type LeadStatusFormState } from "@/app/admin/lien-he/actions";

const initialState: LeadStatusFormState = { error: null };

export default function AdminLeadStatusForm({ lead }: { lead: ContactLead }) {
  const boundAction = updateLeadStatusAction.bind(null, lead.id);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Trạng thái
        <select
          name="status"
          required
          defaultValue={lead.status}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Ghi chú nội bộ
        <textarea
          name="adminNote"
          rows={4}
          defaultValue={lead.adminNote}
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-lacquer">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="tracking-label h-10 w-fit border border-walnut/30 px-5 text-[12px] font-medium uppercase text-walnut hover:border-gold hover:text-gold disabled:opacity-50"
      >
        {pending ? "Đang lưu…" : "Lưu cập nhật"}
      </button>
    </form>
  );
}

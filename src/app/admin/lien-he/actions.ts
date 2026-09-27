"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { addLeadNote, setLeadAppointment, setLeadStatus } from "@/lib/contact-leads";
import { moveToTrash } from "@/lib/admin-entities";
import { isLeadStatus } from "@/lib/contact-leads-constants";
import { formatVietnamTime, fromVietnamInputValue } from "@/lib/vn-time";

export type LeadFormState = { error: string | null; savedAt: string | null };

const NOTE_MAX = 2000;

function revalidateLead(id: number) {
  revalidatePath("/admin");
  revalidatePath("/admin/lien-he");
  revalidatePath(`/admin/lien-he/${id}`);
}

const saved = (): LeadFormState => ({ error: null, savedAt: formatVietnamTime(new Date().toISOString()) });

/** One-click status change (each status is its own submit button). */
export async function setLeadStatusAction(id: number, _prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn.", savedAt: null };
  const status = String(formData.get("status") || "");
  if (!isLeadStatus(status)) return { error: "Trạng thái không hợp lệ.", savedAt: null };
  await setLeadStatus(id, status);
  revalidateLead(id);
  return saved();
}

export async function saveAppointmentAction(id: number, _prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn.", savedAt: null };
  if (formData.get("clear")) {
    await setLeadAppointment(id, null);
  } else {
    const at = fromVietnamInputValue(String(formData.get("appointmentAt") || ""));
    if (!at) return { error: "Vui lòng chọn ngày và giờ hẹn.", savedAt: null };
    await setLeadAppointment(id, at);
  }
  revalidateLead(id);
  return saved();
}

export async function addLeadNoteAction(id: number, _prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn.", savedAt: null };
  const body = String(formData.get("body") || "").trim();
  if (!body) return { error: "Ghi chú đang trống.", savedAt: null };
  if (body.length > NOTE_MAX) return { error: `Ghi chú tối đa ${NOTE_MAX} ký tự.`, savedAt: null };
  await addLeadNote(id, session.username, body);
  revalidateLead(id);
  return saved();
}

export async function deleteLeadAction(id: number) {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");
  moveToTrash("lead", id); // restorable from /admin/thung-rac for 30 days
  revalidatePath("/admin");
  revalidatePath("/admin/lien-he");
  revalidatePath("/admin/thung-rac");
  redirect("/admin/lien-he");
}

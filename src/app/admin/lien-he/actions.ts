"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import { updateLeadStatus } from "@/lib/contact-leads";
import { isLeadStatus } from "@/lib/contact-leads-constants";

export type LeadStatusFormState = { error: string | null };

export async function updateLeadStatusAction(
  id: number,
  _prev: LeadStatusFormState,
  formData: FormData
): Promise<LeadStatusFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const status = String(formData.get("status") || "");
  if (!isLeadStatus(status)) return { error: "Trạng thái không hợp lệ." };

  const adminNote = String(formData.get("adminNote") || "").trim();

  await updateLeadStatus(id, status, adminNote);
  revalidatePath("/admin/lien-he");
  revalidatePath(`/admin/lien-he/${id}`);
  return { error: null };
}

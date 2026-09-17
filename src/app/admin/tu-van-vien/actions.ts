"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import { createConsultant, updateConsultant } from "@/lib/consultants";

export type ConsultantFormState = { error: string | null };

type ParsedFields = { name: string; field: string; initials: string; bio: string; sortOrder: number };
type ReadFieldsResult = { ok: true; fields: ParsedFields } | { ok: false; error: string };

function readCommonFields(formData: FormData): ReadFieldsResult {
  const name = String(formData.get("name") || "").trim();
  const field = String(formData.get("field") || "").trim();
  const initials = String(formData.get("initials") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") || "0"), 10);

  if (!name) return { ok: false, error: "Vui lòng nhập tên." };
  if (!field) return { ok: false, error: "Vui lòng nhập danh xưng / lĩnh vực." };
  if (!initials) return { ok: false, error: "Vui lòng nhập chữ viết tắt hiển thị (ví dụ: MT)." };
  if (!bio) return { ok: false, error: "Vui lòng nhập tiểu sử." };
  if (!Number.isFinite(sortOrder)) return { ok: false, error: "Thứ tự hiển thị không hợp lệ." };

  return { ok: true, fields: { name, field, initials, bio, sortOrder } };
}

async function revalidateConsultantSurfaces() {
  revalidatePath("/admin/tu-van-vien");
  revalidatePath("/");
  revalidatePath("/ve-ngoc-am");
  revalidatePath("/tu-vi");
  revalidatePath("/phong-thuy");
}

export async function createConsultantAction(
  _prev: ConsultantFormState,
  formData: FormData
): Promise<ConsultantFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const result = readCommonFields(formData);
  if (!result.ok) return { error: result.error };

  await createConsultant(result.fields);
  await revalidateConsultantSurfaces();
  redirect("/admin/tu-van-vien");
}

export async function updateConsultantAction(
  id: number,
  _prev: ConsultantFormState,
  formData: FormData
): Promise<ConsultantFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const result = readCommonFields(formData);
  if (!result.ok) return { error: result.error };

  await updateConsultant(id, result.fields);
  await revalidateConsultantSurfaces();
  redirect("/admin/tu-van-vien");
}

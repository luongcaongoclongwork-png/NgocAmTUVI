"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import { createConsultant, setConsultantPhoto, updateConsultant } from "@/lib/consultants";
import { UploadError, deleteUploadedImage, saveUploadedImage } from "@/lib/uploads";

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

/**
 * Portrait from the form: a new file replaces the old one (whose file is
 * then deleted), "photoRemove" clears it, nothing chosen keeps it.
 * Returns an error message for a bad upload instead of throwing.
 */
async function applyPhoto(id: number, formData: FormData): Promise<string | null> {
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      const path = await saveUploadedImage(file);
      await deleteUploadedImage(await setConsultantPhoto(id, path));
    } catch (e) {
      if (e instanceof UploadError) return e.message;
      throw e;
    }
  } else if (formData.get("photoRemove")) {
    await deleteUploadedImage(await setConsultantPhoto(id, ""));
  }
  return null;
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

  const created = await createConsultant(result.fields);
  const photoError = await applyPhoto(created.id, formData);
  await revalidateConsultantSurfaces();
  if (photoError) return { error: `Đã lưu tư vấn viên, nhưng ảnh chưa tải lên được: ${photoError}` };
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
  const photoError = await applyPhoto(id, formData);
  await revalidateConsultantSurfaces();
  if (photoError) return { error: `Đã lưu thông tin, nhưng ảnh chưa tải lên được: ${photoError}` };
  redirect("/admin/tu-van-vien");
}

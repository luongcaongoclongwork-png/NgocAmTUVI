"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import { SERVICE_GROUPS, createService, updateService, type ServiceGroup } from "@/lib/services";

export type ServiceFormState = { error: string | null };

type ParsedFields = { group: ServiceGroup; title: string; desc: string; price: string; sortOrder: number };
type ReadFieldsResult = { ok: true; fields: ParsedFields } | { ok: false; error: string };

function readCommonFields(formData: FormData): ReadFieldsResult {
  const group = String(formData.get("group") || "");
  const title = String(formData.get("title") || "").trim();
  const desc = String(formData.get("desc") || "").trim();
  const price = String(formData.get("price") || "").trim();
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") || "0"), 10);

  if (!SERVICE_GROUPS.some((g) => g.value === group)) {
    return { ok: false, error: "Vui lòng chọn nhóm dịch vụ hợp lệ." };
  }
  if (!title) return { ok: false, error: "Vui lòng nhập tiêu đề." };
  if (!desc) return { ok: false, error: "Vui lòng nhập mô tả." };
  if (!price) return { ok: false, error: 'Vui lòng nhập giá (hoặc "Liên hệ").' };
  if (!Number.isFinite(sortOrder)) return { ok: false, error: "Thứ tự hiển thị không hợp lệ." };

  return { ok: true, fields: { group: group as ServiceGroup, title, desc, price, sortOrder } };
}

async function revalidateServiceSurfaces() {
  revalidatePath("/admin/dich-vu");
  revalidatePath("/tu-vi");
  revalidatePath("/phong-thuy");
  revalidatePath("/dich-vu");
}

export async function createServiceAction(
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const result = readCommonFields(formData);
  if (!result.ok) return { error: result.error };

  await createService(result.fields);
  await revalidateServiceSurfaces();
  redirect("/admin/dich-vu");
}

export async function updateServiceAction(
  id: number,
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const result = readCommonFields(formData);
  if (!result.ok) return { error: result.error };

  await updateService(id, result.fields);
  await revalidateServiceSurfaces();
  redirect("/admin/dich-vu");
}

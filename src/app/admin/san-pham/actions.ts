"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import {
  createProduct,
  createProductCategory,
  getProductCategoryByIdForAdmin,
  updateProduct,
  updateProductCategory,
} from "@/lib/products";
import { saveUploadedImage, deleteUploadedImage, UploadError } from "@/lib/uploads";

export type ProductCategoryFormState = { error: string | null };
export type ProductFormState = { error: string | null };

async function revalidateProductSurfaces() {
  revalidatePath("/admin/san-pham");
  revalidatePath("/");
  revalidatePath("/cua-hang");
}

// ---------- Danh mục ----------

type ParsedCategoryFields = { name: string; intro: string; sortOrder: number };
type ReadCategoryFieldsResult = { ok: true; fields: ParsedCategoryFields } | { ok: false; error: string };

function readCategoryFields(formData: FormData): ReadCategoryFieldsResult {
  const name = String(formData.get("name") || "").trim();
  const intro = String(formData.get("intro") || "").trim();
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") || "0"), 10);

  if (!name) return { ok: false, error: "Vui lòng nhập tên danh mục." };
  if (!intro) return { ok: false, error: "Vui lòng nhập mô tả ngắn." };
  if (!Number.isFinite(sortOrder)) return { ok: false, error: "Thứ tự hiển thị không hợp lệ." };

  return { ok: true, fields: { name, intro, sortOrder } };
}

export async function createProductCategoryAction(
  _prev: ProductCategoryFormState,
  formData: FormData
): Promise<ProductCategoryFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const result = readCategoryFields(formData);
  if (!result.ok) return { error: result.error };

  let image: string | null = null;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUploadedImage(imageFile);
    } catch (err) {
      return { error: err instanceof UploadError ? err.message : "Không thể tải ảnh lên." };
    }
  }

  await createProductCategory({ ...result.fields, image, imageAlt: image ? result.fields.name : null });
  await revalidateProductSurfaces();
  redirect("/admin/san-pham");
}

export async function updateProductCategoryAction(
  id: number,
  _prev: ProductCategoryFormState,
  formData: FormData
): Promise<ProductCategoryFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const existing = await getProductCategoryByIdForAdmin(id);
  if (!existing) return { error: "Không tìm thấy danh mục." };

  const result = readCategoryFields(formData);
  if (!result.ok) return { error: result.error };

  let image = existing.image;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUploadedImage(imageFile);
    } catch (err) {
      return { error: err instanceof UploadError ? err.message : "Không thể tải ảnh lên." };
    }
    if (existing.image) await deleteUploadedImage(existing.image);
  }

  await updateProductCategory(id, {
    ...result.fields,
    image,
    imageAlt: image ? result.fields.name : null,
  });
  await revalidateProductSurfaces();
  redirect("/admin/san-pham");
}

// ---------- Món trong danh mục ----------

type ParsedProductFields = { categoryId: number; name: string; desc: string; sortOrder: number };
type ReadProductFieldsResult = { ok: true; fields: ParsedProductFields } | { ok: false; error: string };

function readProductFields(formData: FormData): ReadProductFieldsResult {
  const categoryId = Number.parseInt(String(formData.get("categoryId") || ""), 10);
  const name = String(formData.get("name") || "").trim();
  const desc = String(formData.get("desc") || "").trim();
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") || "0"), 10);

  if (!Number.isFinite(categoryId)) return { ok: false, error: "Vui lòng chọn danh mục." };
  if (!name) return { ok: false, error: "Vui lòng nhập tên sản phẩm." };
  if (!desc) return { ok: false, error: "Vui lòng nhập mô tả." };
  if (!Number.isFinite(sortOrder)) return { ok: false, error: "Thứ tự hiển thị không hợp lệ." };

  return { ok: true, fields: { categoryId, name, desc, sortOrder } };
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const result = readProductFields(formData);
  if (!result.ok) return { error: result.error };

  await createProduct(result.fields);
  await revalidateProductSurfaces();
  redirect("/admin/san-pham");
}

export async function updateProductAction(
  id: number,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const result = readProductFields(formData);
  if (!result.ok) return { error: result.error };

  await updateProduct(id, result.fields);
  await revalidateProductSurfaces();
  redirect("/admin/san-pham");
}

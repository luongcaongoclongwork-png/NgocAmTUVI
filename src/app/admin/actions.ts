"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession, deleteSession } from "@/lib/auth";
import { deleteArticle as deleteArticleFromDb, getArticleByIdForAdmin } from "@/lib/articles";
import { deleteService as deleteServiceFromDb } from "@/lib/services";
import { deleteConsultant as deleteConsultantFromDb } from "@/lib/consultants";
import {
  deleteProduct as deleteProductFromDb,
  deleteProductCategory as deleteProductCategoryFromDb,
  getProductCategoryByIdForAdmin,
} from "@/lib/products";
import { deleteUploadedImage } from "@/lib/uploads";

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}

export async function deleteArticleAction(id: number) {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  const article = await getArticleByIdForAdmin(id);
  if (!article) return;

  await deleteArticleFromDb(id);
  await deleteUploadedImage(article.image);

  revalidatePath("/admin");
  revalidatePath("/kien-thuc");
  revalidatePath("/phat-hoc");
  revalidatePath("/");
  revalidatePath(`/kien-thuc/${article.slug}`);
}

async function revalidateServiceSurfaces() {
  revalidatePath("/admin/dich-vu");
  revalidatePath("/tu-vi");
  revalidatePath("/phong-thuy");
  revalidatePath("/dich-vu");
}

export async function deleteServiceAction(id: number) {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  await deleteServiceFromDb(id);
  await revalidateServiceSurfaces();
}

async function revalidateConsultantSurfaces() {
  revalidatePath("/admin/tu-van-vien");
  revalidatePath("/");
  revalidatePath("/ve-ngoc-am");
  revalidatePath("/tu-vi");
  revalidatePath("/phong-thuy");
}

export async function deleteConsultantAction(id: number) {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  await deleteConsultantFromDb(id);
  await revalidateConsultantSurfaces();
}

async function revalidateProductSurfaces() {
  revalidatePath("/admin/san-pham");
  revalidatePath("/");
  revalidatePath("/cua-hang");
}

export async function deleteProductCategoryAction(id: number) {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  const category = await getProductCategoryByIdForAdmin(id);
  if (!category) return;

  await deleteProductCategoryFromDb(id);
  if (category.image) await deleteUploadedImage(category.image);

  await revalidateProductSurfaces();
}

export async function deleteProductAction(id: number) {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  await deleteProductFromDb(id);
  await revalidateProductSurfaces();
}

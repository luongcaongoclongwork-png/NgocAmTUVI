"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession, deleteSession } from "@/lib/auth";
import { getArticleByIdForAdmin } from "@/lib/articles";
import { ENTITIES, moveToTrash, type EntityKey } from "@/lib/admin-entities";
import { deleteUser as deleteUserFromDb, getUserCount } from "@/lib/users";

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}

/**
 * The "Xoá" buttons on the admin lists move items to the trash
 * (/admin/thung-rac) instead of deleting them: they can be restored for
 * 30 days, and images are only removed when the item is purged.
 */
async function trashAndRevalidate(key: EntityKey, id: number) {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");
  moveToTrash(key, id);
  for (const p of ENTITIES[key].revalidate) revalidatePath(p);
  revalidatePath("/admin/thung-rac");
}

export async function deleteArticleAction(id: number) {
  const article = await getArticleByIdForAdmin(id);
  await trashAndRevalidate("article", id);
  if (article) revalidatePath(`/kien-thuc/${article.slug}`);
}

export async function deleteServiceAction(id: number) {
  await trashAndRevalidate("service", id);
}

export async function deleteConsultantAction(id: number) {
  await trashAndRevalidate("consultant", id);
}

export async function deleteProductCategoryAction(id: number) {
  await trashAndRevalidate("category", id);
}

export async function deleteProductAction(id: number) {
  await trashAndRevalidate("product", id);
}

/** Returns an error message instead of throwing — the delete button needs to
 * show these two guardrails inline rather than crash the page. Admin
 * accounts are deleted for real (no trash for logins). */
export async function deleteUserAction(id: number): Promise<{ error: string | null }> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };
  if (session.userId === id) return { error: "Không thể tự xoá tài khoản đang đăng nhập." };

  const count = await getUserCount();
  if (count <= 1) return { error: "Không thể xoá tài khoản admin cuối cùng." };

  await deleteUserFromDb(id);
  revalidatePath("/admin/tai-khoan");
  return { error: null };
}

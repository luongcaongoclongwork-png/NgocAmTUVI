"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession, deleteSession } from "@/lib/auth";
import { deleteArticle as deleteArticleFromDb, getArticleByIdForAdmin } from "@/lib/articles";
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

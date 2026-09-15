"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import {
  CATEGORIES,
  createArticle,
  updateArticle,
  getArticleByIdForAdmin,
  type ArticleStatus,
} from "@/lib/articles";
import { saveUploadedImage, deleteUploadedImage, UploadError } from "@/lib/uploads";

export type ArticleFormState = { error: string | null };

function parseBody(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

type ParsedFields = { title: string; category: string; excerpt: string; body: string[]; status: ArticleStatus };
type ReadFieldsResult = { ok: true; fields: ParsedFields } | { ok: false; error: string };

function readCommonFields(formData: FormData): ReadFieldsResult {
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "");
  const excerpt = String(formData.get("excerpt") || "").trim();
  const bodyRaw = String(formData.get("body") || "");
  const status = (formData.get("status") === "published" ? "published" : "draft") as ArticleStatus;
  const body = parseBody(bodyRaw);

  if (!title) return { ok: false, error: "Vui lòng nhập tiêu đề." };
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { ok: false, error: "Vui lòng chọn một chuyên mục hợp lệ." };
  }
  if (!excerpt) return { ok: false, error: "Vui lòng nhập mô tả ngắn." };
  if (body.length === 0) return { ok: false, error: "Vui lòng nhập nội dung bài viết." };

  return { ok: true, fields: { title, category, excerpt, body, status } };
}

async function revalidateArticleSurfaces(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/kien-thuc");
  revalidatePath("/phat-hoc");
  revalidatePath("/");
  revalidatePath(`/kien-thuc/${slug}`);
}

export async function createArticleAction(
  _prev: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const result = readCommonFields(formData);
  if (!result.ok) return { error: result.error };
  const { fields } = result;

  const imageFile = formData.get("image");
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return { error: "Vui lòng chọn một ảnh bìa." };
  }

  let image: string;
  try {
    image = await saveUploadedImage(imageFile);
  } catch (err) {
    return { error: err instanceof UploadError ? err.message : "Không thể tải ảnh lên." };
  }

  const article = await createArticle({
    title: fields.title,
    category: fields.category,
    excerpt: fields.excerpt,
    body: fields.body,
    status: fields.status,
    image,
    authorId: session.userId,
  });

  await revalidateArticleSurfaces(article.slug);
  redirect("/admin");
}

export async function updateArticleAction(
  id: number,
  _prev: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const existing = await getArticleByIdForAdmin(id);
  if (!existing) return { error: "Không tìm thấy bài viết." };

  const result = readCommonFields(formData);
  if (!result.ok) return { error: result.error };
  const { fields } = result;

  let image = existing.image;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUploadedImage(imageFile);
    } catch (err) {
      return { error: err instanceof UploadError ? err.message : "Không thể tải ảnh lên." };
    }
    await deleteUploadedImage(existing.image);
  }

  const article = await updateArticle(id, {
    title: fields.title,
    category: fields.category,
    excerpt: fields.excerpt,
    body: fields.body,
    status: fields.status,
    image,
    authorId: existing.authorId,
  });

  await revalidateArticleSurfaces(article.slug);
  redirect("/admin");
}

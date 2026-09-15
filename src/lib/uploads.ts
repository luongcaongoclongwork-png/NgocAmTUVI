import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SOURCE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_WIDTH = 1600;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export class UploadError extends Error {}

/**
 * Validates, re-encodes to capped-width .webp (sharp also strips any
 * embedded metadata/payload as a side effect — a real image library
 * re-encoding the pixels is a stronger guarantee than a MIME/extension
 * check alone), and saves under public/uploads/ with a generated filename
 * (never the user's original name, avoids path-traversal entirely).
 * Returns the root-relative path to store in an article's `image` field.
 */
export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadError("Chỉ nhận ảnh JPEG, PNG hoặc WEBP.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new UploadError("Ảnh quá lớn — tối đa 15MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let output: Buffer;
  try {
    output = await sharp(buffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw new UploadError("File không phải ảnh hợp lệ.");
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${crypto.randomUUID()}.webp`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), output);

  return `/uploads/${filename}`;
}

/**
 * Only ever deletes files under /uploads/ — the seeded articles' images
 * live under /images/ (the curated, hand-picked asset folder) and must
 * never be touched by this. Non-fatal: a missing/already-gone file should
 * never block the DB write that called this.
 */
export async function deleteUploadedImage(imagePath: string): Promise<void> {
  if (!imagePath.startsWith("/uploads/")) return;
  const filename = path.basename(imagePath);
  try {
    await fs.unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // already gone / never existed — fine, DB is the source of truth
  }
}

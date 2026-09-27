import fs from "node:fs/promises";
import { verifySession } from "@/lib/auth";
import { backupPath, createBackup } from "@/lib/backup";

/**
 * GET /admin/sao-luu/tai-ve?file=<name> downloads an existing backup;
 * without ?file it first makes a fresh backup ("-tay" = made by hand) and
 * downloads that. Only names matching the backup pattern are served, so
 * this can never read any other file.
 */
export async function GET(request: Request) {
  if (!(await verifySession())) return new Response("Unauthorized", { status: 401 });

  const requested = new URL(request.url).searchParams.get("file");
  const name = requested ?? (await createBackup(true));
  const file = backupPath(name);
  if (!file) return new Response("Tên file không hợp lệ.", { status: 400 });

  let data: Buffer;
  try {
    data = await fs.readFile(file);
  } catch {
    return new Response("Không tìm thấy bản sao lưu này.", { status: 404 });
  }
  return new Response(new Uint8Array(data), {
    headers: {
      "content-type": "application/vnd.sqlite3",
      "content-disposition": `attachment; filename="${name}"`,
      "cache-control": "no-store",
    },
  });
}

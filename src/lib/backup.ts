import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { getDb } from "@/lib/db";

/**
 * Copies of the whole database (every lead, article, service, setting…) in
 * data/backups/. Uses SQLite's online backup, so a copy is consistent even
 * while the site is being used. Uploaded images live in public/uploads/ and
 * are NOT inside the database file.
 */

export const BACKUP_DIR = path.join(process.cwd(), "data", "backups");
export const KEEP_BACKUPS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;
const NAME_RE = /^ngoc-am-\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}(-tay)?\.db$/;

export type BackupFile = { name: string; size: number; createdAt: string; manual: boolean };

export function isBackupName(name: string): boolean {
  return NAME_RE.test(name);
}

/** "ngoc-am-2026-09-28_09-30-05.db", in Vietnam time so the name reads naturally. */
function backupName(manual: boolean): string {
  const vn = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(); // Vietnam is UTC+7, no DST
  const stamp = `${vn.slice(0, 10)}_${vn.slice(11, 19).replace(/:/g, "-")}`;
  return `ngoc-am-${stamp}${manual ? "-tay" : ""}.db`;
}

export async function listBackups(): Promise<BackupFile[]> {
  let names: string[] = [];
  try {
    names = await fs.readdir(BACKUP_DIR);
  } catch {
    return [];
  }
  const files = await Promise.all(
    names.filter(isBackupName).map(async (name) => {
      const st = await fs.stat(path.join(BACKUP_DIR, name));
      return { name, size: st.size, createdAt: st.mtime.toISOString(), manual: name.endsWith("-tay.db") };
    })
  );
  return files.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Makes a new backup and keeps only the newest KEEP_BACKUPS. Returns the file name. */
export async function createBackup(manual = false): Promise<string> {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const name = backupName(manual);
  await getDb().backup(path.join(BACKUP_DIR, name));
  const all = await listBackups();
  for (const old of all.slice(KEEP_BACKUPS)) await fs.rm(path.join(BACKUP_DIR, old.name), { force: true });
  return name;
}

/** Automatic daily copy: only if the newest backup is older than a day. Never throws. */
export async function maybeDailyBackup(): Promise<void> {
  try {
    const [newest] = await listBackups();
    if (newest && Date.now() - new Date(newest.createdAt).getTime() < DAY_MS) return;
    await createBackup(false);
  } catch (e) {
    console.error("[backup] daily backup failed:", e);
  }
}

export function backupPath(name: string): string | null {
  return isBackupName(name) ? path.join(BACKUP_DIR, name) : null;
}

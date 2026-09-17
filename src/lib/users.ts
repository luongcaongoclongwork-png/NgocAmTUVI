import "server-only";
import { getDb, hashPassword } from "@/lib/db";

export type AdminUser = { id: number; username: string; createdAt: string };

type UserRow = { id: number; username: string; created_at: string };

function rowToUser(row: UserRow): AdminUser {
  return { id: row.id, username: row.username, createdAt: row.created_at };
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const db = getDb();
  const rows = db.prepare("SELECT id, username, created_at FROM users ORDER BY id ASC").all() as UserRow[];
  return rows.map(rowToUser);
}

export async function getUserCount(): Promise<number> {
  const db = getDb();
  return (db.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number }).n;
}

export async function usernameExists(username: string): Promise<boolean> {
  const db = getDb();
  return !!db.prepare("SELECT 1 FROM users WHERE username = ?").get(username);
}

export async function createUser(username: string, password: string): Promise<AdminUser> {
  const db = getDb();
  const now = new Date().toISOString();
  const info = db
    .prepare("INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)")
    .run(username, hashPassword(password), now);
  return { id: Number(info.lastInsertRowid), username, createdAt: now };
}

export async function deleteUser(id: number): Promise<void> {
  getDb().prepare("DELETE FROM users WHERE id = ?").run(id);
}

export async function setUserPassword(id: number, newPassword: string): Promise<void> {
  getDb().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(newPassword), id);
}

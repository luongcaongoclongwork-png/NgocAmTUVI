"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import {
  ENTITIES,
  isEntityKey,
  moveToTrash,
  purge,
  reorder,
  restoreFromTrash,
  setHidden,
  type EntityKey,
} from "@/lib/admin-entities";

export type ListActionResult = { error: string | null };

function revalidate(key: EntityKey) {
  for (const p of ENTITIES[key].revalidate) revalidatePath(p);
  revalidatePath("/admin/thung-rac");
}

async function guard(key: unknown, id?: unknown): Promise<string | null> {
  if (!(await verifySession())) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
  if (!isEntityKey(key)) return "Loại mục không hợp lệ.";
  if (id !== undefined && !(Number.isInteger(id) && (id as number) > 0)) return "Mục không hợp lệ.";
  return null;
}

export async function setHiddenAction(key: EntityKey, id: number, hidden: boolean): Promise<ListActionResult> {
  const err = await guard(key, id);
  if (err) return { error: err };
  try {
    setHidden(key, id, hidden);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Không lưu được." };
  }
  revalidate(key);
  return { error: null };
}

export async function reorderAction(key: EntityKey, ids: number[]): Promise<ListActionResult> {
  const err = await guard(key);
  if (err) return { error: err };
  if (!Array.isArray(ids) || !ids.every((id) => Number.isInteger(id) && id > 0)) return { error: "Danh sách không hợp lệ." };
  try {
    reorder(key, ids);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Không lưu được thứ tự." };
  }
  revalidate(key);
  return { error: null };
}

export async function trashAction(key: EntityKey, id: number): Promise<ListActionResult> {
  const err = await guard(key, id);
  if (err) return { error: err };
  moveToTrash(key, id);
  revalidate(key);
  return { error: null };
}

export async function restoreAction(key: EntityKey, id: number): Promise<ListActionResult> {
  const err = await guard(key, id);
  if (err) return { error: err };
  restoreFromTrash(key, id);
  revalidate(key);
  return { error: null };
}

export async function purgeAction(key: EntityKey, id: number): Promise<ListActionResult> {
  const err = await guard(key, id);
  if (err) return { error: err };
  await purge(key, id);
  revalidate(key);
  return { error: null };
}

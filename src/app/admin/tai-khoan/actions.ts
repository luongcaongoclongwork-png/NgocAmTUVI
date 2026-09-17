"use server";

import { revalidatePath } from "next/cache";
import { verifySession, verifyUserPassword } from "@/lib/auth";
import { createUser, setUserPassword, usernameExists } from "@/lib/users";

export type ChangePasswordFormState = { error: string | null; success?: boolean };
export type CreateUserFormState = { error: string | null; success?: boolean };

function validateNewPassword(password: string): string | null {
  if (password.length < 8) return "Mật khẩu mới phải có ít nhất 8 ký tự.";
  return null;
}

export async function changePasswordAction(
  _prev: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword) return { error: "Vui lòng nhập mật khẩu hiện tại." };
  const pwError = validateNewPassword(newPassword);
  if (pwError) return { error: pwError };
  if (newPassword !== confirmPassword) return { error: "Mật khẩu mới nhập lại không khớp." };

  const ok = await verifyUserPassword(session.userId, currentPassword);
  if (!ok) return { error: "Mật khẩu hiện tại không đúng." };

  await setUserPassword(session.userId, newPassword);
  return { error: null, success: true };
}

export async function createUserAction(
  _prev: CreateUserFormState,
  formData: FormData
): Promise<CreateUserFormState> {
  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn." };

  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!username) return { error: "Vui lòng nhập tên đăng nhập." };
  if (await usernameExists(username)) return { error: "Tên đăng nhập này đã tồn tại." };
  const pwError = validateNewPassword(password);
  if (pwError) return { error: pwError };
  if (password !== confirmPassword) return { error: "Mật khẩu nhập lại không khớp." };

  await createUser(username, password);
  revalidatePath("/admin/tai-khoan");
  return { error: null, success: true };
}

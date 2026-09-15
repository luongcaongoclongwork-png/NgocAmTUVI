"use server";

import { redirect } from "next/navigation";
import { login, isLoginLocked } from "@/lib/auth";

export type LoginState = { error: string | null };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const { locked, retryInSeconds } = await isLoginLocked();
  if (locked) {
    return {
      error: `Đã nhập sai quá nhiều lần. Vui lòng thử lại sau ${Math.ceil(retryInSeconds / 60)} phút.`,
    };
  }

  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  if (!username || !password) {
    return { error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu." };
  }

  const user = await login(username, password);
  if (!user) {
    return { error: "Sai tên đăng nhập hoặc mật khẩu." };
  }

  redirect("/admin");
}

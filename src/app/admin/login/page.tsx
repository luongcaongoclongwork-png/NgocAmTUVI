"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-24">
      <p className="tracking-label text-[12px] font-medium uppercase text-gold">Ngọc Âm</p>
      <h1 className="mt-2 font-heading text-2xl text-ink">Đăng nhập quản trị</h1>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-ink/80">
          Tên đăng nhập
          <input
            name="username"
            type="text"
            required
            autoComplete="username"
            className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-ink/80">
          Mật khẩu
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
          />
        </label>

        {state.error && (
          <p role="alert" className="text-sm font-medium text-lacquer">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="tracking-label mt-2 h-11 border border-walnut/30 text-[13px] font-medium uppercase text-walnut hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {pending ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { createUserAction, type CreateUserFormState } from "@/app/admin/tai-khoan/actions";

const initialState: CreateUserFormState = { error: null };

export default function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, initialState);

  return (
    <form action={formAction} key={state.success ? "done" : "form"} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Tên đăng nhập
        <input
          name="username"
          type="text"
          required
          autoComplete="off"
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Mật khẩu (ít nhất 8 ký tự)
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink/80">
        Nhập lại mật khẩu
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="border border-walnut/30 bg-transparent px-3 py-2 text-ink focus:border-gold focus:outline-none"
        />
      </label>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-lacquer">
          {state.error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="tracking-label h-11 border border-walnut/30 px-4 text-[13px] font-medium uppercase text-walnut hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {pending ? "Đang tạo…" : "Thêm tài khoản"}
        </button>
      </div>
    </form>
  );
}

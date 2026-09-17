import { verifySession } from "@/lib/auth";
import { getAllUsers } from "@/lib/users";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import CreateUserForm from "@/components/admin/CreateUserForm";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

export default async function AdminAccountsPage() {
  const [session, users] = await Promise.all([verifySession(), getAllUsers()]);

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="font-heading text-2xl text-ink">Tài khoản</h1>
        <p className="mt-2 max-w-lg text-sm text-ink/60">
          Quản lý mật khẩu của bạn và các tài khoản có quyền truy cập trang quản trị.
        </p>
      </div>

      <div>
        <h2 className="tracking-label text-[12px] font-semibold uppercase text-walnut/60">
          Đổi mật khẩu của bạn
        </h2>
        <div className="mt-6 max-w-md">
          <ChangePasswordForm />
        </div>
      </div>

      <div>
        <h2 className="tracking-label text-[12px] font-semibold uppercase text-walnut/60">
          Tài khoản quản trị
        </h2>

        <div className="mt-6 divide-y divide-walnut/10 border-y border-walnut/10">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="font-heading text-[16px] text-ink">
                  {user.username}
                  {session?.userId === user.id && (
                    <span className="tracking-label ml-2 text-[10px] font-semibold uppercase text-gold">
                      (bạn)
                    </span>
                  )}
                </p>
                <p className="text-[12px] text-ink/50">
                  Tạo lúc {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              {session?.userId !== user.id && (
                <div className="shrink-0 text-[13px]">
                  <DeleteUserButton id={user.id} username={user.username} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-md">
          <h3 className="tracking-label text-[11px] font-semibold uppercase text-walnut/60">
            Thêm tài khoản mới
          </h3>
          <div className="mt-4">
            <CreateUserForm />
          </div>
        </div>
      </div>
    </div>
  );
}

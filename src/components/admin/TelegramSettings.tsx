"use client";

import { useActionState } from "react";
import {
  findTelegramChatsAction,
  sendTelegramTestAction,
  type TelegramChatsState,
  type TelegramTestState,
} from "@/app/admin/tai-khoan/telegram-actions";

const btn =
  "tracking-label h-10 w-fit border border-walnut/30 px-5 text-[12px] font-medium uppercase text-walnut hover:border-gold hover:text-gold disabled:opacity-50";

export default function TelegramSettings({ hasToken, chatCount }: { hasToken: boolean; chatCount: number }) {
  const [test, testAction, testing] = useActionState<TelegramTestState>(sendTelegramTestAction, {
    ok: false,
    message: null,
  });
  const [found, findAction, finding] = useActionState<TelegramChatsState>(findTelegramChatsAction, {
    chats: null,
    error: null,
  });
  const ready = hasToken && chatCount > 0;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink/70">
        Trạng thái:{" "}
        {ready ? (
          <span className="font-medium text-sage">Đang bật — gửi tới {chatCount} người nhận</span>
        ) : (
          <span className="font-medium text-lacquer">
            Chưa bật ({!hasToken ? "thiếu mã bot" : "thiếu Chat ID"})
          </span>
        )}
      </p>

      {!ready && (
        <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink/75">
          <li>
            Trong Telegram, nhắn <b>@BotFather</b> → gõ <code>/newbot</code> → đặt tên → nhận <b>mã bot</b>.
          </li>
          <li>
            Mở file <code>.env.local</code>, thêm dòng <code>TELEGRAM_BOT_TOKEN=&lt;mã bot&gt;</code>, khởi động lại web.
          </li>
          <li>Mở bot vừa tạo trong Telegram, bấm <b>Start</b> và nhắn cho nó một tin bất kỳ.</li>
          <li>
            Bấm <b>Tìm Chat ID</b> bên dưới, chép số hiện ra vào <code>.env.local</code>:{" "}
            <code>TELEGRAM_CHAT_ID=&lt;số&gt;</code> (nhiều người nhận: cách nhau bằng dấu phẩy), khởi động lại web.
          </li>
          <li>
            Nên thêm <code>SITE_URL=https://tên-miền-của-bạn</code> để tin nhắn có link mở thẳng khách trong trang quản trị.
          </li>
        </ol>
      )}

      <div className="flex flex-wrap gap-3">
        <form action={testAction}>
          <button type="submit" disabled={testing || !ready} className={btn}>
            {testing ? "Đang gửi…" : "Gửi tin thử"}
          </button>
        </form>
        <form action={findAction}>
          <button type="submit" disabled={finding || !hasToken} className={btn}>
            {finding ? "Đang tìm…" : "Tìm Chat ID"}
          </button>
        </form>
      </div>

      {test.message && (
        <p role="status" className={`text-sm font-medium ${test.ok ? "text-sage" : "text-lacquer"}`}>
          {test.message}
        </p>
      )}

      {found.error && (
        <p role="alert" className="text-sm font-medium text-lacquer">
          {found.error}
        </p>
      )}
      {found.chats && found.chats.length === 0 && !found.error && (
        <p role="status" className="text-sm text-ink/70">
          Chưa thấy tin nào. Hãy mở bot trong Telegram, bấm Start, nhắn một tin, rồi bấm lại “Tìm Chat ID”.
        </p>
      )}
      {found.chats && found.chats.length > 0 && (
        <div role="status" className="border border-walnut/15 text-sm">
          {found.chats.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-walnut/10 px-4 py-3 last:border-b-0">
              <span className="text-ink/80">
                {c.name} <span className="text-ink/45">({c.type === "private" ? "cá nhân" : "nhóm"})</span>
              </span>
              <code className="select-all bg-parchment/60 px-2 py-1 text-ink">{c.id}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

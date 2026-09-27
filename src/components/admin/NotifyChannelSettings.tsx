"use client";

import { useActionState, type ReactNode } from "react";
import {
  findNotifyChatsAction,
  sendNotifyTestAction,
  type NotifyChatsState,
  type NotifyTestState,
} from "@/app/admin/tai-khoan/notify-actions";
import type { ChannelStatus } from "@/lib/notify-channels";

const btn =
  "tracking-label h-10 w-fit border border-walnut/30 px-5 text-[12px] font-medium uppercase text-walnut hover:border-gold hover:text-gold disabled:opacity-50";

/** Setup steps per channel; the last two steps (Chat ID, test) are shared. */
const CREATE_STEPS: Record<ChannelStatus["key"], ReactNode[]> = {
  zalo: [
    <>
      Mở app <b>Zalo</b>, tìm tài khoản <b>Zalo Bot Manager</b>, chọn <b>Tạo bot</b>. Đặt tên bắt đầu bằng “Bot”, ví dụ <i>Bot Ngọc Âm</i>. Mã bot
      sẽ được gửi cho bạn qua tin nhắn Zalo.
    </>,
  ],
  telegram: [
    <>
      Trong Telegram, nhắn <b>@BotFather</b> → gõ <code>/newbot</code> → đặt tên → nhận <b>mã bot</b>.
    </>,
  ],
};

export default function NotifyChannelSettings({ status }: { status: ChannelStatus }) {
  const [test, testAction, testing] = useActionState<NotifyTestState>(sendNotifyTestAction.bind(null, status.key), {
    ok: false,
    message: null,
  });
  const [found, findAction, finding] = useActionState<NotifyChatsState>(findNotifyChatsAction.bind(null, status.key), {
    chats: null,
    error: null,
  });
  const ready = status.hasToken && status.chatCount > 0;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink/70">
        Trạng thái:{" "}
        {ready ? (
          <span className="font-medium text-sage">Đang bật: gửi tới {status.chatCount} người nhận</span>
        ) : (
          <span className="font-medium text-lacquer">Chưa bật ({!status.hasToken ? "thiếu mã bot" : "thiếu Chat ID"})</span>
        )}
      </p>

      {!ready && (
        <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink/75">
          {CREATE_STEPS[status.key].map((step, i) => (
            <li key={i}>{step}</li>
          ))}
          <li>
            Mở file <code>.env.local</code>, thêm dòng <code>{status.tokenEnv}=&lt;mã bot&gt;</code>, rồi khởi động lại web.
          </li>
          <li>
            Mở cuộc trò chuyện với bot vừa tạo trong {status.label} và <b>nhắn cho bot một tin bất kỳ</b> (bot chỉ nhắn được cho người đã nhắn nó trước).
          </li>
          <li>
            Bấm <b>Tìm Chat ID</b> bên dưới, chép mã hiện ra vào <code>.env.local</code>: <code>{status.chatEnv}=&lt;mã&gt;</code> (nhiều người nhận: cách
            nhau bằng dấu phẩy), rồi khởi động lại web.
          </li>
          <li>
            Bấm <b>Gửi tin thử</b> để kiểm tra.
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
          <button type="submit" disabled={finding || !status.hasToken} className={btn}>
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
          Chưa thấy tin nào. Hãy nhắn cho bot một tin trong {status.label}, đợi vài giây rồi bấm lại “Tìm Chat ID”.
        </p>
      )}
      {found.chats && found.chats.length > 0 && (
        <div role="status" className="border border-walnut/15 text-sm">
          {found.chats.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-walnut/10 px-4 py-3 last:border-b-0">
              <span className="text-ink/80">
                {c.name} <span className="text-ink/45">({c.group ? "nhóm" : "cá nhân"})</span>
              </span>
              <code className="select-all break-all bg-parchment/60 px-2 py-1 text-ink">{c.id}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

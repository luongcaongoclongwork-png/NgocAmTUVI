"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { submitLeadAction, type SubmitLeadState } from "@/app/lien-he/actions";
import { CONTACT_TOPICS, type TopicId } from "@/lib/contact-leads-constants";
import "./lienHe.css";

type PanelPhase = "active" | "exiting" | "reply";

const initialSubmitLeadState: SubmitLeadState = { status: "idle" };

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function LienHeClient({
  initialTopicId,
  initialInterestText,
  zaloUrl,
  messengerUrl,
}: {
  initialTopicId: TopicId | null;
  initialInterestText: string;
  zaloUrl: string | null;
  messengerUrl: string | null;
}) {
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId | null>(initialTopicId);
  const [state, formAction, pending] = useActionState(submitLeadAction, initialSubmitLeadState);
  const [panelPhase, setPanelPhase] = useState<PanelPhase>("active");

  // The reply letter arrives via useActionState's own state, not a local
  // transition — this effect plays the 180ms exit on the letter form before
  // swapping to the reply, matching the spec'd two-stage transition. Same
  // setState-in-effect precedent as LaSoResultClient.tsx's sessionStorage-load
  // effect: syncing local UI phase to the action's async result.
  useEffect(() => {
    if (state.status !== "success") return;
    if (prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPanelPhase("reply");
      return;
    }
    setPanelPhase("exiting");
    const t = setTimeout(() => setPanelPhase("reply"), 180);
    return () => clearTimeout(t);
  }, [state.status]);

  const replyInterest = state.status === "success" ? state.interest : initialInterestText;

  return (
    <section className="bg-ivory py-16 lg:py-24">
      <div className="mx-auto max-w-[1220px] px-6 lg:px-10">
        <p className="lienhe-eyebrow tracking-label text-[12px] font-medium uppercase text-gold-deep">
          Gửi lời nhắn đến Ngọc Âm
        </p>
        <h1 className="lienhe-h1 mt-3 max-w-2xl text-[34px] font-heading leading-[1.2] text-ink sm:text-[38px] lg:text-5xl">
          Mỗi cuộc trao đổi đều bắt đầu từ sự lắng nghe.
        </h1>
        <p className="lienhe-intro mt-5 max-w-xl text-[15px] leading-relaxed text-ink/70">
          Hãy để lại đôi dòng về điều bạn đang cân nhắc. Ngọc Âm sẽ đọc kỹ những
          chia sẻ ấy và chuẩn bị một góc nhìn phù hợp với hoàn cảnh của bạn.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="tracking-label text-[12px] font-semibold uppercase text-walnut/70">
              Một cuộc trao đổi được chuẩn bị riêng
            </p>
            <ol className="mt-6 flex flex-col gap-4 text-[15px] leading-relaxed text-ink/75">
              <li>
                <span className="mr-2 text-gold-deep">01</span>Lắng nghe điều đang cần được làm rõ
              </li>
              <li>
                <span className="mr-2 text-gold-deep">02</span>Gợi ý cách trao đổi phù hợp
              </li>
              <li>
                <span className="mr-2 text-gold-deep">03</span>Hồi đáp trong một ngày làm việc
              </li>
            </ol>

            <div className="mt-10 border-t border-walnut/10 pt-8">
              <p className="tracking-label text-[12px] font-semibold uppercase text-walnut/70">
                Thông tin kết nối
              </p>
              <div className="mt-5 flex flex-col gap-2 text-[14px]">
                <ContactLink href="tel:+84775448989">0775 448 989</ContactLink>
                <ContactLink href="mailto:trangsucngocam.work@gmail.com">
                  trangsucngocam.work@gmail.com
                </ContactLink>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 text-[13.5px] sm:grid-cols-2">
                <ContactLink href="https://www.tiktok.com/@ngocam.tuviphongthuy" external>
                  TikTok
                </ContactLink>
                <ContactLink href="https://www.facebook.com/Tuviphongthuyngocam" external>
                  Facebook
                </ContactLink>
                <ContactLink href="https://www.instagram.com/ngocam_tuviphongthuy/" external>
                  Instagram
                </ContactLink>
              </div>
            </div>

            <p className="mt-10 max-w-sm text-[13px] leading-relaxed text-ink/50">
              Thông tin bạn chia sẻ được giữ riêng tư và chỉ được dùng để
              Ngọc Âm chuẩn bị cho cuộc trao đổi cùng bạn.
            </p>
          </div>

          <div className="lienhe-formcol order-1 lg:order-2">
            {panelPhase !== "reply" ? (
              <div className={panelPhase === "exiting" ? "lienhe-panel-exit" : undefined}>
                <LetterForm
                  selectedTopicId={selectedTopicId}
                  onSelectTopic={setSelectedTopicId}
                  formAction={formAction}
                  pending={pending}
                  error={state.status === "error" ? state.error : null}
                  zaloUrl={zaloUrl}
                  messengerUrl={messengerUrl}
                />
              </div>
            ) : (
              <ReplyLetter interest={replyInterest} zaloUrl={zaloUrl} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex w-fit min-h-[28px] items-center gap-1.5 py-1 text-ink/75 transition-colors hover:text-gold-deep"
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  );
}

function LetterFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative border border-walnut/15 bg-parchment/30 p-6 sm:p-10 lg:p-14">
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={32}
        height={32}
        className="absolute right-6 top-6 h-8 w-8 opacity-80 sm:right-8 sm:top-8"
      />
      {children}
    </div>
  );
}

function LetterForm({
  selectedTopicId,
  onSelectTopic,
  formAction,
  pending,
  error,
  zaloUrl,
  messengerUrl,
}: {
  selectedTopicId: TopicId | null;
  onSelectTopic: (id: TopicId) => void;
  formAction: (formData: FormData) => void;
  pending: boolean;
  error: string | null;
  zaloUrl: string | null;
  messengerUrl: string | null;
}) {
  return (
    <LetterFrame>
      <h2 className="tracking-label pr-12 text-[13px] font-semibold uppercase text-walnut">
        Đôi dòng chia sẻ
      </h2>

      <form action={formAction} className="mt-8 flex flex-col gap-7">
        {/* Honeypot — invisible and unreachable by keyboard for a real visitor. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
          <label htmlFor="lienhe-website">Để trống trường này</label>
          <input id="lienhe-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="flex flex-col gap-1.5 text-[14px] text-ink/80">
          Xưng danh của bạn
          <input
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Họ và tên"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-[14px] text-ink/80">
          Số điện thoại để Ngọc Âm hồi đáp
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="Ví dụ: 09xx xxx xxx"
            className={inputClass}
          />
        </label>

        <fieldset className="flex flex-col gap-1">
          <legend className="text-[14px] text-ink/80">Điều bạn muốn cùng chúng tôi quan sát</legend>
          <div className="mt-3 flex flex-col divide-y divide-walnut/10 border-y border-walnut/10">
            {CONTACT_TOPICS.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              return (
                <label
                  key={topic.id}
                  data-selected={isSelected}
                  className="lienhe-topic-row flex min-h-11 cursor-pointer items-center justify-between gap-3 py-3 pl-4 pr-2 text-[15px]"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="interest"
                      value={topic.label}
                      checked={isSelected}
                      onChange={() => onSelectTopic(topic.id)}
                      required
                      className="h-3.5 w-3.5 accent-[var(--gold)]"
                    />
                    {topic.label}
                  </span>
                  <span className="lienhe-topic-check text-[12px] text-gold-deep" aria-hidden="true">
                    ✓
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5 text-[14px] text-ink/80">
          Điều bạn muốn chia sẻ
          <textarea
            name="message"
            required
            minLength={5}
            maxLength={2000}
            rows={4}
            placeholder="Bạn có thể bắt đầu từ điều đang khiến mình băn khoăn nhất…"
            className={`${inputClass} resize-y`}
          />
        </label>

        <label className="flex items-start gap-3 text-[13.5px] leading-relaxed text-ink/80">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--gold)]"
          />
          <span>Tôi đồng ý để Ngọc Âm liên hệ lại về lời nhắn này.</span>
        </label>

        {error && (
          <p role="alert" className="text-[13.5px] font-medium text-lacquer">
            {error}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={pending}
            className="tracking-label flex h-11 items-center justify-center gap-2 bg-gold px-7 text-[12px] font-semibold uppercase text-ink transition-colors hover:bg-gold-deep hover:text-ivory disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? (
              <>
                Đang gửi…
                <span className="lienhe-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </>
            ) : (
              "Gửi lời nhắn"
            )}
          </button>
          <p className="mt-3 text-[13px] leading-relaxed text-ink/55">
            Ngọc Âm sẽ hồi đáp trong một ngày làm việc.
          </p>
        </div>
      </form>

      <QuietChatLinks zaloUrl={zaloUrl} messengerUrl={messengerUrl} />
    </LetterFrame>
  );
}

function QuietChatLinks({
  zaloUrl,
  messengerUrl,
}: {
  zaloUrl: string | null;
  messengerUrl: string | null;
}) {
  if (!zaloUrl && !messengerUrl) return null;

  return (
    <div className="mt-8 border-t border-walnut/10 pt-6">
      <p className="text-[13.5px] leading-relaxed text-ink/60">
        Nếu bạn muốn kết nối sớm hơn, có thể trò chuyện riêng cùng Ngọc Âm qua{" "}
        {zaloUrl && (
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-walnut underline decoration-walnut/30 underline-offset-2 hover:text-gold-deep"
          >
            Zalo
          </a>
        )}
        {zaloUrl && messengerUrl && " · "}
        {messengerUrl && (
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-walnut underline decoration-walnut/30 underline-offset-2 hover:text-gold-deep"
          >
            Messenger
          </a>
        )}
        .
      </p>
    </div>
  );
}

const inputClass =
  "min-h-11 border border-walnut/30 bg-transparent px-3 py-2.5 text-[15px] text-ink transition-colors duration-150 focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold";

function ReplyLetter({ interest, zaloUrl }: { interest: string; zaloUrl: string | null }) {
  return (
    <div role="status" aria-live="polite">
      <LetterFrame>
        <div className="lienhe-reply-panel">
          <p className="tracking-label text-[12px] font-medium uppercase text-gold-deep">
            Ngọc Âm đã nhận được lời nhắn
          </p>
          <h2 className="mt-3 font-heading text-2xl text-ink sm:text-3xl">Cảm ơn bạn đã chia sẻ.</h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/75">
            Chúng tôi sẽ đọc kỹ những điều bạn gửi và hồi đáp trong vòng một
            ngày làm việc để cùng bạn chọn cách trao đổi phù hợp.
          </p>
          {interest && (
            <p className="mt-5 text-[13.5px] text-ink/60">
              Điều bạn muốn cùng quan sát: <span className="text-walnut">{interest}</span>
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-label border-b border-gold pb-1 text-[12px] font-semibold uppercase text-walnut hover:text-gold-deep"
              >
                Nhắn Zalo ngay
              </a>
            )}
            <Link
              href="/dich-vu"
              className="tracking-label border-b border-walnut/30 pb-1 text-[12px] font-semibold uppercase text-walnut/70 hover:text-gold-deep"
            >
              Trở về dịch vụ
            </Link>
          </div>
        </div>
      </LetterFrame>
    </div>
  );
}

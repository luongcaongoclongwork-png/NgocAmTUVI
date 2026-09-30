"use client";

import Link from "next/link";
import "@/components/thuy-mac/chrome.css";
import "@/components/thuy-mac/kit.css";

/** Something failed while rendering: say so plainly, on the same paper, and offer a retry. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="ip">
      <section className="ipSec">
        <div className="ipSec-inner ipSec-inner--narrow ipOops">
          <h1 className="ipH2">Trang chưa mở được.</h1>
          <p className="ipIntro">Có trục trặc khi tải trang này. Bạn thử lại, hoặc quay về trang chủ; nếu vẫn chưa được, nhắn Ngọc Âm qua Zalo để được hỗ trợ.</p>
          <p className="ipWays">
            <button type="button" onClick={reset} className="ipBtn">Thử lại</button>
            <Link href="/" className="ipLink">Về trang chủ</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

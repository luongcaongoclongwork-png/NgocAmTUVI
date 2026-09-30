import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro, Cormorant_Garamond, Noto_Serif_Display } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import HideOnAdmin from "@/components/HideOnAdmin";
import NavProgress from "@/components/NavProgress";
import SiteChrome from "@/components/thuy-mac/SiteChrome";
import InkFooter from "@/components/thuy-mac/InkFooter";

// Playfair stays for /admin and the lá số tool, which keep the v1 look.
const heading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  // 900 added for Trung Cung's own legibility treatment (ngocAmChart.css's
  // ".center-info-label"/".center-info-value" etc) — without a real 900
  // font file loaded here, that CSS's font-weight:900 falls back to the
  // browser's synthetic/faux bold (stroke-expansion, not a real glyph),
  // which reads blurry rather than crisp (2026-09-18).
  // 700 added 2026-09-21: the print chart asks for 650/700 (Tu Hoa tags, the
  // XUYEN GIA label), which with no 700 file loaded snapped up to 900 (Black).
  // Be Vietnam Pro is a static family (100-step weights), so 650 resolves to 700.
  weight: ["300", "400", "500", "600", "700", "900"],
});

// Thuỷ Mặc design: Cormorant for headings, Noto Serif Display for the calendar numerals.
const inkDisplay = Cormorant_Garamond({
  variable: "--de-display",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inkNumerals = Noto_Serif_Display({
  variable: "--dd-num",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "500"],
});

export const metadata: Metadata = {
  title: "Ngọc Âm — Tử Vi · Phong Thuỷ",
  description:
    "Ngọc Âm – Tử Vi, Phong Thuỷ Hậu Nhân Khâm Thiên Giám, Vua Minh Mạng, Triều Nguyễn. Xuyên vấn Tử Vi, tư vấn Phong Thuỷ, tri thức Phật học và vật phẩm phong thuỷ.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${heading.variable} ${body.variable} ${inkDisplay.variable} ${inkNumerals.variable} h-full antialiased`}
      // The inline script below adds `js` before first paint; React must not
      // treat that extra class as a hydration mismatch.
      suppressHydrationWarning
    >
      <head>
        {/* Marks "JavaScript is running" so scroll-reveal content is only
            hidden when something will reveal it again (see .js .reveal). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-ink font-body">
        <Suspense fallback={null}>
          <NavProgress />
        </Suspense>
        {/* /admin has its own header; the printable chart has none. */}
        <SiteChrome />
        <main className="flex-1">{children}</main>
        <HideOnAdmin>
          <InkFooter />
        </HideOnAdmin>
      </body>
    </html>
  );
}

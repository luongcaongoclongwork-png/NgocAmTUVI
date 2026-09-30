---
name: "ngoc-am-web-design"
description: "Quy tắc thương hiệu và thiết kế web Ngọc Âm (Next.js): thuật ngữ Xuyên vấn / Diệm Bản, màu nâu–be, cung đình Nguyễn, Cửu Đỉnh, mây Đôn Hoàng, logo bất biến, giọng văn, SEO trung thực. Dùng khi thiết kế, sửa, soát hay làm lại giao diện web Ngọc Âm."
---

# Ngọc Âm — Web Design Rules (v2, 2026-09)

Use this skill for ANY work on the Ngọc Âm website: new pages, the redesign, component tweaks, copy edits, audits, motion, SEO. These rules sit ABOVE generic design skills (frontend-design, ui-ux-pro-max, design-critique, GSAP/CSS animation, Vercel/React best practices). When a generic skill suggests something that conflicts with this file, this file wins. Generic skills are still used for quality checks (accessibility, touch targets, performance, copy clarity).

## 1. Who Ngọc Âm is

- Full name: "Ngọc Âm - Tử Vi, Phong Thủy Hậu Nhân Khâm Thiên Giám, Vua Minh Mạng, Triều Nguyễn".
- Philosophical root: Đạo giáo – Phật giáo. Key differentiator: lineage "Hậu nhân Khâm Thiên Giám, Vua Minh Mạng, triều Nguyễn" — felt through imagery and tone, never boasted.
- Audience: 20–45, individuals, plus SME/large-business owners (Đại Chủ Sự). Positioning: premium, quiet luxury.
- Offer (all editable in /admin — never hardcode on a page):
  - **Tử Vi Xuyên Tam Diệm** — Xuyên vấn, định hướng, phát triển nội lực, chuyển hoá điều bất như ý. Xuyên giả: Cô Nguyễn Minh Trang.
  - **Phong Thủy Là Tịnh** — hòa hợp quy luật của đất, tịnh hóa không gian và nội tâm, thấy sự thật nguyên bản, tự chủ hướng đến thịnh vượng đích thực (dương trạch, âm trạch). Thầy Tịnh.
  - **Xuyên Vấn Đại Chủ Sự** — business coaching for the person steering a company (Diệm Bản + Maxwell Leadership question system).
  - Secondary worlds: Trà Đạo (Trà Sư Khương), Phật học, Kiến thức (articles), Cửa hàng (ngọc phỉ thuý, ngọc hoà điền, đá & đồ phong thuỷ), free tool "Lập lá số".

## 2. Brand language (terminology) — use exactly

The brand's own vocabulary replaced the older generic words in Sept 2026. Source: Ngọc Âm's printed price menus (`src/data/xuyenVanGlossary.ts`).

| Use | Meaning | Do NOT use (in brand/service copy) |
|---|---|---|
| **Xuyên vấn (川問)** | Ngọc Âm's way of reading: "Xuyên" = the river, "Vấn" = inquiring, reading continuously, looking straight at the matter | "khai vấn", "xem bói", "coi tử vi" |
| **Diệm Bản (焰版)** | The chart. "Diệm" = flame (inner energy), "Bản" = map | "lá số" (in service/brand copy) |
| **Xuyên giả (川者)** | The person who conducts the Xuyên vấn | "thầy bói", "chuyên gia" |
| **Chủ Sự (主事)** | The client: the one who is master of their own matter | "khách xem", "thân chủ" |
| **Đại Chủ Sự (大主事)** | The business owner / person steering a company | "sếp", "CEO" as a label |
| **Tử Vi Xuyên Tam Diệm** | The method name | — |

- Capitalise as shown: Xuyên vấn (verb/noun in running text), Diệm Bản, Chủ Sự, Đại Chủ Sự, Xuyên giả.
- The free self-service tool is still named "Lập lá số" (route `/lap-la-so`, `/la-so`). Renaming it to "Diệm Bản" is an OWNER DECISION — ask, don't change.
- Always proofread Vietnamese diacritics. Test strings: "Tử Vi Xuyên Tam Diệm", "Phong Thủy Là Tịnh", "Khâm Thiên Giám", "Xuyên vấn Đại Chủ Sự".

## 3. The site's single job

Introduce the brand and get visitors to BOOK A XUYÊN VẤN / CONSULTATION.

- Every section leads toward booking; end each major section with a quiet path to the booking form.
- The booking button is always reachable on mobile (sticky bottom bar or header button; respect safe-area insets).
- Booking form (`/lien-he`) is the most important screen: few fields, clear labels, Vietnamese errors that say what to fix, visible confirmation. It shows the package the visitor clicked (`?service=<id>`). Never promise a booking is confirmed unless the backend confirms it.
- Services and prices must be easy to find before the form. Prices display exactly as typed in admin via `formatPrice()` ("Từ 2.000.000 đ", "Liên hệ").

## 4. Visual direction

Mood: warm, deep, still. Brown and beige. A calm imperial landscape seen through a Zen window.

- **70% — Nguyễn-court landscape + Zen stillness.**
  - Primary image source: the **Cửu Đỉnh** (Nine Dynastic Urns, Huế, cast under Minh Mạng) — engraved mountains, rivers, estuaries, plants, creatures. Redraw as fine single-weight line illustrations for section art, headers, service icons.
  - Also: Huế landscapes (núi Ngự, sông Hương, lăng tẩm, Ngọ Môn silhouettes) as soft, low-contrast imagery.
  - Zen: generous white space, one idea per screen, slow rhythm, subtle dó paper texture, restraint.
- **30% — Dunhuang cloud bands ONLY** (tường vân) as section dividers, frame borders, corner ornaments, and a very slow drifting layer behind the hero. Recolor to brown/beige/bronze; never malachite green / vermilion.
  - FORBIDDEN from Dunhuang: flying apsaras, Buddha figures, cave murals, bodhisattvas, lotus thrones, any figurative element.
- Forbidden overall: fortune-telling clichés (crystal balls, zodiac wheels as decoration, tarot, mystical purple, stars-and-moon kitsch); Chinese imperial red-gold palette, dragons as decoration, Qing motifs; generic tech/SaaS looks (gradient blobs, glassmorphism, neon, big rounded cards everywhere, emoji).

### Avoid the "templated" look (from frontend-design, adapted)
The cream background + serif is OUR brand choice — keep it. But do not add generic template chrome on top of it:
- No tracked ALL-CAPS eyebrow label above every heading. Use one only where it carries real information (e.g. the group name "Tử Vi Xuyên Tam Diệm").
- Do not append "→" to every link/button; do not join every meta string with " · ".
- Numbered markers (01/02/03) only for real sequences (the consultation process).
- Not every section fades-and-slides-up. Spend motion on ONE orchestrated moment per page (hero clouds / a Cửu Đỉnh line drawing itself).
- Spend boldness in one place per page; everything else quiet.

## 5. Tokens

Colors (CSS variables; provide light AND dark):

| Token | Light | Dark | Use |
|---|---|---|---|
| --ink | #2B1F17 | #EFE3D1 | primary text |
| --muted | #6E5A49 | #B39E87 | secondary text |
| --paper | #EFE5D5 | #1B1410 | page background (dó paper / deep brown) |
| --raised | #F7F0E4 | #251C16 | surfaces on paper |
| --line | #D8C7AF | #3B2E24 | hairlines |
| --accent | #6B4A2F | #D6B98F | walnut: headings, primary button |
| --accent-soft | #E6D6BF | #33271E | tints, pill backgrounds |
| --bronze | #94733A | #C9A25A | ornaments, cloud bands, small highlights |

- Bronze/gold is an ornament colour, never large fills or body text. Text contrast ≥ 4.5:1 (check small caption browns and text over photos).
- Semantic colours (success/warning/error) stay separate from brand colours; the error red must not become a decorative accent.
- Current v1 site uses its own token names (ivory, parchment, walnut, gold, lacquer…) and has NO dark mode. The redesign must move to the table above.

Typography:
- Display: Cormorant Garamond (600) — headings only. (v1 uses Playfair Display; the redesign directions may propose an alternative, but the owner must approve any display face that is not Cormorant.)
- Body: Be Vietnam Pro (400/500/600).
- Both load the `vietnamese` subset via next/font. Never use a font without full Vietnamese support.
- Body 16px minimum, line length ~60–70 characters, serif body text gets extra line-height.

Shape: small radii (2–4px) or none. Thin rules and borders instead of heavy shadows.

## 6. Logo — immutable

Silver sphere, grey-to-black gradient, swirl stroke (`public/images/logo-mark.png`).
- Always the original file. Never recolor, redraw, recreate in CSS/SVG, stretch, crop, rotate, add effects, or animate it. Do not use AI logo generators.
- On brown backgrounds the silver logo is the one cool accent; give it clear space.
- If the file is missing, leave a clearly marked placeholder and say so.

## 7. Motion

- Slow, calm, sparse. Ambient cloud drift: CSS animation, 40–90s loops, low opacity.
- Scroll storytelling (GSAP ScrollTrigger allowed): gentle parallax between landscape layers, a Cửu Đỉnh line drawing tracing itself once.
- No bouncing, spinning, zooming, confetti, cursor trails, or motion on the logo.
- Always honor `prefers-reduced-motion`. Motion must not delay the booking CTA or hurt load time.
- v1 motion tokens (`--ease-out`, `--dur-fast/base/slow` in globals.css) are the baseline to keep.

## 8. Voice and copy (Vietnamese)

- Tone: Đạo gia nhưng có cơ sở, gần gũi, lịch sự, tôn trọng.
- Never superstitious or fear-based ("giải hạn gấp", "tai họa", "đổi vận thần kỳ", guarantees of luck or wealth). Tử Vi and phong thủy are tools for self-understanding and orientation.
- Short, clear sentences. Buttons state exactly what happens ("Đặt lịch Xuyên vấn", "Xem bảng giá"). An action keeps the same name through the flow.
- Errors: what happened + how to fix, in Vietnamese, next to the field.

## 9. Findability (SEO + AI assistants) — honest only

- Every page: unique `<title>` and meta description, one H1, real alt text, Open Graph image; `metadataBase` set.
- Provide `robots.txt`, `sitemap.xml`, `llms.txt`, and schema.org JSON-LD (Organization/LocalBusiness with the real address, phone, hours from site settings; Service with real prices; Article for posts).
- Facts (address, phone, hours, prices, lineage) stated plainly and consistently, read from `/admin/cai-dat` settings — never invented.
- Never hidden text, keyword stuffing, fake reviews, or text addressed to AI crawlers.

## 10. Project facts (for implementation)

- Repo `C:\Users\PCM\ngocam-tuvi` (GitHub `luongcaongoclongwork-png/NgocAmTUVI`). Next.js 16 App Router (read `node_modules/next/dist/docs/` — APIs differ from training data), React 19, Tailwind v4, better-sqlite3 (`data/articles.db`).
- Content lives in the DB and is managed in `/admin`: services (groups tu-vi / phong-thuy / dai-chu-su, with duration + note), consultants (photo), articles (markdown-lite body, cover alt), products, site settings, leads. Pages read it through `src/lib/*`. The redesign changes presentation, NOT this data layer.
- Use next/image for all imagery (sized, lazy, modern formats); the first screen must stay fast.
- Ornaments (cloud bands, Cửu Đỉnh lines) as inline SVG components using `currentColor`/CSS variables so they follow light/dark.
- Real labels, visible keyboard focus, 44px touch targets.
- Content migrations: run-once via `app_migrations` in db.ts; never delete admin-edited rows.

## 11. Workflow for changes

1. AUDIT FIRST, no code changes: review every page against this file plus the generic quality checks. Output a table: Page | Issue | Severity (critical / should fix / minor) | Proposed fix | Files. Stop for owner approval.
2. Redesign (v2) is built on a separate branch; v1 is frozen as git tag `web-v1`. Show 2–3 homepage directions first; the owner picks one before the rest of the site is rebuilt.
3. Fix/build in small batches, critical first. After each batch show before/after screenshots at desktop and mobile widths, light and dark.
4. Add motion last, after layout and content are approved.
5. Never change the logo, brand name, terminology, prices or service descriptions without the owner's explicit approval.

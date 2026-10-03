# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences of equal weight (confirmed by the owner, 2026-10-03):

- **Individuals who can afford a private reading**, roughly 20–45, at a turning point (work, relationships, a move, a decision) who want to understand themselves and their situation before acting. They pay for one particular master's reading, not for a generic horoscope.
- **Đại Chủ Sự**: owners and leaders of small, mid-size and large businesses who want counsel on direction, people and timing for the company they steer.

Both are high-budget clients. Their job on the site: decide whether to trust Ngọc Âm (who reads for me, why trust the lineage, what is a session like, what does it cost) and then book a Xuyên vấn.

## Product Purpose

Introduce Ngọc Âm and lead the visitor to book a Xuyên vấn or consultation. Success is a booking request through `/lien-he`, with the package the visitor chose carried in `?service=<id>`. Every page ends with a quiet path to that form.

Secondary purposes: a free self-service chart tool ("Lập lá số"), articles (Kiến thức), and the Trà Đạo, Phật học and shop (Cửa hàng: ngọc phỉ thuý, ngọc hoà điền, stones and feng-shui objects) worlds that support the brand.

## Positioning

Ngọc Âm is "Tử Vi, Phong Thủy hậu nhân Khâm Thiên Giám, Vua Minh Mạng, triều Nguyễn": the masters descend from the Nguyễn court's Khâm Thiên Giám (the imperial observatory). The lineage, together with named masters who read in person, is what a neighbouring fortune-telling site cannot truthfully claim. Philosophical root: Đạo giáo and Phật giáo. Tử Vi and phong thủy are tools for self-understanding and orientation, never prediction sold through fear.

## Operating Context

- Visitors arrive by three routes, all confirmed: a link sent over Zalo or Facebook (opened on a phone, often inside the Zalo/Facebook in-app browser), word-of-mouth referral followed by a name search, and Google search.
- The phone is therefore the first screen for most visitors; the in-app browsers of Zalo and Facebook are real environments to test.
- A session is a private reading with one named master (Xuyên giả), booked through the contact form, then arranged by Ngọc Âm.
- All business content is managed by the owner in `/admin` and stored in SQLite (`data/articles.db`): services (groups tu-vi / phong-thuy / dai-chu-su, with price, duration, note), consultants (name, field, bio, photo), articles, products, site settings (address, phone, hours, social links), and leads. Pages read it through `src/lib/*`. Design work changes presentation, never this data layer.

## Capabilities and Constraints

- Offer (wording and prices live in `/admin`; never hardcode them on a page):
  - **Tử Vi Xuyên Tam Diệm**: Xuyên vấn, orientation, developing inner strength, transforming what is unwelcome (chuyển hoá điều bất như ý). Xuyên giả: Cô Nguyễn Minh Trang.
  - **Phong Thủy Là Tịnh**: dương trạch and âm trạch. Thầy Tịnh.
  - **Xuyên Vấn Đại Chủ Sự**: business counsel for the person steering a company (Diệm Bản plus a leadership question system).
  - Trà Đạo with Trà Sư Khương; Phật học; Kiến thức articles; Cửa hàng.
- Free tool: "Lập lá số" (`/lap-la-so`; the chart page is Tử Vi Xuyên Tam Diệm only, the classic `/la-so` redirects to it). Its star-placement algorithm is not a design concern and must not be changed in design work. Renaming the tool to "Diệm Bản" is an open owner decision.
- Prices display exactly as typed in admin ("Từ 2.000.000 đ", "Liên hệ").
- A booking is never shown as confirmed unless the backend confirms it.
- Stack: Next.js 16 App Router (APIs differ from older versions; read `node_modules/next/dist/docs/`), React 19, Tailwind v4, better-sqlite3, Vitest.
- Never commit `.env.local`, `data/*.db` or `public/uploads`.
- Terminology, used exactly (from Ngọc Âm's printed price menus, `src/data/xuyenVanGlossary.ts`):
  - **Xuyên vấn (川問)**: Ngọc Âm's way of reading. Not "khai vấn", "xem bói", "coi tử vi".
  - **Diệm Bản (焰版)**: the chart, in brand and service copy. Not "lá số" there.
  - **Xuyên giả (川者)**: the person who conducts the Xuyên vấn. Not "thầy bói", "chuyên gia".
  - **Chủ Sự (主事)** / **Đại Chủ Sự (大主事)**: the client / the business owner. Not "khách xem", "thân chủ", "sếp", "CEO".
  - Clients are addressed as "quý hữu" in biographies.

## Brand Commitments

- Name: "Ngọc Âm". Full name: "Ngọc Âm - Tử Vi, Phong Thủy Hậu Nhân Khâm Thiên Giám, Vua Minh Mạng, Triều Nguyễn".
- Logo: the silver sphere with a grey-to-black gradient and swirl stroke, `public/images/logo-mark.png`. Immutable: never recolour, redraw, crop, animate or recreate it.
- Positioning register: premium, quiet luxury, heritage first. The owner judges every proposal by one test: does it honour the lineage (hậu nhân Khâm Thiên Giám) and the capability of the Xuyên giả? Mass-market patterns (prices on the first screen, many competing buttons, bento grids, quizzes, dashboard looks) lower perceived value and have been rejected.
- Copy the owner has fixed (do not rewrite without asking): the home opening's lineage line and reign, the three scrolls "Hiểu Mình · Thuận Thế · Vững Bước", the home lead (three sentences, 2026-10-03), and each master's biography as entered in admin.
- Voice: Vietnamese, Đạo-gia but grounded, close, courteous, respectful; short clear sentences. Never superstitious or fear-based ("giải hạn gấp", "tai họa", "đổi vận thần kỳ"), never guarantees of luck or wealth, no fortune-telling clichés.
- Buttons say exactly what happens ("Đặt Lịch Xuyên Vấn", "Xem bảng giá"), and an action keeps one name through the flow.
- Lineage facts, biographies and dates come only from the owner. Never invent them.
- Visual rules live in the project's design rules (`~/.claude/skills/ngoc-am-web-design/SKILL.md`) and, once written, DESIGN.md.

## Evidence on Hand

- Real: the three masters' names, roles, biographies and portrait photos (admin, `public/uploads`); the service list with prices and durations (admin); the lineage statement; the brand glossary; Ngọc Âm's own paintings and illustrations in `public/images`.
- Client testimonials: the owner has real testimonials with permission to publish and will send them (2026-10-03). Until they arrive, the site shows none; never write placeholder or invented testimonials.
- Absent, never to be fabricated: client counts, ratings, press coverage, awards, before/after outcomes, statistics of accuracy.

## Product Principles

1. **People and provenance first.** The reason to choose Ngọc Âm is who reads for you and where their knowledge comes from; lead with the masters and the lineage, not with features or prices.
2. **One quiet path to booking.** Every page leads calmly to the booking form; few actions, never pressure, never urgency.
3. **Self-understanding, not fortune-telling.** Tử Vi and phong thủy are presented as tools to understand oneself and decide well.
4. **Truth over persuasion.** Only facts the owner supplied; no invented proof, no promises of results.
5. **The phone is the first screen.** Most visitors open a shared link on a phone, often inside Zalo or Facebook; it must read and book well there.

## Accessibility & Inclusion

- Vietnamese with full diacritics everywhere; every font must carry the Vietnamese subset.
- Body text at least 16px; text contrast at least 4.5:1, including small captions and text over paintings.
- Touch targets at least 44×44px; visible keyboard focus; real labels and errors next to the field that say what to fix.
- Honour `prefers-reduced-motion`; motion never hides the booking button or key content.

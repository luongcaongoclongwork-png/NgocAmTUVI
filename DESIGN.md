---
name: Ngọc Âm
description: Tử Vi, Phong Thủy hậu nhân Khâm Thiên Giám — a painting in ink on dó paper.
colors:
  ink: "#2b1f17"
  muted-ink: "#5a4738"
  dó-paper: "#ece2ce"
  raised-paper: "#f6efe2"
  walnut: "#6b4a2f"
  walnut-tint: "#e4d5bd"
  bronze: "#94733a"
  hairline: "rgba(107, 74, 47, 0.3)"
  scroll-rod: "#4a3526"
  lead-ink: "#4a392c"
  reign-ink: "#5a4332"
  lacquer: "#a13a2f"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.006em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(26px, 1.2rem + 1.75vw, 44px)"
    fontWeight: 600
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(21px, 1.16rem + 0.6vw, 27px)"
    fontWeight: 600
  body:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    letterSpacing: "0.2em"
  numerals:
    fontFamily: "Noto Serif Display, Georgia, serif"
    fontWeight: 300
rounded:
  hairline: "2px"
  sm: "3px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 4vw, 48px)"
  touch: "44px"
  section: "clamp(80px, 11vw, 150px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.raised-paper}"
    rounded: "{rounded.sm}"
    padding: "0 26px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.walnut}"
    textColor: "{colors.raised-paper}"
  button-ghost:
    backgroundColor: "{colors.raised-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 26px"
    height: "52px"
  link-quiet:
    textColor: "{colors.walnut}"
    height: "44px"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "10px 12px"
    height: "44px"
---

# Design System: Ngọc Âm

## Overview

**Creative North Star: "A painting in ink on dó paper"**

Every page is a sheet of warm dó paper with a Huế landscape washed onto it in ink, and the words are written onto the painting the way a scholar writes a colophon beside a scroll painting: left-aligned, unhurried, in a few deliberate voices. The paper is the background, the walnut-brown ink is the text, bronze is the thin gilt of a mount, and the painting carries the colour. Nothing glows, floats or competes; depth comes from the painting fading into the paper, not from shadows.

The register is quiet luxury for a lineage house: a client with a large budget should feel they have entered a study of the Nguyễn court's Khâm Thiên Giám, not a website. Space is generous, one idea occupies one screen, and boldness is spent in one place per page (on the home page, the three hanging scrolls). Motion is a single brush stroke at the opening, never a show.

There is one look only: light, paper and ink. There is no dark mode, by the owner's decision (2026-10-03).

**Key Characteristics:**
- Warm dó paper ground, walnut and ink text, bronze only as a hairline ornament.
- Two voices of type: Cormorant Garamond writes, Be Vietnam Pro informs.
- Left-aligned text over Huế landscape paintings that fade into the paper.
- Small 3px corners, hairline borders, almost no shadow.
- One orchestrated moment per page; everything else is still.

## Colors

A narrow, warm, low-saturation palette of paper, brown ink and one bronze, with colour itself left to the paintings.

### Primary
- **Walnut Ink** (#6b4a2f): links, hover state of the primary button, the ghost button's border, the active-page stroke in the header, focus outlines. The brand's "accent", used sparingly on words that can be acted on.

### Secondary
- **Mount Bronze** (#94733a): ornaments only: the hairline under the lineage line, the underline of quiet links, the bronze rule beside a master's view, the focus underline of card titles. Never a fill, never body text.

### Neutral
- **Ink** (#2b1f17): body text, headings, the primary button's fill, the footer.
- **Muted Ink** (#5a4738): secondary text, captions, placeholders, the privacy note (6.8:1 on paper).
- **Lead Ink** (#4a392c): the home opening's lead sentences, a step softer than body text.
- **Reign Ink** (#5a4332): the small spaced capitals of the reign line ("Vua Minh Mạng · triều Nguyễn").
- **Dó Paper** (#ece2ce): the page ground.
- **Raised Paper** (#f6efe2): surfaces lifted from the page: the header veil, cards, the bottom bar, the ghost button, the menu sheet.
- **Walnut Tint** (#e4d5bd): soft tints and pill grounds.
- **Hairline** (rgba(107, 74, 47, 0.3)): borders and dividers.
- **Scroll Rod** (#4a3526): the wooden rods of the hanging scrolls.

### Semantic
- **Lacquer** (#a13a2f): form errors only. It is a warning colour, never a decorative accent.

### Named Rules
**The Painting Carries the Colour Rule.** The interface itself stays in paper, brown and bronze; any colour stronger than walnut comes from a painting or a portrait, never from a UI fill, gradient or badge.

**The Gilt Hairline Rule.** Bronze appears as lines a pixel or two thick, never as a filled area or as text.

## Typography

**Display Font:** Cormorant Garamond (with Georgia, serif), weights 500 and 600.
**Body Font:** Be Vietnam Pro (with system-ui, sans-serif), weights 400, 500 and 600.
**Numerals:** Noto Serif Display, for calendar and chart numerals. **Hán characters:** Noto Serif TC.
All load the Vietnamese subset through next/font. (Playfair Display remains only in `/admin` and the chart tool's v1 parts.)

**Character:** Cormorant is the brush, high-contrast and literary, for everything that is "written" (names, lineage, scrolls, headings); Be Vietnam Pro is the clear modern hand for everything that is "read or done" (prose, buttons, labels, forms).

### Hierarchy
- **Display** (Cormorant 500, scrolls up to 78px, lineage line up to 64px, line-height ~1.1): the home opening only: the lineage line and the three scrolls "Hiểu Mình · Thuận Thế · Vững Bước".
- **Name** (Cormorant 600, clamp(34px … 56px)): a master's name, a page title.
- **Headline** (Cormorant 600, clamp(26px … 44px)): section titles; always smaller than the page title.
- **Title** (Cormorant 600, clamp(21px … 27px)): card and item titles.
- **Lead** (Be Vietnam Pro 400, 16px phone → 17–19px tablet → 16.5–22px wide, line-height 1.7): opening paragraphs, one sentence per line where the owner wrote it so.
- **Body** (Be Vietnam Pro 400, 16px phone / 17px from 1024px, line-height 1.7, ~68 characters per line): all reading text. Long articles at 18px.
- **Label** (Be Vietnam Pro 500, 13–20px, letter-spacing 0.2–0.26em, uppercase): only the reign line and a few group names where the label carries real information.

### Named Rules
**The Two Hands Rule.** Cormorant writes, Be Vietnam Pro informs; no third family enters the public site.

**The 14px Floor Rule.** Nothing read is under 14px and reading text is never under 16px; reading sizes are whole pixels.

**The Glued Phrase Rule.** Vietnamese compound words and brand terms (Tử Vi, Phong Thuỷ, căn nguyên, Xuyên vấn…) never break across a line: glue them with a no-break space and break lines where the sense breaks.

## Layout

- **Page margin:** clamp(20px, 4vw, 48px) everywhere: header, sections, openings, footer and the phone's bottom bar share one axis. Content is capped near 1280px.
- **Alignment:** left-aligned text throughout, including the home opening; centred headlines are not used.
- **Openings:** full-viewport (100svh) painting with the text block anchored low on the left; on phones and tablets a paper gradient rises under the text so it reads over the painting. The painting's focal point is shifted per device (80% on phones, 97% on tablets) so the subject stays visible.
- **Rhythm:** one idea per screen; sections alternate between dó and raised paper; sections breathe with clamp(80px, 11vw, 150px) of vertical padding.
- **Breakpoints in use:** 480px (phone to large phone/tablet layout), 640px, 768px, 860px (header collapses to the menu), 1024px (desktop type and layout), 1180px and 1280px (header links drop away progressively). Range queries such as `(480px <= width < 1024px)` avoid fractional gaps.
- **Short screens:** sizes on the desktop opening are capped by viewport height (min(vw, vh)) so a 13-inch laptop keeps the booking button on the first screen.
- **Phone:** a fixed bottom bar ("Đặt Lịch Xuyên Vấn" + "Nhắn Zalo") appears once the opening's own buttons scroll away; it respects the safe-area inset.

## Elevation & Depth

The system is flat paper. Depth comes from the painting fading into the paper and from raised-paper surfaces with hairline borders, not from shadows. The few shadows are long, faint and warm-brown, used only where a surface genuinely floats.

### Shadow Vocabulary
- **Header settle** (`box-shadow: 0 10px 28px -22px rgba(43, 31, 23, 0.55)`): the header once the page scrolls under it.
- **Floating sheet** (`box-shadow: 0 18px 40px -24px rgba(43, 31, 23, 0.55)`): the open "Khám Phá" menu.
- **Tool card** (`box-shadow: 0 34px 60px -42px rgba(43, 31, 23, 0.5)`): the chart tool's form card.

### Named Rules
**The Paper Doesn't Float Rule.** Cards, sections and buttons sit on the paper; a shadow is allowed only for something that truly lies above the page (header, menu, tool card).

## Shapes

Small, quiet corners and thin lines. Buttons and inputs use a 3px radius (3px) or square corners; ornaments such as the scroll rods use 2–3px. The only round shape is the floating booking pill (999px). Borders are one-pixel hairlines in walnut at 30%. The recurring silhouette is the hanging scroll: a paper panel between two dark wooden rods that overhang it by 7px.

## Components

### Buttons
Restrained and solid, like a seal pressed once.
- **Shape:** gently squared (3px).
- **Primary:** ink fill with raised-paper text, 52px tall (50–58px on desktop, 54px on tablets), 26–40px side padding, Be Vietnam Pro 500, 15.5–17px. Hover and focus turn it walnut.
- **Ghost:** raised paper at 70% with a walnut hairline border and ink text; on hover/focus an ink wash spreads from the pointer (a circular clip-path, 550ms) and the text turns to paper.
- **Focus:** a 2px walnut outline, 3px offset, on every interactive element.
- **Pairing:** an opening carries at most two buttons: the booking action and one way to learn more.

### Quiet Links
- Walnut text with a bronze underline 6px below, at least 44px tall; the underline thickens on hover/focus. Used for secondary actions ("Đặt Lịch Xuyên Vấn Cùng Cô") instead of more buttons.

### Inputs / Fields
- **Style:** transparent ground, a walnut hairline at 30%, square corners, 44px minimum height, Be Vietnam Pro 16px on phones so iOS does not zoom.
- **Placeholder:** muted ink at full opacity.
- **Focus:** border turns gold with a 2px gold ring on keyboard focus.
- **Error:** lacquer border and a message next to the field saying what to fix; the submit button fills the form's width on phones.

### Navigation
- **Header:** fixed, 68px, a raised-paper veil (72%) over the header painting; the brand name in Cormorant 600; links in Be Vietnam Pro 500 15.5px with a short walnut brush stroke under the current or hovered word; a booking button at the right.
- **Below 1024px** the links collapse progressively into the compass "Khám Phá" menu: a raised-paper sheet, hairline border, links in Cormorant 600 ~25px, anchored to the page margins on phones.
- **Footer:** the ink that stayed: the footer painting under a deep ink veil (#1f1712 at 88–94%) with light paper text and a pale-gold accent.

### Hanging Scrolls (signature)
Three short vertical panels of paper between dark rods, each holding one Cormorant phrase ("Hiểu Mình", "Thuận Thế", "Vững Bước"), set as a staircase that rises left to right on the home page. They are brushed in once on load (a 0.9s clip reveal, staggered 0.3/0.45/0.6s) and are the page's single bold element.

### Lineage Line (signature)
The lineage "Hậu nhân Khâm Thiên Giám" in Cormorant 500 over a bronze hairline, with the reign "Vua Minh Mạng · triều Nguyễn" beneath in small spaced capitals. Used in the home opening; its proportions (display line ≈ 78% of the scrolls, reign ≈ 37% of the line) are fixed.

## Do's and Don'ts

### Do:
- **Do** keep the page a light paper-and-ink sheet; colour comes from the paintings and portraits.
- **Do** align text left on the shared clamp(20px, 4vw, 48px) margin.
- **Do** use Cormorant for what is written and Be Vietnam Pro for what is read or done.
- **Do** keep every touch target at least 44×44px and text contrast at least 4.5:1, including captions over paintings.
- **Do** spend motion on one moment per page (the scrolls brushing in, a painting settling) and honour reduced motion; booking buttons and key text are visible immediately.
- **Do** use the original logo file (`public/images/logo-mark.png`) untouched, with clear space around it.
- **Do** show master portraits in natural colour.

### Don't:
- **Don't** add a dark mode or dark-toned sections beyond the ink footer.
- **Don't** centre the main headings or the opening text.
- **Don't** use fortune-telling imagery (crystal balls, zodiac wheels as decoration, tarot, mystical purple, star-and-moon kitsch), Chinese imperial red-and-gold, dragons as decoration, or Dunhuang figures.
- **Don't** use SaaS or tech looks: gradient blobs, glassmorphism, neon, big rounded cards everywhere, bento grids, emoji.
- **Don't** put prices or long descriptions on the first screen or in the three pillar cards on the home page.
- **Don't** add pointer-following ripple effects or black-and-white portraits.
- **Don't** fade or slide every section in; no bouncing, spinning, zooming, confetti or cursor trails, and never animate the logo.
- **Don't** add a tracked uppercase eyebrow above every heading, an arrow after every link, or 01/02/03 markers on content that is not a sequence.
- **Don't** animate layout properties (padding, width, height); change colour or transform instead.

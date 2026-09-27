/**
 * The small formatting language of the article editor. Articles are stored
 * as paragraphs (split on blank lines, see parseBody); each paragraph
 * becomes one block:
 *
 *   ## Tiêu đề phụ          ### Tiêu đề nhỏ
 *   > Trích dẫn             - mục danh sách   (or "* ")    1. mục có số
 *   **đậm**   *nghiêng*   [chữ](https://… hoặc /đường-dẫn)
 *
 * Anything else is a normal paragraph (single line breaks are kept). No raw
 * HTML is ever produced: the renderer builds React elements, so text is
 * always escaped, and links only accept http(s) or site-relative paths.
 * Old articles (plain paragraphs) render exactly as before.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "b"; c: Inline[] }
  | { t: "i"; c: Inline[] }
  | { t: "a"; href: string; c: Inline[] }
  | { t: "br" };

export type Block =
  | { t: "p"; c: Inline[] }
  | { t: "h2"; c: Inline[] }
  | { t: "h3"; c: Inline[] }
  | { t: "quote"; c: Inline[] }
  | { t: "ul"; items: Inline[][] }
  | { t: "ol"; items: Inline[][] };

/** Editor text → stored paragraphs. Keeps single line breaks (lists need them), trims spaces. */
export function parseBody(raw: string): string[] {
  return raw
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((p) =>
      p
        .split("\n")
        .map((l) => l.replace(/[ \t]+/g, " ").trim())
        .filter(Boolean)
        .join("\n")
    )
    .filter(Boolean);
}

export function isSafeHref(href: string): boolean {
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  try {
    const u = new URL(href);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

const INLINE_RE = /\*\*(.+?)\*\*|\*(?!\s)(.+?)\*|_(?!\s)(.+?)_|\[([^\]]+)\]\(([^)\s]+)\)|\n/;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let rest = text;
  while (rest) {
    const m = INLINE_RE.exec(rest);
    if (!m) {
      out.push({ t: "text", v: rest });
      break;
    }
    if (m.index > 0) out.push({ t: "text", v: rest.slice(0, m.index) });
    if (m[0] === "\n") out.push({ t: "br" });
    else if (m[1] !== undefined) out.push({ t: "b", c: parseInline(m[1]) });
    else if (m[2] !== undefined || m[3] !== undefined) out.push({ t: "i", c: parseInline(m[2] ?? m[3]) });
    else if (m[4] !== undefined) {
      const inner = parseInline(m[4]);
      if (isSafeHref(m[5])) out.push({ t: "a", href: m[5], c: inner });
      else out.push(...inner); // unsafe link (javascript:, data:…): keep the words, drop the link
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

export function parseBlock(paragraph: string): Block {
  const lines = paragraph.split("\n");
  const h = /^(#{2,3})\s+(.+)$/.exec(paragraph);
  if (h && lines.length === 1) return h[1].length === 2 ? { t: "h2", c: parseInline(h[2]) } : { t: "h3", c: parseInline(h[2]) };
  if (lines.every((l) => /^>\s?/.test(l))) return { t: "quote", c: parseInline(lines.map((l) => l.replace(/^>\s?/, "")).join("\n")) };
  if (lines.every((l) => /^[-*]\s+/.test(l))) return { t: "ul", items: lines.map((l) => parseInline(l.replace(/^[-*]\s+/, ""))) };
  if (lines.every((l) => /^\d+[.)]\s+/.test(l))) return { t: "ol", items: lines.map((l) => parseInline(l.replace(/^\d+[.)]\s+/, ""))) };
  return { t: "p", c: parseInline(paragraph) };
}

/** Plain text of a paragraph (for read time, excerpts, search): markup stripped. */
export function plainText(paragraph: string): string {
  return paragraph
    .replace(/^#{2,3}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^([-*]|\d+[.)])\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/[*_](.+?)[*_]/g, "$1");
}

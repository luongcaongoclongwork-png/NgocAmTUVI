import { describe, expect, it } from "vitest";
import { isSafeHref, parseBlock, parseBody, parseInline, plainText } from "./article-markdown";

describe("parseBody", () => {
  it("splits on blank lines, keeps single line breaks, trims spaces", () => {
    expect(parseBody("Đoạn   một\n\n- a\n-   b\r\n\r\n\n  Đoạn ba  ")).toEqual(["Đoạn một", "- a\n- b", "Đoạn ba"]);
  });
});

describe("parseBlock", () => {
  it("recognises headings, quotes and lists", () => {
    expect(parseBlock("## Tiêu đề").t).toBe("h2");
    expect(parseBlock("### Nhỏ").t).toBe("h3");
    expect(parseBlock("> Câu trích").t).toBe("quote");
    expect(parseBlock("- a\n- b")).toMatchObject({ t: "ul", items: [[{ t: "text", v: "a" }], [{ t: "text", v: "b" }]] });
    expect(parseBlock("1. một\n2. hai").t).toBe("ol");
  });

  it("keeps old plain paragraphs exactly as paragraphs", () => {
    expect(parseBlock("Một đoạn văn bình thường, có dấu - gạch giữa câu.")).toEqual({
      t: "p",
      c: [{ t: "text", v: "Một đoạn văn bình thường, có dấu - gạch giữa câu." }],
    });
    expect(parseBlock("## mở đầu\nnhưng có hai dòng").t).toBe("p");
  });
});

describe("parseInline", () => {
  it("parses bold, italic and links", () => {
    expect(parseInline("a **đậm** và *nghiêng*")).toEqual([
      { t: "text", v: "a " },
      { t: "b", c: [{ t: "text", v: "đậm" }] },
      { t: "text", v: " và " },
      { t: "i", c: [{ t: "text", v: "nghiêng" }] },
    ]);
    expect(parseInline("[Liên hệ](/lien-he)")).toEqual([{ t: "a", href: "/lien-he", c: [{ t: "text", v: "Liên hệ" }] }]);
  });

  it("drops unsafe links but keeps their words", () => {
    expect(parseInline("[bấm](javascript:void0)")).toEqual([{ t: "text", v: "bấm" }]);
    // Nested parentheses: still no link is produced (a stray ")" may remain as text).
    const nested = parseInline("[bấm](javascript:alert(1))");
    expect(nested.some((n) => n.t === "a")).toBe(false);
    expect(nested[0]).toEqual({ t: "text", v: "bấm" });
    expect(isSafeHref("//evil.com")).toBe(false);
    expect(isSafeHref("https://ngocam.vn/x")).toBe(true);
  });

  it("never treats raw HTML as markup (it stays text, React escapes it)", () => {
    expect(parseInline("<script>x</script>")).toEqual([{ t: "text", v: "<script>x</script>" }]);
  });

  it("does not italicise an underscore inside a link URL", () => {
    expect(parseInline("[x](https://a.vn/a_b_c)")).toEqual([{ t: "a", href: "https://a.vn/a_b_c", c: [{ t: "text", v: "x" }] }]);
  });
});

describe("plainText", () => {
  it("strips markup for read-time / excerpts", () => {
    expect(plainText("## **Tiêu đề** với [link](https://a.vn)")).toBe("Tiêu đề với link");
  });
});

import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { parseBlock, type Inline } from "@/lib/article-markdown";

function renderInline(nodes: Inline[]): ReactNode[] {
  return nodes.map((n, i) => {
    switch (n.t) {
      case "text":
        return n.v;
      case "br":
        return <br key={i} />;
      case "b":
        return (
          <strong key={i} className="font-semibold text-ink">
            {renderInline(n.c)}
          </strong>
        );
      case "i":
        return <em key={i}>{renderInline(n.c)}</em>;
      case "a": {
        const external = /^https?:/.test(n.href);
        return (
          <a
            key={i}
            href={n.href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-walnut underline decoration-gold/60 underline-offset-2 hover:text-gold"
          >
            {renderInline(n.c)}
          </a>
        );
      }
    }
  });
}

/**
 * Renders an article's stored paragraphs with the editor's formatting
 * (headings, quotes, lists, bold/italic, links); see lib/article-markdown.ts.
 * Used by the public article page and the editor's live preview, so the
 * preview is exactly what visitors will see.
 */
export default function ArticleBody({ paragraphs, reveal = true }: { paragraphs: string[]; reveal?: boolean }) {
  return (
    <>
      {paragraphs.map((para, idx) => {
        const b = parseBlock(para);
        let el: ReactNode;
        if (b.t === "h2") el = <h2 className="pt-4 font-heading text-[26px] leading-snug text-ink">{renderInline(b.c)}</h2>;
        else if (b.t === "h3") el = <h3 className="pt-2 font-heading text-[21px] leading-snug text-ink">{renderInline(b.c)}</h3>;
        else if (b.t === "quote")
          el = <blockquote className="border-l-2 border-gold pl-5 font-heading text-[19px] italic leading-relaxed text-bronze">{renderInline(b.c)}</blockquote>;
        else if (b.t === "ul")
          el = (
            <ul className="list-disc space-y-1.5 pl-6 marker:text-gold">
              {b.items.map((it, i) => (
                <li key={i}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        else if (b.t === "ol")
          el = (
            <ol className="list-decimal space-y-1.5 pl-6 marker:text-gold-deep">
              {b.items.map((it, i) => (
                <li key={i}>{renderInline(it)}</li>
              ))}
            </ol>
          );
        else el = <p>{renderInline(b.c)}</p>;
        return reveal ? (
          <Reveal key={idx} delay={Math.min(idx, 6) * 60}>
            {el}
          </Reveal>
        ) : (
          <div key={idx}>{el}</div>
        );
      })}
    </>
  );
}

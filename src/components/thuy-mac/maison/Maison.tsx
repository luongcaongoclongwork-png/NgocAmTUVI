import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CuuDinhLandscape } from "../ornaments";
import type { Portrait } from "./people";
import "./maison.css";

/**
 * The chapters that put Ngọc Âm's people at the centre of the home: a client
 * paying for a Xuyên vấn is choosing a person, so each Xuyên giả gets a long
 * chapter and the lineage is said once, quietly.
 */

/** A portrait hung as a scroll: wooden rods, the photo washed to one ink tone. */
export function ScrollPortrait({ p, sizes, priority = false }: { p: Portrait; sizes: string; priority?: boolean }) {
  return (
    <span className="mScroll">
      <span className="mScroll-paint">
        {p.photo && <Image src={p.photo} alt={`Chân dung ${p.name}`} fill sizes={sizes} priority={priority} style={{ objectPosition: p.focus }} />}
      </span>
    </span>
  );
}

/** The lineage, said once: the Cửu Đỉnh carving itself, one sentence, one way further. */
export function LineageWhisper({ line }: { line: string }) {
  return (
    <section className="mLine" aria-label="Truyền thừa">
      <div className="mLine-carve" aria-hidden="true">
        <CuuDinhLandscape />
      </div>
      <p>{line}</p>
      <Link href="/ve-ngoc-am" className="ipLink">Về Ngọc Âm</Link>
    </section>
  );
}

/**
 * One person (or one world of the house) at length: portrait, name as the
 * largest words on the page after the hero, who they are, how they see the work.
 */
export function Chapter({
  id,
  portrait,
  field,
  title,
  about,
  view,
  reverse = false,
  tone = "paper",
  backdrop,
  portraitHref,
  children,
}: {
  id: string;
  portrait: Portrait;
  field: string;
  title: string;
  about: string;
  /** every paragraph of the bio after the first (the about line), shown together under one bronze rule */
  view?: string[];
  reverse?: boolean;
  tone?: "paper" | "raised";
  /** One of v1's section paintings, under a paper veil. */
  backdrop?: { image: string; position?: string };
  portraitHref: string;
  /** The chapter's links. */
  children: ReactNode;
}) {
  return (
    <section id={id} className={`mMaster mMaster--${tone} ${reverse ? "mMaster--rev" : ""} ${backdrop ? "mMaster--backdrop" : ""}`} aria-labelledby={`${id}-h`}>
      {backdrop && <Image src={backdrop.image} alt="" fill sizes="100vw" className="mMaster-bg" style={{ objectPosition: backdrop.position ?? "center" }} />}
      <div className="mMaster-inner">
        <Link href={portraitHref} className="mMaster-portrait" aria-hidden="true" tabIndex={-1}>
          <ScrollPortrait p={portrait} sizes="(min-width: 900px) 40vw, 90vw" />
        </Link>
        <div className="mMaster-text ip-r">
          <p className="mMaster-field">{field}</p>
          <h2 id={`${id}-h`}>{title}</h2>
          <p className="mMaster-about">{about}</p>
          {view && view.length > 0 && (
            <div className="mMaster-view">
              {view.map((v, i) => (
                <p key={i}>{v}</p>
              ))}
            </div>
          )}
          <div className="mMaster-links">{children}</div>
        </div>
      </div>
    </section>
  );
}

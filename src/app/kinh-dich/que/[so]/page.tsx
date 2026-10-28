import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { InkClose, InkHero, InkPage, InkSection } from "@/components/thuy-mac/kit";
import HexLines from "@/components/thuy-mac/kinh-dich/HexLines";
import { HEXAGRAMS, hexagramByNumber, hexagramOf, trigram } from "@/lib/kinh-dich";
import "@/components/thuy-mac/kinh-dich/kinh-dich.css";

/* One page per hexagram: its lines, trigrams, nuclear and opposite hexagrams, and (once written) its texts. */
export const generateStaticParams = () => HEXAGRAMS.map((q) => ({ so: String(q.so) }));

export async function generateMetadata({ params }: { params: Promise<{ so: string }> }): Promise<Metadata> {
  const q = hexagramByNumber(Number((await params).so));
  if (!q) return {};
  return { title: `${q.ten_xtd}, quẻ ${q.so} ${q.ten_goc} — Kinh Dịch Xuyên Tam Diệm`, description: q.hinh_tuong, alternates: { canonical: `/kinh-dich/que/${q.so}` } };
}

export default async function QuePage({ params }: { params: Promise<{ so: string }> }) {
  const q = hexagramByNumber(Number((await params).so));
  if (!q) notFound();
  const tren = trigram(q.quai_tren), duoi = trigram(q.quai_duoi);
  const noi = hexagramOf([...q.hao.slice(1, 4), ...q.hao.slice(2, 5)]);
  const doi = hexagramOf(q.hao.map((h) => 1 - h)); // every line changed
  const prev = hexagramByNumber(q.so === 1 ? 64 : q.so - 1)!, next = hexagramByNumber(q.so === 64 ? 1 : q.so + 1)!;
  const hao = (q.hao_tu ?? []) as (string | null)[];
  return (
    <InkPage>
      <InkHero
        compact
        scrolls={[q.ten_xtd]}
        lede={
          <>
            <p>Quẻ {q.so}, {q.ten_goc}</p>
            <small>{q.hinh_tuong}</small>
          </>
        }
      />
      <InkSection id="que">
        <div className="kdOne">
          <ViewTransition name={`kd-que-${q.so}`} share="kdMorph" default="none">
            <div><HexLines lines={q.hao} label={`${q.ten_xtd}, ${q.ten_goc}`} /></div>
          </ViewTransition>
          <dl className="kdFacts">
            <div><dt>Chữ khóa</dt><dd>{q.chu_khoa}</dd></div>
            <div><dt>Diệm</dt><dd>{q.diem}</dd></div>
            <div><dt>Ngoại Khám</dt><dd>{tren.ten_xtd} ({tren.ten}, {tren.tuong}), hành {tren.ngu_hanh}</dd></div>
            <div><dt>Nội Khám</dt><dd>{duoi.ten_xtd} ({duoi.ten}, {duoi.tuong}), hành {duoi.ngu_hanh}</dd></div>
            <div><dt>Nội Bích</dt><dd><Link href={`/kinh-dich/que/${noi.so}`} className="ipLink">{noi.ten_xtd}</Link> (quẻ {noi.so})</dd></div>
            <div><dt>Quẻ đối</dt><dd><Link href={`/kinh-dich/que/${doi.so}`} className="ipLink">{doi.ten_xtd}</Link> (quẻ {doi.so}, sáu nấc đều đổi)</dd></div>
          </dl>
        </div>
      </InkSection>
      <InkSection id="loi" title="Lời quẻ và lời sáu nấc" tone="raised">
        <p className="kdLoi">{q.thoan ?? <span className="kdSoon">Lời quẻ đang được Ngọc Âm biên soạn.</span>}</p>
        <ol className="kdHao">
          {[5, 4, 3, 2, 1, 0].map((i) => (
            <li key={i}>
              <HexLines lines={q.hao} moving={[i + 1]} small label={`Nấc ${i + 1} của ${q.ten_xtd}`} />
              <div>
                <b>Nấc {i + 1}</b>, {q.hao[i] ? "dương" : "âm"}
                <p>{hao[i] ?? <span className="kdSoon">Đang biên soạn.</span>}</p>
              </div>
            </li>
          ))}
        </ol>
      </InkSection>
      <InkSection id="tiep">
        <nav className="kdPager" aria-label="Quẻ trước và sau">
          <Link href={`/kinh-dich/que/${prev.so}`} className="ipLink">Quẻ {prev.so}: {prev.ten_xtd}</Link>
          <Link href="/kinh-dich#sau-muoi-tu-que" className="ipLink">Cả 64 quẻ</Link>
          <Link href={`/kinh-dich/que/${next.so}`} className="ipLink">Quẻ {next.so}: {next.ten_xtd}</Link>
        </nav>
        <div className="kdNext">
          <p>Muốn hỏi một việc cụ thể, hãy tự gieo một quẻ. Muốn đọc quẻ cùng Diệm Bản của bạn, hãy đặt một buổi Xuyên vấn.</p>
          <Link href="/kinh-dich#thinh-bich" className="ipBtn">Gieo Quẻ</Link>
          <Link href="/lien-he?topic=tu-vi" className="ipLink">Đặt Lịch Xuyên Vấn</Link>
        </div>
      </InkSection>
      <InkClose />
    </InkPage>
  );
}

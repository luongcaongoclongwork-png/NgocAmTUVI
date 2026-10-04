import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticlesByCategory } from "@/lib/articles";
import { nen } from "@/components/thuy-mac/Painting";
import { InkClose, InkHero, InkNotes, InkPage, InkProse, InkSection } from "@/components/thuy-mac/kit";
import {
  khuong,
  traDaoNgocAmIntro,
  traDaoSpiritQuote,
  traDaoSpiritExtra,
  traDaoSpiritClosing,
  taiQuanIntro,
  traDaoTaiQuan,
  traUlLanhIntro,
  traUlLanh,
  traBieuIntro,
  traBieuQuote,
  traBieuIntro2,
  traBieuCriteria,
  traBieuList,
  traBieuClosing,
  motChenTraClosing,
  motChenTraVows,
  type TraSanPham,
} from "@/data/traDao";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Trà Đạo — Ngọc Âm",
  description: "Trà Đạo Ngọc Âm cùng Trà Sư Khương: thuận tự nhiên mà pha, tĩnh tâm mà uống, chân thành mà đối đãi.",
};

/** Asking about one thing carries its name to the form, so nobody has to type it again. */
function askHref(name: string): string {
  return `/lien-he?topic=tra&item=${encodeURIComponent(name)}`;
}

function TeaItems({ items }: { items: TraSanPham[] }) {
  return (
    <div className="ipCols">
      {items.map((item) => (
        <div key={item.name} className="ipItem ip-r">
          {item.image && (
            <span className="ipFigure">
              <Image src={item.image} alt={item.imageAlt ?? item.name} fill sizes="(min-width: 900px) 30vw, 90vw" />
            </span>
          )}
          <h3>{item.name}</h3>
          {item.desc.map((d, i) => (
            <p key={i}>{d}</p>
          ))}
          <Link href={askHref(item.name)} className="ipLink">Hỏi về {item.name}</Link>
        </div>
      ))}
    </div>
  );
}

export default async function TraDaoPage() {
  const articles = await getArticlesByCategory("Trà đạo");

  return (
    <InkPage>
      <InkHero
        {...nen("H08")}
        alt="Bàn trà gỗ trên hiên nhà nhìn ra sông núi lúc bình minh, ấm trà bốc hơi"
        scrolls={["Đạo trong", "một chén trà"]}
        lede={<p>{khuong.signature}</p>}
      />

      <InkSection id="tra-su" narrow title={`${khuong.name}, Trà Sư Ngọc Âm`}>
        <blockquote className="ipVows ip-r" style={{ margin: "40px 0" }}>
          {khuong.poem.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </blockquote>
        <InkProse>
          {khuong.introBeforeThuan.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </InkProse>
        <p className="ipBig ip-r">{khuong.thuanWord}</p>
        <InkProse>
          {khuong.introAfterThuan.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </InkProse>
      </InkSection>

      <InkSection tone="raised" id="tra-dao-ngoc-am" narrow title="Trà là đầu câu chuyện">
        <InkProse>
          {traDaoNgocAmIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p>Tinh thần trà của Ngọc Âm được Khương gói lại trong hai câu:</p>
          <blockquote>
            {traDaoSpiritQuote.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </blockquote>
          <p>Và thêm một điều tưởng nhỏ, nhưng quan trọng:</p>
          <blockquote>{traDaoSpiritExtra}</blockquote>
          <p>{traDaoSpiritClosing}</p>
        </InkProse>
      </InkSection>

      <InkSection id="tai-quan" title="Trà Đạo tại quán" intro={taiQuanIntro.map((p, i) => <p key={i}>{p}</p>)}>
        <div className="ipCols">
          {traDaoTaiQuan.map((item) => (
            <div key={item.title} className="ipItem ip-r">
              <h3>{item.title}</h3>
              {item.desc.map((d, i) => (
                <p key={i}>{d}</p>
              ))}
              <Link href={askHref(item.title)} className="ipLink">Hỏi về {item.title}</Link>
            </div>
          ))}
        </div>
      </InkSection>

      <InkSection tone="raised" id="tra-u-lanh" title="Trà ủ lạnh" intro={traUlLanhIntro.map((p, i) => <p key={i}>{p}</p>)}>
        <TeaItems items={traUlLanh} />
      </InkSection>

      <InkSection
        id="tra-bieu"
        title="Trà biếu"
        intro={
          <>
            {traBieuIntro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: "1.3rem", color: "var(--ink)" }}>“{traBieuQuote}”</p>
            {traBieuIntro2.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p style={{ color: "var(--ink)", fontWeight: 500 }}>{traBieuCriteria}</p>
          </>
        }
      >
        <TeaItems items={traBieuList} />
        <div className="ipIntro">
          {traBieuClosing.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </InkSection>

      <InkSection tone="ink" narrow>
        <div className="ipIntro" style={{ marginInline: "auto", textAlign: "center" }}>
          {motChenTraClosing.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="ipVows ip-r" style={{ marginTop: 40 }}>
          {motChenTraVows.map((v, i) => (
            <p key={i}>{v}</p>
          ))}
        </div>
        <p className="ipBig" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: 0 }}>Lấy trà làm đầu câu chuyện.</p>
        <p className="ipSign">{khuong.name}, Trà Sư Ngọc Âm</p>
      </InkSection>

      {articles.length > 0 && (
        <InkSection id="doc-them" title="Đọc thêm về trà">
          <InkNotes articles={articles} />
        </InkSection>
      )}

      <InkClose href="/lien-he?topic=tra" label="Hỏi Về Trà" title="Một chén trà mở đầu câu chuyện." />
    </InkPage>
  );
}

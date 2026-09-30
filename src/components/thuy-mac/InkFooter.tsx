import Link from "next/link";
import { formatPrice } from "@/lib/service-constants";
import { getServicesByGroup } from "@/lib/services";
import { getFeaturedArticles } from "@/lib/articles";
import { getSiteSettings, socialLinks } from "@/lib/site-settings";
import { lunarDateLabel } from "./calendar";
import { MORE_LINKS, PATH_LINKS } from "./nav";

const GROUPS = [
  { id: "tu-vi", name: "Tử Vi Xuyên Tam Diệm" },
  { id: "phong-thuy", name: "Phong Thuỷ Là Tịnh" },
  { id: "dai-chu-su", name: "Xuyên Vấn Đại Chủ Sự" },
] as const;

/** "The ink that stayed": contact, every page, the latest notes, the full price list. */
export default async function InkFooter() {
  const [settings, notes, lists] = await Promise.all([
    getSiteSettings(),
    getFeaturedArticles(3),
    Promise.all(GROUPS.map((g) => getServicesByGroup(g.id))),
  ]);
  const legal = [settings.businessName, settings.taxCode && `MST ${settings.taxCode}`].filter(Boolean).join(", ");

  return (
    <footer className="tm tmFoot">
      <div className="tmFoot-grid">
        <div>
          <p className="tmFoot-brand">Ngọc Âm</p>
          <p>Tử Vi, Phong Thuỷ hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn.</p>
          {settings.address && <p>{settings.address}</p>}
          <p>{[settings.phone, settings.workingHours].filter(Boolean).join(", ")}</p>
          {settings.email && <p>{settings.email}</p>}
        </div>
        <nav aria-label="Các trang">
          <p className="tmFoot-h">Các trang</p>
          <ul>
            {[...PATH_LINKS, ...MORE_LINKS].map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="tmFoot-h">Mới trong Sổ tay</p>
          <ul className="tmFoot-notes">
            {notes.map((n) => (
              <li key={n.slug}>
                <Link href={`/kien-thuc/${n.slug}`}>
                  <small>{lunarDateLabel(n.createdAt)}</small>
                  {n.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="tmFoot-prices">
        <p className="tmFoot-h">Toàn bộ bảng giá</p>
        {GROUPS.map((g, i) => (
          <details key={g.id}>
            <summary>
              {g.name}
              <span>{lists[i].length} phiên</span>
            </summary>
            <ul>
              {lists[i].map((s) => (
                <li key={s.id}>
                  <Link href={`/lien-he?topic=${s.group}&service=${s.id}`}>
                    <span>{s.title}</span>
                    <b>
                      {formatPrice(s.price)}
                      {s.duration && <small>{s.duration}</small>}
                    </b>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <p className="tmFoot-social">
        {socialLinks(settings).map((s) => (
          <a key={s.label} href={s.href}>{s.label}</a>
        ))}
      </p>
      {legal && <p className="tmFoot-legal">{legal}</p>}
    </footer>
  );
}

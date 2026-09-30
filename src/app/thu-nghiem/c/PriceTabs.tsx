"use client";

import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import { formatPrice, type Service } from "@/lib/service-constants";

type Group = { id: string; name: string; href: string; items: readonly Service[] };

/** One group of the price list at a time; arrow keys move between tabs. */
export default function PriceTabs({ groups }: { groups: readonly Group[] }) {
  const [active, setActive] = useState(0);
  const uid = useId();

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + groups.length) % groups.length;
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };

  return (
    <div className="dC-tabs">
      <div role="tablist" aria-label="Nhóm dịch vụ" className="dC-tablist">
        {groups.map((g, i) => (
          <button
            key={g.id}
            id={`${uid}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${uid}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
          >
            {g.name}
          </button>
        ))}
      </div>
      {groups.map((g, i) => (
        <div key={g.id} id={`${uid}-panel-${i}`} role="tabpanel" aria-labelledby={`${uid}-tab-${i}`} hidden={i !== active} className="dC-panel">
          <ul>
            {g.items.map((s) => (
              <li key={s.id}>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  {s.note && <p className="dC-note">{s.note}</p>}
                </div>
                <div className="dC-buy">
                  <b>{formatPrice(s.price)}</b>
                  {s.duration && <span>{s.duration}</span>}
                  <Link href={`/lien-he?topic=${s.group}&service=${s.id}`} className="dC-btn dC-btn--line">Đặt phiên này</Link>
                </div>
              </li>
            ))}
          </ul>
          <Link href={g.href} className="dC-link">Tìm hiểu {g.name}</Link>
        </div>
      ))}
    </div>
  );
}

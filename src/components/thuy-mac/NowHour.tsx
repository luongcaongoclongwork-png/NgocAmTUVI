"use client";

import { useEffect, useState } from "react";

const BRANCHES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

/** The two-hour period (giờ) it is now in Vietnam: Tý = 23:00–00:59, then every two hours. */
function currentBranch(): string {
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", hourCycle: "h23" }).format(new Date()));
  return BRANCHES[Math.floor(((h + 1) % 24) / 2)];
}

/**
 * The twelve giờ of the day, the six hoàng đạo ones marked, and the one it
 * is now. The current-hour mark only appears after hydration (it depends on
 * the visitor's clock), so the server HTML never disagrees with the client.
 */
export default function NowHour({ hours }: { hours: { chi: string; range: string; good: boolean }[] }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(currentBranch());
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  const current = hours.find((h) => h.chi === now);

  return (
    <div className="dD-hours">
      <p className="dD-hours-title">
        Giờ hoàng đạo
        {current && (
          <span className="dD-now">
            Bây giờ là giờ {current.chi}
            {current.good ? ", giờ hoàng đạo" : ""}
          </span>
        )}
      </p>
      <ol>
        {hours.map((h) => (
          <li key={h.chi} className={`${h.good ? "is-good" : ""} ${h.chi === now ? "is-now" : ""}`} aria-current={h.chi === now ? "time" : undefined}>
            <b>{h.chi}</b>
            <span>{h.range}h</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

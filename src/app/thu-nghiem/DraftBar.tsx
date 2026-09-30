import Link from "next/link";

const DRAFTS = [
  { id: "d", name: "D · Lịch Khâm Thiên Giám" },
  { id: "a", name: "A" },
  { id: "b", name: "B" },
  { id: "c", name: "C" },
];

/** Fixed switcher on every draft, so the owner can flip between directions. */
export default function DraftBar({ current }: { current: "a" | "b" | "c" | "d" }) {
  return (
    <nav
      aria-label="Chọn hướng giao diện"
      style={{
        position: "fixed",
        insetInline: 0,
        bottom: 0,
        zIndex: 60,
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 12px calc(8px + env(safe-area-inset-bottom, 0px))",
        background: "rgba(20, 14, 10, 0.92)",
        color: "#EFE3D1",
        font: "500 13px/1.3 var(--font-body), system-ui, sans-serif",
      }}
    >
      <span style={{ opacity: 0.75, marginRight: 6 }}>Bản phác v2:</span>
      {DRAFTS.map((d) => (
        <Link
          key={d.id}
          href={`/thu-nghiem/${d.id}`}
          aria-current={d.id === current ? "page" : undefined}
          style={{
            padding: "8px 12px",
            minHeight: 36,
            border: "1px solid rgba(239, 227, 209, 0.35)",
            background: d.id === current ? "#EFE3D1" : "transparent",
            color: d.id === current ? "#1B1410" : "#EFE3D1",
            textDecoration: "none",
          }}
        >
          {d.name}
        </Link>
      ))}
    </nav>
  );
}

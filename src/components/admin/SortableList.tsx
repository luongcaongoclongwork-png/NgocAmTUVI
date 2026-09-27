"use client";

import { useState, useTransition, type ReactNode } from "react";
import type { EntityKey } from "@/lib/admin-entities";
import { reorderAction, setHiddenAction } from "@/app/admin/list-actions";

export type SortableItem = {
  id: number;
  hidden: boolean;
  /** Title/meta column (rendered on the server). */
  content: ReactNode;
  /** "Sửa" / "Xoá" links (rendered on the server). */
  actions: ReactNode;
};

const iconBtn =
  "flex h-8 w-8 items-center justify-center border border-walnut/20 text-[12px] text-walnut/70 hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-30";

/**
 * Admin list with reordering (▲▼ everywhere, drag-and-drop with a mouse)
 * and hide/show. Changes apply on screen immediately and are saved in the
 * background; if saving fails the list returns to how it was and says why.
 * `items` is one scope (e.g. all Tử Vi services), matching reorderAction.
 */
export default function SortableList({
  entity,
  items,
  hideable = true,
  emptyText,
}: {
  entity: EntityKey;
  items: SortableItem[];
  hideable?: boolean;
  emptyText: string;
}) {
  // Local order/visibility for instant feedback; reset whenever the server sends a new list.
  const serverKey = items.map((i) => `${i.id}:${i.hidden ? 1 : 0}`).join(",");
  const [state, setState] = useState({ key: serverKey, order: items.map((i) => i.id), hidden: new Set(items.filter((i) => i.hidden).map((i) => i.id)) });
  const current =
    state.key === serverKey ? state : { key: serverKey, order: items.map((i) => i.id), hidden: new Set(items.filter((i) => i.hidden).map((i) => i.id)) };
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [dragId, setDragId] = useState<number | null>(null);

  const byId = new Map(items.map((i) => [i.id, i]));
  const ordered = current.order.map((id) => byId.get(id)).filter((i): i is SortableItem => !!i);

  const saveOrder = (next: number[]) => {
    const prev = current;
    setState({ ...current, order: next });
    startTransition(async () => {
      const r = await reorderAction(entity, next);
      if (r.error) {
        setState(prev);
        setMessage({ ok: false, text: r.error });
      } else setMessage({ ok: true, text: "✓ Đã lưu thứ tự, website đã cập nhật." });
    });
  };

  const move = (id: number, delta: -1 | 1) => {
    const i = current.order.indexOf(id);
    const j = i + delta;
    if (j < 0 || j >= current.order.length) return;
    const next = [...current.order];
    [next[i], next[j]] = [next[j], next[i]];
    saveOrder(next);
  };

  const toggleHidden = (id: number) => {
    const prev = current;
    const willHide = !current.hidden.has(id);
    const hidden = new Set(current.hidden);
    if (willHide) hidden.add(id);
    else hidden.delete(id);
    setState({ ...current, hidden });
    startTransition(async () => {
      const r = await setHiddenAction(entity, id, willHide);
      if (r.error) {
        setState(prev);
        setMessage({ ok: false, text: r.error });
      } else setMessage({ ok: true, text: willHide ? "✓ Đã ẩn khỏi website." : "✓ Đã hiện lại trên website." });
    });
  };

  if (ordered.length === 0) return <p className="mt-4 text-sm text-ink/60">{emptyText}</p>;

  return (
    <div>
      <ul className="mt-3 divide-y divide-walnut/10 border-y border-walnut/10">
        {ordered.map((item, idx) => {
          const isHidden = current.hidden.has(item.id);
          return (
            <li
              key={item.id}
              draggable={ordered.length > 1}
              onDragStart={(e) => {
                setDragId(item.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                if (dragId === null || dragId === item.id) return;
                e.preventDefault();
                const next = current.order.filter((id) => id !== dragId);
                next.splice(next.indexOf(item.id) + (current.order.indexOf(dragId) < current.order.indexOf(item.id) ? 1 : 0), 0, dragId);
                setState({ ...current, order: next });
              }}
              onDragEnd={() => {
                if (dragId !== null && current.order.join() !== items.map((i) => i.id).join()) saveOrder(current.order);
                setDragId(null);
              }}
              className={`flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap ${dragId === item.id ? "bg-parchment/60" : ""}`}
            >
              {ordered.length > 1 && (
                <div className="flex shrink-0 items-center gap-1">
                  <span aria-hidden="true" title="Kéo để sắp xếp" className="hidden cursor-grab select-none px-1 text-walnut/40 sm:inline">
                    ⋮⋮
                  </span>
                  <button type="button" className={iconBtn} disabled={pending || idx === 0} onClick={() => move(item.id, -1)} aria-label="Đưa lên">
                    ▲
                  </button>
                  <button
                    type="button"
                    className={iconBtn}
                    disabled={pending || idx === ordered.length - 1}
                    onClick={() => move(item.id, 1)}
                    aria-label="Đưa xuống"
                  >
                    ▼
                  </button>
                </div>
              )}
              <div className={`min-w-0 flex-1 ${isHidden ? "opacity-50" : ""}`}>
                {isHidden && (
                  <span className="mb-1 inline-block border border-walnut/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-walnut/70">
                    Đang ẩn
                  </span>
                )}
                {item.content}
              </div>
              <div className="flex shrink-0 items-center gap-4 text-[13px]">
                {hideable && (
                  <button type="button" disabled={pending} onClick={() => toggleHidden(item.id)} className="text-walnut/70 hover:text-gold disabled:opacity-50">
                    {isHidden ? "Hiện" : "Ẩn"}
                  </button>
                )}
                {item.actions}
              </div>
            </li>
          );
        })}
      </ul>
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`mt-2 text-[13px] ${message.ok ? "text-sage" : "text-lacquer"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

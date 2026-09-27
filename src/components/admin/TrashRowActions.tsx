"use client";

import { useState, useTransition } from "react";
import type { EntityKey } from "@/lib/admin-entities";
import { purgeAction, restoreAction } from "@/app/admin/list-actions";

export default function TrashRowActions({ entity, id, name }: { entity: EntityKey; id: number; name: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ error: string | null }>) =>
    startTransition(async () => {
      const r = await fn();
      setError(r.error);
    });

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-4 text-[13px]">
      <button type="button" disabled={pending} onClick={() => run(() => restoreAction(entity, id))} className="text-walnut hover:text-gold disabled:opacity-50">
        Khôi phục
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(`Xoá vĩnh viễn “${name}”? Thao tác này không thể hoàn tác.`)) return;
          run(() => purgeAction(entity, id));
        }}
        className="text-lacquer hover:underline disabled:opacity-50"
      >
        Xoá vĩnh viễn
      </button>
      {error && <span role="alert" className="text-lacquer">{error}</span>}
    </div>
  );
}

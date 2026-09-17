/**
 * Types + fixed group list — kept separate from src/lib/services.ts (which
 * has `import "server-only"` for its DB access), same reasoning as
 * article-constants.ts: a Client Component form needs these at runtime for
 * its <select>, and importing any real value from a server-only module pulls
 * the whole module — DB code included — into the client bundle.
 */

export type ServiceGroup = "tu-vi" | "phong-thuy";

export type Service = {
  id: number;
  group: ServiceGroup;
  title: string;
  desc: string;
  price: string;
  sortOrder: number;
};

export type ServiceInput = {
  group: ServiceGroup;
  title: string;
  desc: string;
  price: string;
  sortOrder: number;
};

export const SERVICE_GROUPS: { value: ServiceGroup; label: string }[] = [
  { value: "tu-vi", label: "Tử Vi" },
  { value: "phong-thuy", label: "Phong Thuỷ" },
];

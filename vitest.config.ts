import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Resolves the `server-only` package's "react-server" export condition
    // (an empty module) instead of its default export (which throws
    // unconditionally outside Next's own RSC bundler) — needed to unit test
    // any lib that imports "server-only" (e.g. src/lib/contact-leads.ts).
    conditions: ["react-server"],
  },
  test: {
    environment: "node",
    // Several test files write to the one real SQLite file (data/articles.db,
    // there is no separate test DB). Run files one after another so e.g. a
    // "row count unchanged" assertion never sees another file's insert.
    fileParallelism: false,
    include: ["src/lib/tuvi/tests/**/*.test.ts", "src/**/*.test.ts"],
  },
});

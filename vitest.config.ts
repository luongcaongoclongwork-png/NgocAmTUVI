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
    include: ["src/lib/tuvi/tests/**/*.test.ts", "src/**/*.test.ts"],
  },
});

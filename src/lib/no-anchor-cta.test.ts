import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Regression guard: the site used to loop CTAs between /dich-vu and the
 * homepage's #lien-he anchor (see project history) before /lien-he became a
 * real page. Every source file that ever linked to that anchor is checked
 * here so a future edit can't silently reintroduce it.
 */
const FILES_THAT_USED_TO_LINK_HERE = [
  "src/components/Header.tsx",
  "src/components/Hero.tsx",
  "src/components/CtaBand.tsx",
  "src/components/Footer.tsx",
  "src/components/ServiceCard.tsx",
  "src/components/ConsultantProfile.tsx",
  "src/components/nav/MobileNav.tsx",
  "src/components/nav/navItems.ts",
  "src/app/cua-hang/page.tsx",
  "src/app/tra-dao/page.tsx",
];

describe("no CTA links to the retired #lien-he anchor", () => {
  for (const relPath of FILES_THAT_USED_TO_LINK_HERE) {
    it(`${relPath} does not contain "/#lien-he"`, () => {
      const contents = fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
      expect(contents).not.toContain("/#lien-he");
    });
  }
});

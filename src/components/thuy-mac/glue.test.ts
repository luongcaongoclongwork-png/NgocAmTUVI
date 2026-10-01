import { describe, expect, it } from "vitest";
import { glue } from "./glue";

const NBSP = "\u00a0";

describe("glue", () => {
  it("ties a name's syllables together and leaves the other spaces alone", () => {
    expect(glue("Từ truyền thống của triều Nguyễn đến đời sống hiện đại.")).toBe(`Từ truyền thống của triều${NBSP}Nguyễn đến đời sống hiện đại.`);
  });
  it("prefers the longest term and ignores case", () => {
    expect(glue("Xuyên Vấn Đại Chủ Sự")).toBe(`Xuyên${NBSP}Vấn Đại${NBSP}Chủ${NBSP}Sự`);
    expect(glue("Hậu nhân Khâm Thiên Giám")).toBe(`Hậu nhân Khâm${NBSP}Thiên${NBSP}Giám`);
  });
  it("leaves text without a known term unchanged", () => {
    expect(glue("Không chỉ xem vận")).toBe("Không chỉ xem vận");
  });
});

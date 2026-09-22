import { describe, expect, it } from "vitest";
import { cucTintKey } from "@/components/tuvi/xtd/xtdMotion";

describe("cucTintKey", () => {
  it("maps the five cuc to their pigment key", () => {
    expect(cucTintKey("Hỏa Lục Cục")).toBe("chu-sa");
    expect(cucTintKey("Kim Tứ Cục")).toBe("luu-kim");
    expect(cucTintKey("Thổ Ngũ Cục")).toBe("ao-tho");
    expect(cucTintKey("Thủy Nhị Cục")).toBe("nguyet-tuyen");
    expect(cucTintKey("Mộc Tam Cục")).toBe("ho-duong");
  });
  it("returns undefined for anything else", () => {
    expect(cucTintKey(undefined)).toBeUndefined();
    expect(cucTintKey("")).toBeUndefined();
  });
});

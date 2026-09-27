import { describe, expect, it } from "vitest";
import { defaultSettings, isSafeHttpUrl, socialLinks, telHref, validateSettings } from "./site-settings-schema";

describe("site settings", () => {
  it("defaults reproduce what the site showed before settings existed", () => {
    const d = defaultSettings({ NEXT_PUBLIC_ZALO_CONTACT_URL: "https://zalo.me/0775448989" });
    expect(d.phone).toBe("0775 448 989");
    expect(d.zaloUrl).toBe("https://zalo.me/0775448989");
    expect(d.tiktokUrl).toContain("tiktok.com");
  });

  it("only accepts real http(s) links", () => {
    expect(isSafeHttpUrl("https://www.facebook.com/x")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("data:text/html,x")).toBe(false);
    expect(isSafeHttpUrl("facebook.com/x")).toBe(false);
    expect(isSafeHttpUrl("https://localhost")).toBe(false);
  });

  it("validates each field and allows empty to hide it", () => {
    const bad = validateSettings({ email: "abc", phone: "gọi em", facebookUrl: "javascript:x", tiktokUrl: "" });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(Object.keys(bad.errors).sort()).toEqual(["email", "facebookUrl", "phone"]);

    const good = validateSettings({ email: " lienhe@ngocam.vn ", phone: "+84 775 448 989", facebookUrl: "https://facebook.com/ngocam" });
    expect(good.ok).toBe(true);
    if (good.ok) {
      expect(good.values.email).toBe("lienhe@ngocam.vn");
      expect(good.values.tiktokUrl).toBe("");
    }
  });

  it("orders socials with messaging first and TikTok last, skipping empty ones", () => {
    const s = { ...defaultSettings({}), zaloUrl: "https://zalo.me/0775448989", youtubeUrl: "" };
    expect(socialLinks(s).map((l) => l.label)).toEqual(["Zalo", "Facebook", "Instagram", "TikTok"]);
  });

  it("builds tel: links from any spacing", () => {
    expect(telHref("0775 448 989")).toBe("tel:0775448989");
    expect(telHref("+84 775.448.989")).toBe("tel:+84775448989");
  });
});

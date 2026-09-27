import "server-only";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { SETTING_FIELDS, defaultSettings, type SettingKey, type SiteSettings } from "@/lib/site-settings-schema";

export * from "@/lib/site-settings-schema";

/**
 * Current settings: saved values over the defaults. A key the admin saved as
 * empty stays empty (that is how an item is hidden). Cached per request, so
 * the footer, CTA band and contact page share one read.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const saved = getDb().prepare("SELECT key, value FROM site_settings").all() as { key: string; value: string }[];
  const settings = defaultSettings(process.env);
  const known = new Set<string>(SETTING_FIELDS.map((f) => f.key));
  for (const row of saved) if (known.has(row.key)) settings[row.key as SettingKey] = row.value;
  return settings;
});

export async function saveSiteSettings(values: SiteSettings): Promise<void> {
  const db = getDb();
  const upsert = db.prepare("INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
  db.transaction(() => {
    for (const f of SETTING_FIELDS) upsert.run(f.key, values[f.key]);
  })();
}

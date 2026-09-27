"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import { SETTING_FIELDS, saveSiteSettings, validateSettings, type SettingKey } from "@/lib/site-settings";
import { formatVietnamTime } from "@/lib/vn-time";

export type SettingsFormState = {
  error: string | null;
  fieldErrors: Partial<Record<SettingKey, string>>;
  savedAt: string | null;
  /**
   * What was submitted. React 19 resets a form's fields to their
   * defaultValue after every action, so the form uses these as its
   * defaultValues; otherwise a rejected save would wipe what the admin typed.
   */
  values: Partial<Record<SettingKey, string>> | null;
};

export async function saveSettingsAction(_prev: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  const submitted = Object.fromEntries(SETTING_FIELDS.map((f) => [f.key, String(formData.get(f.key) ?? "")])) as Record<SettingKey, string>;

  const session = await verifySession();
  if (!session) return { error: "Phiên đăng nhập đã hết hạn.", fieldErrors: {}, savedAt: null, values: submitted };

  const result = validateSettings(submitted);
  if (!result.ok)
    return { error: "Một số mục chưa đúng, xem ghi chú đỏ bên dưới.", fieldErrors: result.errors, savedAt: null, values: submitted };

  await saveSiteSettings(result.values);
  // Footer, CTA band and contact page appear on every public page.
  revalidatePath("/", "layout");
  return { error: null, fieldErrors: {}, savedAt: formatVietnamTime(new Date().toISOString()), values: result.values };
}

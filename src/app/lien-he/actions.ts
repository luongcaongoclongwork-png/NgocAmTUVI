"use server";

import { createLeadPublic } from "@/lib/contact-leads";

export type SubmitLeadState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | { status: "success"; interest: string };

export async function submitLeadAction(
  _prev: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  const result = await createLeadPublic({
    name: String(formData.get("name") || ""),
    phone: String(formData.get("phone") || ""),
    interest: String(formData.get("interest") || ""),
    message: String(formData.get("message") || ""),
    consent: String(formData.get("consent") || ""),
    // Hidden field real visitors never fill in — named to look plausible to bots.
    honeypot: String(formData.get("website") || ""),
  });

  if (!result.ok) return { status: "error", error: result.error };
  return { status: "success", interest: result.lead.interest };
}

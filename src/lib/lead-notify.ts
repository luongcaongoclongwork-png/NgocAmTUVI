import "server-only";
import { formatLeadMessage, type NotifiableLead } from "@/lib/lead-notify-format";
import { sendToAllChannels } from "@/lib/notify-channels";

/**
 * Tells the admin about a new lead on every configured channel (Zalo Bot,
 * Telegram). Runs inside after() from the contact form's Server Action, so
 * it never slows down or breaks the visitor's submission; the lead is
 * already safely saved before this is called.
 */
export async function notifyNewLead(lead: NotifiableLead): Promise<void> {
  const { errors } = await sendToAllChannels(formatLeadMessage(lead, process.env.SITE_URL));
  if (errors.length) console.error(`[lead-notify] lead #${lead.id}:`, errors.join(" | "));
}

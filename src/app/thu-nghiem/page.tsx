import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false } };

/** /thu-nghiem opens the first draft; the bar at the bottom switches between them. */
export default function DraftsIndex() {
  redirect("/thu-nghiem/d");
}

import type { Metadata } from "next";
import PrintPageClient from "@/components/tuvi/print/PrintPageClient";

export const metadata: Metadata = {
  title: "In lá số — Ngọc Âm",
};

export default function LaSoPrintPage() {
  return <PrintPageClient />;
}

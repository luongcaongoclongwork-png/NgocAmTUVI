import type { Metadata } from "next";
import XtdPrintPageClient from "@/components/tuvi/xtd/print/XtdPrintPageClient";

export const metadata: Metadata = {
  title: "In lá số — Xuyên Tam Diệm — Ngọc Âm",
};

export default function LaSoPrintXuyenTamDiemPage() {
  return <XtdPrintPageClient />;
}

import { permanentRedirect } from "next/navigation";

/** The classic print sheet is retired with the classic chart; old links print the Xuyên Tam Diệm sheet. */
export default async function LaSoPrintPage({ searchParams }: { searchParams: Promise<{ autoprint?: string }> }) {
  const { autoprint } = await searchParams;
  permanentRedirect(autoprint === "1" ? "/la-so/print/xuyen-tam-diem?autoprint=1" : "/la-so/print/xuyen-tam-diem");
}

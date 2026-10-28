import { permanentRedirect } from "next/navigation";

/** The site offers one chart, Xuyên Tam Diệm; the classic naming is kept in the code but no longer shown. */
export default function LaSoPage() {
  permanentRedirect("/la-so/xuyen-tam-diem");
}

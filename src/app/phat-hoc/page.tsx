import { permanentRedirect } from "next/navigation";

/** Phật học is now the second part of Sổ tay; old links keep working. */
export default function PhatHocPage() {
  permanentRedirect("/kien-thuc#phat-hoc");
}

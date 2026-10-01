import { permanentRedirect } from "next/navigation";

/** The six-scene scroll painting has been retired; old links land on the home. */
export default function TranhCuon() {
  permanentRedirect("/");
}

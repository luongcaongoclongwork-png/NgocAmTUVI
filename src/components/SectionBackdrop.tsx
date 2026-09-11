import Image from "next/image";

// Single blend layer: the image renders at full opacity, and `tint`
// (a semi-transparent section-color overlay) alone controls how much of
// it shows through. Do not also fade the <Image> itself — opacity on
// both layers compounds multiplicatively and the photo disappears
// almost entirely (e.g. 12% image opacity under an 88% tint leaves
// only ~1.4% of the photo visible).
export default function SectionBackdrop({
  image,
  alt = "",
  tint,
  position = "center",
}: {
  image: string;
  alt?: string;
  tint: string;
  /** CSS object-position — bias the cover-crop toward whichever corner/edge holds the artwork's detail, so it survives narrow (mobile) crops. */
  position?: string;
}) {
  return (
    <>
      <Image
        src={image}
        alt={alt}
        fill
        sizes="100vw"
        className="pointer-events-none object-cover"
        style={{ objectPosition: position }}
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className={`absolute inset-0 ${tint}`} />
      </div>
    </>
  );
}

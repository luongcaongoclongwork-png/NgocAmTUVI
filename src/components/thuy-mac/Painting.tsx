import { getImageProps } from "next/image";
import type { CSSProperties, Ref } from "react";

/** Phones (the same breakpoint the hero CSS uses) get the upright painting; tablets and computers keep the wide one. */
export const PHONE = "(width < 640px)";

/** The opening paintings, one per page: a wide 3840×2160 copy and an upright one drawn for phones. */
export function nen(ma: string) {
  return { image: `/images/nen/${ma}-ngang.webp`, imageTall: `/images/nen/${ma}-doc.webp`, tallRatio: ma === "H01" ? 1440 / 3120 : 1440 / 1800 };
}

/**
 * How wide a painting of this ratio is drawn when it covers a frame at most one screen tall: the screen width while
 * the screen is wider than the painting, otherwise the frame height times the ratio (cover enlarges it past the screen).
 * Saying only "100vw" made a tall window, a 16:10 laptop or a phone fetch a copy far too small, then stretch it.
 */
function coverSizes(ratio: number) {
  const [w, h] = ratio >= 1 ? [Math.round(ratio * 900), 900] : [900, Math.round(900 / ratio)];
  return `(min-aspect-ratio: ${w}/${h}) 100vw, ${Math.ceil(ratio * 100)}vh`;
}

/**
 * A full-bleed painting (next/image `fill`) that swaps to its upright version on phones, so a phone no longer shows a
 * thin, over-enlarged slice of a wide picture. Without `tall` it is a plain wide image.
 */
export default function Painting({
  src,
  tall,
  alt,
  className,
  style,
  priority = false,
  ratio = 16 / 9,
  tallRatio = 1440 / 1800,
  imgRef,
}: {
  src: string;
  tall?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  /** width / height of the wide painting and of the upright one */
  ratio?: number;
  tallRatio?: number;
  imgRef?: Ref<HTMLImageElement>;
}) {
  const common = { alt, fill: true, priority, quality: 85 } as const;
  const { props: wide } = getImageProps({ ...common, src, sizes: coverSizes(ratio) });
  const tallSizes = coverSizes(tallRatio);
  const upright = tall ? getImageProps({ ...common, src: tall, sizes: tallSizes }).props.srcSet : undefined;
  return (
    <picture>
      {upright && <source media={PHONE} srcSet={upright} sizes={tallSizes} />}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- the next/image props above carry alt, srcSet and sizes */}
      <img {...wide} ref={imgRef} className={className} style={{ ...wide.style, ...style }} />
    </picture>
  );
}
